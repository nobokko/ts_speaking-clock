// /*
//  * Copyright (c) 1988,1990,1993,1994,2021 by Paul Vixie ("VIXIE")
//  * Copyright (c) 2004 by Internet Systems Consortium, Inc. ("ISC")
//  * Copyright (c) 1997,2000 by Internet Software Consortium, Inc.
//  *
//  * Permission to use, copy, modify, and distribute this software for any
//  * purpose with or without fee is hereby granted, provided that the above
//  * copyright notice and this permission notice appear in all copies.
//  *
//  * THE SOFTWARE IS PROVIDED "AS IS" AND VIXIE DISCLAIMS ALL WARRANTIES
//  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
//  * MERCHANTABILITY AND FITNESS.  IN NO EVENT SHALL VIXIE BE LIABLE FOR
//  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
//  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
//  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT
//  * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
//  */

import { abort, chdir, chown, close, ctime, EINTR, endpwent, ENOENT, EOF, execlp, exit, fclose, fdopen, ferror, fflush, fgets, fileno, fopen, fork, fprintf, fstat, ftell, ftruncate, getegid, getenv, getgid, getopt, getpid, getpwnam, getpwuid, getuid, kill, LC_ALL, mkstemp, MY_GID, MY_UID, perror, PID_T, printf, putc, putchar, rename, rewind, setgid, setlocale, setuid, SIGHUP, SIGINT, signal, SIGQUIT, SIG_DFL, SIG_IGN, stderr, stdin, stdout, strcmp, strcpy, strerror, strlen, time, unlink, utime, waitpid, WAIT_T, WCOREDUMP, WEXITSTATUS, WIFEXITED, WIFSIGNALED, WIFSTOPPED, WSTOPSIG, WTERMSIG, WUNTRACED, _exit } from "./externs.h";
import { allowed, env_init, get_char, glue_strings, load_entry, load_env, log_it, set_cron_cwd, set_debug_flags, swap_uids, swap_uids_back } from "./funcs.h";
import { _string } from "./lib/string";
import { Debug, DMISC, ERR, ERROR_EXIT, FALSE, MAX_FNAME, MAX_TEMPSTR, MAX_UNAME, OK, OK_EXIT, ROOT_UID, Set_LineNum, TRUE } from "./macros.h";
import { CRON_ALLOW, CRON_DENY, EDITOR, SPOOL_DIR, _PATH_BSHELL, _PATH_DEVNULL, _PATH_TMP } from "./pathnames.h";
import { struct__passwd } from './lib/pwd';
import { struct__FILE } from "./lib/stdio";
import { errno } from "./lib/errno";
import { struct__stat } from "./lib/sys/stat";
import { struct__utimbuf, uid_t } from "./lib/sys/types";

import * as cron from "./cron";
import { entry } from "./structs.h";

// #if !defined(lint) && !defined(LINT)
// static char rcsid[] = "$Id: crontab.c,v 1.12 2004/01/23 18:56:42 vixie Exp $";
const rcsid = "$Id: crontab.c,v 1.12 2004/01/23 18:56:42 vixie Exp $";
// #endif

// /* crontab - install and manage per-user crontab files
//  * vix 02may87 [RCS has the rest of the log]
//  * vix 26jan87 [original]
//  */

// #define	MAIN_PROGRAM

// #include "cron.h"

// #define NHEADER_LINES 3
const NHEADER_LINES = 3;

enum opt_t { opt_unknown, opt_list, opt_delete, opt_edit, opt_replace };

// #if DEBUGGING
// static char	*Options[] = { "???", "list", "delete", "edit", "replace" };
const Options = ["???", "list", "delete", "edit", "replace"];
// static char	*getoptargs = "u:lerx:";
const getoptargs = "u:lerx:";
// #else
// static char	*getoptargs = "u:ler";
// #endif

// static	PID_T		Pid;
let Pid: PID_T;
// static	char		User[MAX_UNAME], RealUser[MAX_UNAME];
let User: _string = new _string;
let RealUser: _string = new _string;
// static	char		Filename[MAX_FNAME], TempFilename[MAX_FNAME];
let Filename: _string = new _string;
let TempFilename: _string = new _string;
// static	FILE		*NewCrontab;
let NewCrontab: struct__FILE | null = null;
// static	int		CheckErrorCount;
let CheckErrorCount = 0;
// static	enum opt_t	Option;
let Option: opt_t = opt_t.opt_unknown;
// static	struct passwd	*pw;
let pw: struct__passwd | null;
// static	void		list_cmd(void),
// 			delete_cmd(void),
// 			edit_cmd(void),
// 			poke_daemon(void),
// 			check_error(const char *),
// 			parse_args(int c, char *v[]),
// 			die(int);
// static	int		replace_cmd(void);

// static void
const usage = (msg: string) => {
	fprintf(stderr, "%s: usage error: %s\n", ProgramName, msg);
	fprintf(stderr, "usage:\t%s [-u user] file\n", ProgramName);
	fprintf(stderr, "\t%s [-u user] [ -e | -l | -r ]\n", ProgramName);
	fprintf(stderr, "\t\t(default operation is replace, per 1003.2)\n");
	fprintf(stderr, "\t-e\t(edit user's crontab)\n");
	fprintf(stderr, "\t-l\t(list user's crontab)\n");
	fprintf(stderr, "\t-r\t(delete user's crontab)\n");
	exit(ERROR_EXIT);
}

// int
export const main = (argc: number, argv: string[]) => {
	// int exitstatus;
	let exitstatus: number;

	Pid = getpid();
	ProgramName = argv[0];

	setlocale(LC_ALL, "");

	// #if defined(BSD)
	// 	setlinebuf(stderr);
	// #endif
	parse_args(argc, argv);		/* sets many globals, opens a file */
	set_cron_cwd();
	if (!allowed(RealUser.s, CRON_ALLOW, CRON_DENY)) {
		fprintf(stderr,
			"You (%s) are not allowed to use this program (%s)\n",
			User, ProgramName);
		fprintf(stderr, "See crontab(1) for more information\n");
		log_it(RealUser.s, Pid, "AUTH", "crontab command not allowed");
		exit(ERROR_EXIT);
	}
	exitstatus = OK_EXIT;
	switch (Option) {
		case opt_t.opt_unknown:
			exitstatus = ERROR_EXIT;
			break;
		case opt_t.opt_list:
			list_cmd();
			break;
		case opt_t.opt_delete:
			delete_cmd();
			break;
		case opt_t.opt_edit:
			edit_cmd();
			break;
		case opt_t.opt_replace:
			if (replace_cmd() < 0)
				exitstatus = ERROR_EXIT;
			break;
		default:
			abort();
	}
	exit(exitstatus);
	/*NOTREACHED*/
}

// static void
const parse_args = (argc: number, argv: string[]) => {
	// int argch;
	let argch: number;

	if (!(pw = getpwuid(getuid()))) {
		fprintf(stderr, "%s: your UID isn't in the passwd file.\n",
			ProgramName);
		fprintf(stderr, "bailing out.\n");
		exit(ERROR_EXIT);
	}
	if (pw == null) pw = new struct__passwd;
	if (strlen(pw.pw_name) >= MAX_UNAME) {
		fprintf(stderr, "username too long\n");
		exit(ERROR_EXIT);
	}
	strcpy(User, pw.pw_name);
	strcpy(RealUser, User.s);
	// Filename[0] = '\0';
	Filename.setString('');
	Option = opt_t.opt_unknown;
	while (-1 != (argch = getopt(argc, argv, getoptargs))) {
		switch (argch) {
			// #if DEBUGGING
			case 'x'.charCodeAt(0):
				if (!set_debug_flags(globalThis.optarg))
					usage("bad debug option");
				break;
			// #endif
			case 'u'.charCodeAt(0):
				if (MY_UID(pw) != ROOT_UID) {
					fprintf(stderr,
						"must be privileged to use -u\n");
					exit(ERROR_EXIT);
				}
				if (!(pw = getpwnam(globalThis.optarg))) {
					fprintf(stderr, "%s:  user `%s' unknown\n",
						ProgramName, globalThis.optarg);
					exit(ERROR_EXIT);
				}
				if (strlen(globalThis.optarg) >= MAX_UNAME)
					usage("username too long");
				strcpy(User, globalThis.optarg);
				break;
			case 'l'.charCodeAt(0):
				if (Option != opt_t.opt_unknown)
					usage("only one operation permitted");
				Option = opt_t.opt_list;
				break;
			case 'r'.charCodeAt(0):
				if (Option != opt_t.opt_unknown)
					usage("only one operation permitted");
				Option = opt_t.opt_delete;
				break;
			case 'e'.charCodeAt(0):
				if (Option != opt_t.opt_unknown)
					usage("only one operation permitted");
				Option = opt_t.opt_edit;
				break;
			default:
				usage("unrecognized option");
		}
	}

	endpwent();

	if (Option != opt_t.opt_unknown) {
		// if (argv[globalThis.optind] != null)
		if (argv.length > globalThis.optind)
			usage("no arguments permitted after this option");
	} else {
		// if (argv[globalThis.optind] != null) {
		if (argv.length > globalThis.optind) {
			Option = opt_t.opt_replace;
			if (strlen(argv[globalThis.optind]) >= MAX_FNAME)
				usage("filename too long");
			strcpy(Filename, argv[globalThis.optind]);
		} else
			usage("file name must be specified for replace");
	}

	if (Option == opt_t.opt_replace) {
		/* we have to open the file here because we're going to
		 * chdir(2) into /var/cron before we get around to
		 * reading the file.
		 */
		if (!strcmp(Filename.s, "-"))
			NewCrontab = stdin;
		else {
			/* relinquish the setuid status of the binary during
			 * the open, lest nonroot users read files they should
			 * not be able to read.  we can't use access() here
			 * since there's a race condition.  thanks go out to
			 * Arnt Gulbrandsen <agulbra@pvv.unit.no> for spotting
			 * the race.
			 */

			if (swap_uids() < OK) {
				perror("swapping uids");
				exit(ERROR_EXIT);
			}
			if (!(NewCrontab = fopen(Filename.s, "r"))) {
				perror(Filename.s);
				exit(ERROR_EXIT);
			}
			if (swap_uids_back() < OK) {
				perror("swapping uids back");
				exit(ERROR_EXIT);
			}
		}
	}

	Debug(DMISC, "user=%s, file=%s, option=%s\n",
		User, Filename, Options[Option]);
}

// static void
const list_cmd = () => {
	// char n[MAX_FNAME];
	let n: _string = new _string;
	// FILE *f;
	let f: struct__FILE | null = null;
	// int ch;
	let ch: number;

	log_it(RealUser.s, Pid, "LIST", User.s);
	if (!glue_strings(n, MAX_FNAME, SPOOL_DIR, User.s, '/')) {
		fprintf(stderr, "path too long\n");
		exit(ERROR_EXIT);
	}
	if (!(f = fopen(n.s, "r"))) {
		if (errno == ENOENT)
			fprintf(stderr, "no crontab for %s\n", User);
		else
			perror(n.s);
		exit(ERROR_EXIT);
	}

	/* file is open. copy to stdout, close.
	 */
	Set_LineNum(1)
	while (EOF != (ch = get_char(f)))
		putchar(ch);
	fclose(f);
}

// static void
const delete_cmd = () => {
	// char n[MAX_FNAME];
	let n: _string = new _string;

	log_it(RealUser.s, Pid, "DELETE", User.s);
	if (!glue_strings(n, MAX_FNAME, SPOOL_DIR, User.s, '/')) {
		fprintf(stderr, "path too long\n");
		exit(ERROR_EXIT);
	}
	if (unlink(n.s) != 0) {
		if (errno == ENOENT)
			fprintf(stderr, "no crontab for %s\n", User);
		else
			perror(n.s);
		exit(ERROR_EXIT);
	}
	poke_daemon();
}

// static void
const check_error = (msg: string) => {
	CheckErrorCount++;
	fprintf(stderr, "\"%s\":%d: %s\n", Filename, LineNumber - 1, msg);
}

// static void
const edit_cmd = () => {
	// char n[MAX_FNAME], q[MAX_TEMPSTR], *editor;
	let n: _string = new _string;
	let q: _string = new _string;
	let editor;
	// FILE *f;
	let f: struct__FILE | null;
	// int ch, t, x;
	let ch: number;
	let t: number;
	let x: number;
	// struct stat statbuf;
	let statbuf: struct__stat = new struct__stat;
	// struct utimbuf utimebuf;
	let utimebuf: struct__utimbuf = new struct__utimbuf;
	// WAIT_T waiter;
	let waiter: number[] = [0];
	// PID_T pid, xpid;
	let pid: PID_T;
	let xpid: PID_T;

	const fatal = () => {
		unlink(Filename.s);
		exit(ERROR_EXIT);
	};

	const done = () => {
		log_it(RealUser.s, Pid, "END EDIT", User.s);
	};

	const remove = () => {
		unlink(Filename.s);
		//  done:
		// 	log_it(RealUser.s, Pid, "END EDIT", User.s);
		done();
	};

	log_it(RealUser.s, Pid, "BEGIN EDIT", User.s);
	if (!glue_strings(n, MAX_FNAME, SPOOL_DIR, User.s, '/')) {
		fprintf(stderr, "path too long\n");
		exit(ERROR_EXIT);
	}
	if (!(f = fopen(n.s, "r"))) {
		if (errno != ENOENT) {
			perror(n.s);
			exit(ERROR_EXIT);
		}
		fprintf(stderr, "no crontab for %s - using an empty one\n",
			User);
		if (!(f = fopen(_PATH_DEVNULL, "r"))) {
			perror(_PATH_DEVNULL);
			exit(ERROR_EXIT);
		}
	}

	if (fstat(fileno(f), statbuf) < 0) {
		perror("fstat");
		// goto fatal;
		fatal();
	}
	utimebuf.actime = statbuf.st_atime;
	utimebuf.modtime = statbuf.st_mtime;

	/* Turn off signals. */
	signal(SIGHUP, SIG_IGN);
	signal(SIGINT, SIG_IGN);
	signal(SIGQUIT, SIG_IGN);

	if (!glue_strings(Filename, MAX_FNAME, _PATH_TMP,
		"crontab.XXXXXXXXXX", '/')) {
		fprintf(stderr, "path too long\n");
		// goto fatal;
		fatal();
	}
	if (-1 == (t = mkstemp(Filename.s))) {
		perror(Filename.s);
		// goto fatal;
		fatal();
	}
	// #ifdef HAS_FCHOWN
	// 	if (fchown(t, MY_UID(pw), MY_GID(pw)) < 0) {
	// 		perror("fchown");
	// 		goto fatal;
	// 	}
	// #else
	if (chown(Filename.s, MY_UID(pw), MY_GID(pw)) < 0) {
		perror("chown");
		// goto fatal;
		fatal();
	}
	// #endif
	if (!(NewCrontab = fdopen(t, "r+"))) {
		perror("fdopen");
		// goto fatal;
		fatal();
	}

	Set_LineNum(1);

	/* ignore the top few comments since we probably put them there.
	 */
	x = 0;
	while (EOF != (ch = get_char(f))) {
		if ('#'.charCodeAt(0) != ch) {
			putc(ch, NewCrontab);
			break;
		}
		while (EOF != (ch = get_char(f)))
			if (ch == '\n'.charCodeAt(0))
				break;
		if (++x >= NHEADER_LINES)
			break;
	}

	/* copy the rest of the crontab (if any) to the temp file.
	 */
	if (EOF != ch)
		while (EOF != (ch = get_char(f)))
			putc(ch, NewCrontab);
	fclose(f);
	if (fflush(NewCrontab) < OK) {
		perror(Filename.s);
		exit(ERROR_EXIT);
	}
	utime(Filename.s, utimebuf);
	again:
	while (true) {
		rewind(NewCrontab);
		if (ferror(NewCrontab)) {
			fprintf(stderr, "%s: error while writing new crontab to %s\n",
				ProgramName, Filename);
			fatal:
			unlink(Filename.s);
			exit(ERROR_EXIT);
		}

		if (((editor = getenv("VISUAL")) == null || editor == '') &&
			((editor = getenv("EDITOR")) == null || editor == '')) {
			editor = EDITOR;
		}

		/* we still have the file open.  editors will generally rewrite the
		 * original file rather than renaming/unlinking it and starting a
		 * new one; even backup files are supposed to be made by copying
		 * rather than by renaming.  if some editor does not support this,
		 * then don't use it.  the security problems are more severe if we
		 * close and reopen the file around the edit.
		 */

		switch (pid = fork()) {
			case -1:
				perror("fork");
				// goto fatal;
				fatal();
			case 0:
				/* child */
				if (setgid(MY_GID(pw)) < 0) {
					perror("setgid(getgid())");
					exit(ERROR_EXIT);
				}
				if (setuid(MY_UID(pw)) < 0) {
					perror("setuid(getuid())");
					exit(ERROR_EXIT);
				}
				if (chdir(_PATH_TMP) < 0) {
					perror(_PATH_TMP);
					exit(ERROR_EXIT);
				}
				if (!glue_strings(q, MAX_TEMPSTR, editor, Filename.s, ' ')) {
					fprintf(stderr, "%s: editor command line too long\n",
						ProgramName);
					exit(ERROR_EXIT);
				}
				execlp(_PATH_BSHELL, _PATH_BSHELL, "-c", q.s, 0);
				perror(editor);
				exit(ERROR_EXIT);
			/*NOTREACHED*/
			default:
				/* parent */
				break;
		}

		/* parent */
		for (; ;) {
			xpid = waitpid(pid, waiter, WUNTRACED);
			if (xpid == -1) {
				if (errno != EINTR)
					fprintf(stderr, "%s: waitpid() failed waiting for PID %ld from \"%s\": %s\n",
						ProgramName, pid, editor, strerror(errno));
			} else if (xpid != pid) {
				fprintf(stderr, "%s: wrong PID (%ld != %ld) from \"%s\"\n",
					ProgramName, xpid, pid, editor);
				// goto fatal;
				fatal();
			} else if (WIFSTOPPED(waiter[0])) {
				kill(getpid(), WSTOPSIG(waiter[0]));
			} else if (WIFEXITED(waiter[0]) && WEXITSTATUS(waiter)) {
				fprintf(stderr, "%s: \"%s\" exited with status %d\n",
					ProgramName, editor, WEXITSTATUS(waiter));
				// goto fatal;
				fatal();
			} else if (WIFSIGNALED(waiter[0])) {
				fprintf(stderr,
					"%s: \"%s\" killed; signal %d (%score dumped)\n",
					ProgramName, editor, WTERMSIG(waiter[0]),
					WCOREDUMP(waiter[0]) ? "" : "no ");
				// goto fatal;
				fatal();
			} else
				break;
		}
		signal(SIGHUP, SIG_DFL);
		signal(SIGINT, SIG_DFL);
		signal(SIGQUIT, SIG_DFL);
		if (fstat(t, statbuf) < 0) {
			perror("fstat");
			// goto fatal;
			fatal();
		}
		if (utimebuf.modtime == statbuf.st_mtime) {
			fprintf(stderr, "%s: no changes made to crontab\n",
				ProgramName);
			// goto remove;
			remove(); return;
		}
		fprintf(stderr, "%s: installing new crontab\n", ProgramName);
		switch (replace_cmd()) {
			case 0:
				break;
			case -1:
				for (; ;) {
					printf("Do you want to retry the same edit? ");
					fflush(stdout);
					// q[0] = '\0';
					q.setString('');
					fgets(q, MAX_TEMPSTR, stdin);
					// switch (q[0]) {
					switch (q.s.charAt(0)) {
						case 'y':
						case 'Y':
							// goto again;
							continue again;
						case 'n':
						case 'N':
							// goto abandon;
							fprintf(stderr, "%s: edits left in %s\n",
								ProgramName, Filename);
							// goto done;
							done(); return;
						default:
							fprintf(stderr, "Enter Y or N\n");
					}
				}
			/*NOTREACHED*/
			case -2:
				abandon:
				fprintf(stderr, "%s: edits left in %s\n",
					ProgramName, Filename);
				// goto done;
				done(); return;
			default:
				fprintf(stderr, "%s: panic: bad switch() in replace_cmd()\n",
					ProgramName);
				// goto fatal;
				fatal();
		}
		//  remove:
		// 	unlink(Filename.s);
		// //  done:
		// // 	log_it(RealUser.s, Pid, "END EDIT", User.s);
		//     done();
		remove();
		break;
	}
}

/* returns	0	on success
 *		-1	on syntax error
 *		-2	on install error
 */
// static int
const replace_cmd = () => {
	// char n[MAX_FNAME], envstr[MAX_ENVSTR];
	let n: _string = new _string;
	let envstr: _string = new _string;
	// FILE *tmp;
	let tmp: struct__FILE | null = null;
	// int ch, eof, fd;
	let ch: number, eof: number, fd: number;
	// int error = 0;
	let error = 0;
	// entry *e;
	let e: entry | null = null;
	// uid_t file_owner;
	let file_owner: uid_t;
	// time_t now = time(NULL);
	let now = time(null);
	// char **envp = env_init();
	let envp = env_init();

	const done = () => {
		signal(SIGHUP, SIG_DFL);
		signal(SIGINT, SIG_DFL);
		signal(SIGQUIT, SIG_DFL);
		if (TempFilename.s.length) {
			unlink(TempFilename.s);
			TempFilename.setString('');
		}
	};
	if (envp == null) {
		fprintf(stderr, "%s: Cannot allocate memory.\n", ProgramName);
		return (-2);
	}

	if (!glue_strings(TempFilename, MAX_FNAME, SPOOL_DIR,
		"tmp.XXXXXXXXXX", '/')) {
		// TempFilename[0] = '\0';
		TempFilename.setString('');
		fprintf(stderr, "path too long\n");
		return (-2);
	}
	if ((fd = mkstemp(TempFilename.s)) == -1 || !(tmp = fdopen(fd, "w+"))) {
		perror(TempFilename.s);
		if (fd != -1) {
			close(fd);
			unlink(TempFilename.s);
		}
		// TempFilename[0] = '\0';
		TempFilename.setString('');
		return (-2);
	}

	signal(SIGHUP, die);
	signal(SIGINT, die);
	signal(SIGQUIT, die);

	/* write a signature at the top of the file.
	 *
	 * VERY IMPORTANT: make sure NHEADER_LINES agrees with this code.
	 */
	fprintf(tmp, "# DO NOT EDIT THIS FILE - edit the master and reinstall.\n");
	fprintf(tmp, "# (%s installed on %-24.24s)\n", Filename, ctime(now));
	fprintf(tmp, "# (Cron version %s -- %s)\n", globalThis.CRON_VERSION, rcsid);

	/* copy the crontab to the tmp
	 */
	rewind(NewCrontab);
	Set_LineNum(1)
	while (EOF != (ch = get_char(NewCrontab)))
		putc(ch, tmp);
	ftruncate(fileno(tmp), ftell(tmp));	/* XXX redundant with "w+"? */
	fflush(tmp); rewind(tmp);

	if (ferror(tmp)) {
		fprintf(stderr, "%s: error while writing new crontab to %s\n",
			ProgramName, TempFilename);
		fclose(tmp);
		error = -2;
		// goto done;
		done();
		return (error);
	}

	/* check the syntax of the file being installed.
	 */

	/* BUG: was reporting errors after the EOF if there were any errors
	 * in the file proper -- kludged it by stopping after first error.
	 *		vix 31mar87
	 */
	Set_LineNum(1 - NHEADER_LINES)
	CheckErrorCount = 0; eof = FALSE;
	while (!CheckErrorCount && !eof) {
		switch (load_env(envstr, tmp)) {
			case ERR:
				/* check for data before the EOF */
				if (envstr.s.length) {
					Set_LineNum(LineNumber + 1);
					check_error("premature EOF");
				}
				eof = TRUE;
				break;
			case FALSE:
				e = load_entry(tmp, check_error, pw, envp);
				// if (e)
				// 	free(e);
				break;
			case TRUE:
				break;
		}
	}

	if (CheckErrorCount != 0) {
		fprintf(stderr, "errors in crontab file, can't install.\n");
		fclose(tmp);
		error = -1;
		// goto done;
		done();
		return (error);
	}

	file_owner = (getgid() == getegid()) ? ROOT_UID : (pw?.pw_uid ?? 0);

	// #ifdef HAS_FCHOWN
	// 	if (fchown(fileno(tmp), file_owner, -1) < OK) {
	// 		perror("fchown");
	// 		fclose(tmp);
	// 		error = -2;
	// 		goto done;
	// 	}
	// #else
	if (chown(TempFilename.s, file_owner, -1) < OK) {
		perror("chown");
		fclose(tmp);
		error = -2;
		// goto done;
		done();
		return (error);
	}
	// #endif

	if (fclose(tmp) == EOF) {
		perror("fclose");
		error = -2;
		// goto done;
		done();
		return (error);
	}

	if (!glue_strings(n, MAX_FNAME, SPOOL_DIR, User.s, '/')) {
		fprintf(stderr, "path too long\n");
		error = -2;
		// goto done;
		done();
		return (error);
	}
	if (rename(TempFilename.s, n.s)) {
		fprintf(stderr, "%s: error renaming %s to %s\n",
			ProgramName, TempFilename, n);
		perror("rename");
		error = -2;
		// goto done;
		done();
		return (error);
	}
	// TempFilename[0] = '\0';
	TempFilename.setString('');
	log_it(RealUser.s, Pid, "REPLACE", User.s);

	poke_daemon();

	done:
	// signal(SIGHUP, SIG_DFL);
	// signal(SIGINT, SIG_DFL);
	// signal(SIGQUIT, SIG_DFL);
	// if (TempFilename[0]) {
	// 	unlink(TempFilename.s);
	// 	TempFilename[0] = '\0';
	// }
	done();
	return (error);
}

// static void
const poke_daemon = () => {
	if (utime(SPOOL_DIR, null) < OK) {
		fprintf(stderr, "crontab: can't update mtime on spooldir\n");
		perror(SPOOL_DIR);
		return;
	}
}

// static void
const die = (x: number) => {
	if (TempFilename.s.length)
		unlink(TempFilename.s);
	_exit(ERROR_EXIT);
}