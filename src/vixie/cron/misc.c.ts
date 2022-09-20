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

// #if !defined(lint) && !defined(LINT)
// static char rcsid[] = "$Id: misc.c,v 1.16 2004/01/23 18:56:43 vixie Exp $";
// #endif

// /* vix 26jan87 [RCS has the rest of the log]
//  * vix 30dec86 [written]
//  */

// #include "cron.h"
import { open, close, O_RDWR, O_CREAT, sprintf, fprintf, stderr, getpid, exit, LOCK_EX, LOCK_NB, strlen, strerror, flock, read, strtol, fchmod, fcntl, F_SETFD, lseek, SEEK_SET, write, ftruncate, PID_T, TIME_T, O_WRONLY, O_APPEND, getgid, getuid, setregid, getegid, setreuid, geteuid, strcmp, fopen, fclose, fseek, fgets, ferror } from "./externs.h";
import { errno } from "./lib/errno";
import { EOF, getc, perror, struct__FILE, ungetc } from "./lib/stdio";
import { strchr, _string } from "./lib/string";
import { ERR, ERROR_EXIT, FALSE, MAX_FNAME, MAX_TEMPSTR, OK, ROOT_USER, Set_LineNum, STDERR, TRUE } from "./macros.h";
import { LOG_FILE, _PATH_CRON_PID } from "./pathnames.h";

// #include <limits.h>
import { LONG_MAX } from "./lib/limits";
import { localtime, time } from "./lib/time";
import { DEBUGGING } from './config.h';

// #if defined(SYSLOG) && defined(LOG_FILE)
// # undef LOG_FILE
// #endif

// #if defined(LOG_DAEMON) && !defined(LOG_CRON)
// # define LOG_CRON LOG_DAEMON
// #endif

// #ifndef FACILITY
// #define FACILITY LOG_CRON
// #endif

// static int LogFD = ERR;
let LogFD = ERR;

// #if defined(SYSLOG)
// static int syslog_open = FALSE;
// #endif

/*
 * glue_strings is the overflow-safe equivalent of
 *		sprintf(buffer, "%s%c%s", a, separator, b);
 *
 * returns 1 on success, 0 on failure.  'buffer' MUST NOT be used if
 * glue_strings fails.
 */
export const glue_strings = (buffer:_string, buffer_size:number, a:string, b:string, separator:string):number => 
{
	let buf:string;

	if (buffer_size <= 0)
		return (0);
	// buf_end = buffer + buffer_size;
	// buf = buffer;

	// for ( /* nothing */; buf < buf_end && *a != '\0'; buf++, a++ )
	// 	*buf = *a;
    buf = a;
	// if (buf == buf_end)
	// 	return (0);
	// if (separator != '/' || buf == buffer || buf[-1] != '/')
	// 	*buf++ = separator;
    if (separator != '/' || buf.length == 0 || !buf.endsWith('/')) {
        buf += separator;
    }

    // if (buf == buf_end)
	// 	return (0);
	// for ( /* nothing */; buf < buf_end && *b != '\0'; buf++, b++ )
	// 	*buf = *b;
    buf += b;
	// if (buf == buf_end)
	// 	return (0);
	// *buf = '\0';
    buffer.s = buf;
	return (1);
}

// int
export const strcmp_until = (left:string, right:string, until:string) => {
	// while (left && left != until && left == right) {
	// 	left++;
	// 	right++;
	// }

	// if ((*left=='\0' || *left == until) &&
	//     (*right=='\0' || *right == until)) {
	// 	return (0);
	// }
	// return (*left - *right);
    const pos = left.indexOf(until);
    if (pos < 0) {
        return left === right ? 0 : 1;
    } 
    if (right.indexOf(until) != pos && right.length != pos) {
        return 1;
    }

    return left.substring(0, pos - 1) == right.substring(0, pos - 1);
}

// /* strdtb(s) - delete trailing blanks in string 's' and return new length
//  */
// int
// strdtb(char *s) {
// 	char	*x = s;

// 	/* scan forward to the null
// 	 */
// 	while (*x)
// 		x++;

// 	/* scan backward to either the first character before the string,
// 	 * or the last non-blank in the string, whichever comes first.
// 	 */
// 	do	{x--;}
// 	while (x >= s && isspace((unsigned char)*x));

// 	/* one character beyond where we stopped above is where the null
// 	 * goes.
// 	 */
// 	*++x = '\0';

// 	/* the difference between the position of the null character and
// 	 * the position of the first character of the string is the length.
// 	 */
// 	return (x - s);
// }

// int
// set_debug_flags(const char *flags) {
// 	/* debug flags are of the form    flag[,flag ...]
// 	 *
// 	 * if an error occurs, print a message to stdout and return FALSE.
// 	 * otherwise return TRUE after setting ERROR_FLAGS.
// 	 */

// #if !DEBUGGING

// 	printf("this program was compiled without debugging enabled\n");
// 	return (FALSE);

// #else /* DEBUGGING */

// 	const char *pc = flags;

// 	DebugFlags = 0;

// 	while (*pc) {
// 		const char	**test;
// 		int		mask;

// 		/* try to find debug flag name in our list.
// 		 */
// 		for (test = DebugFlagNames, mask = 1;
// 		     *test != NULL && strcmp_until(*test, pc, ',');
// 		     test++, mask <<= 1)
// 			NULL;

// 		if (!*test) {
// 			fprintf(stderr,
// 				"unrecognized debug flag <%s> <%s>\n",
// 				flags, pc);
// 			return (FALSE);
// 		}

// 		DebugFlags |= mask;

// 		/* skip to the next flag
// 		 */
// 		while (*pc && *pc != ',')
// 			pc++;
// 		if (*pc == ',')
// 			pc++;
// 	}

// 	if (DebugFlags) {
// 		int flag;

// 		fprintf(stderr, "debug flags enabled:");

// 		for (flag = 0;  DebugFlagNames[flag];  flag++)
// 			if (DebugFlags & (1 << flag))
// 				fprintf(stderr, " %s", DebugFlagNames[flag]);
// 		fprintf(stderr, "\n");
// 	}

// 	return (TRUE);

// #endif /* DEBUGGING */
// }

// void
// set_cron_uid(void) {
// #if defined(BSD) || defined(POSIX)
// 	if (seteuid(ROOT_UID) < OK) {
// 		perror("seteuid");
// 		exit(ERROR_EXIT);
// 	}
// #else
// 	if (setuid(ROOT_UID) < OK) {
// 		perror("setuid");
// 		exit(ERROR_EXIT);
// 	}
// #endif
// }

// void
// set_cron_cwd(void) {
// 	struct stat sb;
// 	struct group *grp = NULL;

// #ifdef CRON_GROUP
// 	grp = getgrnam(CRON_GROUP);
// #endif
// 	/* first check for CRONDIR ("/var/cron" or some such)
// 	 */
// 	if (stat(CRONDIR, &sb) < OK && errno == ENOENT) {
// 		perror(CRONDIR);
// 		if (OK == mkdir(CRONDIR, 0710)) {
// 			fprintf(stderr, "%s: created\n", CRONDIR);
// 			stat(CRONDIR, &sb);
// 		} else {
// 			fprintf(stderr, "%s: ", CRONDIR);
// 			perror("mkdir");
// 			exit(ERROR_EXIT);
// 		}
// 	}
// 	if (!S_ISDIR(sb.st_mode)) {
// 		fprintf(stderr, "'%s' is not a directory, bailing out.\n",
// 			CRONDIR);
// 		exit(ERROR_EXIT);
// 	}
// 	if (chdir(CRONDIR) < OK) {
// 		fprintf(stderr, "cannot chdir(%s), bailing out.\n", CRONDIR);
// 		perror(CRONDIR);
// 		exit(ERROR_EXIT);
// 	}

// 	/* CRONDIR okay (now==CWD), now look at SPOOL_DIR ("tabs" or some such)
// 	 */
// 	if (stat(SPOOL_DIR, &sb) < OK && errno == ENOENT) {
// 		perror(SPOOL_DIR);
// 		if (OK == mkdir(SPOOL_DIR, 0700)) {
// 			fprintf(stderr, "%s: created\n", SPOOL_DIR);
// 			stat(SPOOL_DIR, &sb);
// 		} else {
// 			fprintf(stderr, "%s: ", SPOOL_DIR);
// 			perror("mkdir");
// 			exit(ERROR_EXIT);
// 		}
// 	}
// 	if (!S_ISDIR(sb.st_mode)) {
// 		fprintf(stderr, "'%s' is not a directory, bailing out.\n",
// 			SPOOL_DIR);
// 		exit(ERROR_EXIT);
// 	}
// 	if (grp != NULL) {
// 		if (sb.st_gid != grp->gr_gid)
// 			chown(SPOOL_DIR, -1, grp->gr_gid);
// 		if (sb.st_mode != 01730)
// 			chmod(SPOOL_DIR, 01730);
// 	}
// }

/* acquire_daemonlock() - write our PID into /etc/cron.pid, unless
 *	another daemon is already running, which we detect here.
 *
 * note: main() calls us twice; once before forking, once after.
 *	we maintain static storage of the file pointer so that we
 *	can rewrite our PID into _PATH_CRON_PID after the fork.
 */
// void
export const acquire_daemonlock = (closeflag:number) => {
	// static int fd = -1;
	let fd = -1;
	// char buf[3*MAX_FNAME];
	let buf:_string = new _string;
	const sizeof_buf_ = 3*MAX_FNAME;
	// const char *pidfile;
	let pidfile:string;
	// char *ep;
	let ep:_string = new _string;
	// ssize_t num;
	let num:number;

	if (closeflag) {
		/* close stashed fd for child so we don't leak it. */
		if (fd != -1) {
			close(fd);
			fd = -1;
		}
		return;
	}

	if (fd == -1) {
		pidfile = _PATH_CRON_PID;
		/* Initial mode is 0600 to prevent flock() race/DoS. */
		if ((fd = open(pidfile, O_RDWR|O_CREAT, 0o600)) == -1) {
			sprintf(buf, "can't open or create %s: %s", pidfile, strerror(errno));
			fprintf(stderr, "%s: %s\n", ProgramName, buf.s);
			log_it("CRON", getpid(), "DEATH", buf.s);
			exit(ERROR_EXIT);
		}

		if (flock(fd, LOCK_EX|LOCK_NB) < OK) {
			// int save_errno = errno;
			let save_errno = errno;
			// long otherpid = -1;
			let otherpid = -1;

			// bzero(buf, sizeof(buf));
			buf.setString('');
			if ((num = read(fd, buf, sizeof_buf_ - 1)) > 0 &&
			    (otherpid = strtol(buf.s, ep, 10)) > 0 &&
			    ep.s != buf.s && ep.s == '\n' && otherpid != LONG_MAX) {
				sprintf(buf,
				    "can't lock %s, otherpid may be %ld: %s",
				    pidfile, otherpid, strerror(save_errno));
			} else {
				sprintf(buf,
				    "can't lock %s, otherpid unknown: %s",
				    pidfile, strerror(save_errno));
			}
			sprintf(buf, "can't lock %s, otherpid may be %ld: %s",
				pidfile, otherpid, strerror(save_errno));
			fprintf(stderr, "%s: %s\n", ProgramName, buf);
			log_it("CRON", getpid(), "DEATH", buf.s);
			exit(ERROR_EXIT);
		}
		fchmod(fd, 0o644);
		fcntl(fd, F_SETFD, 1);
	}

	sprintf(buf, "%ld\n", getpid());
	lseek(fd, 0, SEEK_SET);
	num = write(fd, buf.s, strlen(buf.s));
	ftruncate(fd, num);

	/* abandon fd even though the file is open. we need to keep
	 * it open and locked, but we don't need the handles elsewhere.
	 */
}

/* get_char(file) : like getc() but increment LineNumber on newlines
 */
// int
export const get_char = (file:struct__FILE|null) => {
	// int ch;
    let ch:number;

	ch = getc(file);
	if (ch == '\n'.charCodeAt(0))
		Set_LineNum(globalThis.LineNumber + 1)
	return (ch);
}

/* unget_char(ch, file) : like ungetc but do LineNumber processing
 */
// void
export const unget_char = (ch:number, file:struct__FILE|null) => {
	ungetc(ch, file);
	if (ch == '\n'.charCodeAt(0))
		Set_LineNum(globalThis.LineNumber - 1)
}

/* get_string(str, max, file, termstr) : like fgets() but
 *		(1) has terminator string which should include \n
 *		(2) will always leave room for the null
 *		(3) uses get_char() so LineNumber will be accurate
 *		(4) returns EOF or terminating character, whichever
 */
// int
export const get_string = (str:_string, size:number, file:struct__FILE|null, terms:string) => {
	// int ch;
    let ch:number;

	str.setString('');
	while (EOF != (ch = get_char(file)) && !strchr(terms, ch)) {
		if (size > 1) {
            str.s += String.fromCharCode(ch);
			// *str++ = (char) ch;
			size--;
		}
	}

	// if (size > 0)
	// 	*str = '\0';

	return (ch);
}

/* skip_comments(file) : read past comment (if any)
 */
// void
export const skip_comments = (file:struct__FILE) => {
	// int ch;
    let ch:number;

	while (EOF != (ch = get_char(file))) {
		/* ch is now the first character of a line.
		 */

		while (ch == ' '.charCodeAt(0) || ch == '\t'.charCodeAt(0))
			ch = get_char(file);

		if (ch == EOF)
			break;

		/* ch is now the first non-blank character of a line.
		 */

		if (ch != '\n'.charCodeAt(0) && ch != '#'.charCodeAt(0))
			break;

		/* ch must be a newline or comment as first non-blank
		 * character on a line.
		 */

		while (ch != '\n'.charCodeAt(0) && ch != EOF)
			ch = get_char(file);

		/* ch is now the newline of a line which we're going to
		 * ignore.
		 */
	}
	if (ch != EOF)
		unget_char(ch, file);
}

/* int in_file(const char *string, FILE *file, int error)
 *	return TRUE if one of the lines in file matches string exactly,
 *	FALSE if no lines match, and error on error.
 */
// static int
export const in_file = (string:string, file:struct__FILE|null, error:number) =>
{
	// char line[MAX_TEMPSTR];
	let line:_string = new _string;
	// char *endp;
	let endp:string;

	if (fseek(file, 0, SEEK_SET))
		return (error);
	while (fgets(line, MAX_TEMPSTR, file)) {
		if (line.s != '') {
			// endp = line[strlen(line.s) - 1];
			// if (endp != '\n')
			if (!line.s.endsWith('\n'))
				return (error);
			// endp = '\0';
			line.setString(line.s.replace('\n', ''));
			if (0 == strcmp(line.s, string))
				return (TRUE);
		}
	}
	if (ferror(file))
		return (error);
	return (FALSE);
}

/* int allowed(const char *username, const char *allow_file, const char *deny_file)
 *	returns TRUE if (allow_file exists and user is listed)
 *	or (deny_file exists and user is NOT listed).
 *	root is always allowed.
 */
// int
export const allowed = (username:string, allow_file:string, deny_file:string) => {
	// FILE	*fp;
	let fp:struct__FILE|null = null;
	// int	isallowed;
	let	isallowed:number;

	if (strcmp(username, ROOT_USER) == 0)
		return (true);
	isallowed = FALSE;
	if ((fp = fopen(allow_file, "r")) != null) {
		isallowed = in_file(username, fp, FALSE);
		fclose(fp);
	} else if ((fp = fopen(deny_file, "r")) != null) {
		isallowed = !in_file(username, fp, FALSE) ? TRUE : FALSE;
		fclose(fp);
	}
	return (isallowed);
}

// void
export const log_it = (username:string, xpid:PID_T , event:string, detail:string) => {
// #if defined(LOG_FILE) || DEBUGGING
// 	PID_T pid = xpid;
// #endif
	let pid:PID_T = xpid;
// #if defined(LOG_FILE)
// 	char *msg;
// 	TIME_T now = time((TIME_T) 0);
// 	struct tm *t = localtime(&now);
// #endif /*LOG_FILE*/
	let msg:_string = new _string;
	let now:TIME_T  = time(0);
	let t = localtime(now);

// #if defined(LOG_FILE)
	/* we assume that MAX_TEMPSTR will hold the date, time, &punctuation.
	 */
	// msg = malloc(strlen(username)
	// 	     + strlen(event)
	// 	     + strlen(detail)
	// 	     + MAX_TEMPSTR);
	// if (msg == NULL)
	// 	return;

	if (LogFD < OK) {
		LogFD = open(LOG_FILE, O_WRONLY|O_APPEND|O_CREAT, 0o600);
		if (LogFD < OK) {
			fprintf(stderr, "%s: can't open log file\n",
				ProgramName);
			perror(LOG_FILE);
		} else {
			fcntl(LogFD, F_SETFD, 1);
		}
	}

	/* we have to sprintf() it because fprintf() doesn't always write
	 * everything out in one chunk and this has to be atomically appended
	 * to the log file.
	 */
	sprintf(msg, "%s (%02d/%02d-%02d:%02d:%02d-%d) %s (%s)\n",
		username,
		t.tm_mon+1, t.tm_mday, t.tm_hour, t.tm_min, t.tm_sec, pid,
		event, detail);

	/* we have to run strlen() because sprintf() returns (char*) on old BSD
	 */
	if (LogFD < OK || write(LogFD, msg.s, strlen(msg.s)) < OK) {
		if (LogFD >= OK)
			perror(LOG_FILE);
		fprintf(stderr, "%s: can't write to log file\n", ProgramName);
		write(STDERR, msg.s, strlen(msg.s));
	}

	// free(msg);
// #endif /*LOG_FILE*/

// #if defined(SYSLOG)
// 	if (!syslog_open) {
// # ifdef LOG_DAEMON
// 		openlog(ProgramName, LOG_PID, FACILITY);
// # else
// 		openlog(ProgramName, LOG_PID);
// # endif
// 		syslog_open = TRUE;		/* assume openlog success */
// 	}

// 	syslog(LOG_INFO, "(%s) %s (%s)", username, event, detail);

// #endif /*SYSLOG*/

	if (DEBUGGING) {
		if (DebugFlags) {
			fprintf(stderr, "log_it: (%s %ld) %s (%s)\n",
				username, pid, event, detail);
		}
	}
}

// void
export const log_close = () => {
	if (LogFD != ERR) {
		close(LogFD);
		LogFD = ERR;
	}
// #if defined(SYSLOG)
// 	closelog();
// 	syslog_open = FALSE;
// #endif /*SYSLOG*/
}

/* char *first_word(char *s, char *t)
 *	return pointer to first word
 * parameters:
 *	s - string we want the first word of
 *	t - terminators, implicitly including \0
 * warnings:
 *	(1) this routine is fairly slow
 *	(2) it returns a pointer to static storage
 */
// char *
export const first_word = (s:string, t:string) => {
	// static char retbuf[2][MAX_TEMPSTR + 1];	/* sure wish C had GC */
	// static int retsel = 0;
	// char *rb, *rp;

	// /* select a return buffer */
	// retsel = 1-retsel;
	// rb = &retbuf[retsel][0];
	// rp = rb;

	// /* skip any leading terminators */
	// while (*s && (NULL != strchr(t, *s))) {
	// 	s++;
	// }

	// /* copy until next terminator or full buffer */
	// while (*s && (NULL == strchr(t, *s)) && (rp < &rb[MAX_TEMPSTR])) {
	// 	*rp++ = *s++;
	// }

	// /* finish the return-string and return it */
	// *rp = '\0';
	// return (rb);
	const pos = s.indexOf(t);
	if (pos < 0) {
		return s;
	}

	return s.substring(0, pos);
}

/* warning:
 *	heavily ascii-dependent.
 */
// void
export const mkprint = (dst:_string, src:string, len:number) =>
	// char *dst;
	// unsigned char *src;
	// int len;
{
	dst.setString('');
	/*
	 * XXX
	 * We know this routine can't overflow the dst buffer because mkprints()
	 * allocated enough space for the worst case.
	 */
	while (len-- > 0)
	{
		// unsigned char ch = *src++;
		let ch = src.charCodeAt(src.length - len);

		if (ch < ' '.charCodeAt(0)) {			/* control character */
			// *dst++ = '^';
			dst.s += '^';
			// *dst++ = ch + '@';
			dst.s += String.fromCharCode(ch + '@'.charCodeAt(0));
		} else if (ch < 0o177) {		/* printable */
			// *dst++ = ch;
			dst.s += String.fromCharCode(ch);
		} else if (ch == 0o177) {	/* delete/rubout */
			// *dst++ = '^';
			dst.s += '^';
			// *dst++ = '?';
			dst.s += '?';
		} else {			/* parity character */
			let _dst:_string= new _string;
			_dst.setString('');
			sprintf(_dst, "\\%03o", ch);
			dst.s += _dst.s;
		}
	}
	// *dst = '\0';
}

/* warning:
 *	returns a pointer to malloc'd storage, you must call free yourself.
 */
// char *
export const mkprints = (src:string, len:number) =>
	// unsigned char *src;
	// unsigned int len;
{
	// char *dst = malloc(len*4 + 1);
	let dst = new _string;
	dst.setString('');

	if (dst)
		mkprint(dst, src, len);

	return (dst.s);
}

// #ifdef MAIL_DATE
// /* Sat, 27 Feb 1993 11:44:51 -0800 (CST)
//  * 1234567890123456789012345678901234567
//  */
// char *
// arpadate(clock)
// 	time_t *clock;
// {
// 	time_t t = clock ? *clock : time((TIME_T) 0);
// 	struct tm tm = *localtime(&t);
// 	long gmtoff = get_gmtoff(&t, &tm);
// 	int hours = gmtoff / SECONDS_PER_HOUR;
// 	int minutes = (gmtoff - (hours * SECONDS_PER_HOUR)) / SECONDS_PER_MINUTE;
// 	static char ret[64];	/* zone name might be >3 chars */
	
// 	(void) sprintf(ret, "%s, %2d %s %2d %02d:%02d:%02d %.2d%.2d (%s)",
// 		       DowNames[tm.tm_wday],
// 		       tm.tm_mday,
// 		       MonthNames[tm.tm_mon],
// 		       tm.tm_year + 1900,
// 		       tm.tm_hour,
// 		       tm.tm_min,
// 		       tm.tm_sec,
// 		       hours,
// 		       minutes,
// 		       TZONE(*tm));
// 	return (ret);
// }
// #endif /*MAIL_DATE*/

// #ifdef HAVE_SAVED_UIDS
// static uid_t save_euid;
// static gid_t save_egid;

// int swap_uids(void) {
// 	save_egid = getegid();
// 	save_euid = geteuid();
// 	return ((setegid(getgid()) || seteuid(getuid())) ? -1 : 0);
// }

// int swap_uids_back(void) {
// 	return ((setegid(getgid()) || seteuid(getuid())) ? -1 : 0);
// }

// #else /*HAVE_SAVED_UIDS*/

export const swap_uids = () => {
	return ((setregid(getegid(), getgid()) || setreuid(geteuid(), getuid()))
	    ? -1 : 0);
}

export const swap_uids_back = () => {
	return (swap_uids());
}
// #endif /*HAVE_SAVED_UIDS*/

// size_t
export const strlens = (last:string, ...ap:(string|null)[]) => {
	// va_list ap;
	// size_t ret = 0;
	let ret = 0;
	// const char *str;
	// let str:string;

	// va_start(ap, last);
	// for (str = last; str != null; str = va_arg(ap, const char *))
	// 	ret += strlen(str);
	// va_end(ap);
	ret += strlen(last);
	ap.some((ap:string|null) => {
		if (ap == null) return false;
		ret += strlen(ap);
		return true;
	});
	return (ret);
}

// /* Return the offset from GMT in seconds (algorithm taken from sendmail).
//  *
//  * warning:
//  *	clobbers the static storage space used by localtime() and gmtime().
//  *	If the local pointer is non-NULL it *must* point to a local copy.
//  */
// #ifndef HAVE_TM_GMTOFF
// long get_gmtoff(time_t *clock, struct tm *local)
// {
// 	struct tm gmt;
// 	long offset;

// 	gmt = *gmtime(clock);
// 	if (local == NULL)
// 		local = localtime(clock);

// 	offset = (local->tm_sec - gmt.tm_sec) +
// 	    ((local->tm_min - gmt.tm_min) * 60) +
// 	    ((local->tm_hour - gmt.tm_hour) * 3600);

// 	/* Timezone may cause year rollover to happen on a different day. */
// 	if (local->tm_year < gmt.tm_year)
// 		offset -= 24 * 3600;
// 	else if (local->tm_year > gmt.tm_year)
// 		offset -= 24 * 3600;
// 	else if (local->tm_yday < gmt.tm_yday)
// 		offset -= 24 * 3600;
// 	else if (local->tm_yday > gmt.tm_yday)
// 		offset += 24 * 3600;

// 	return (offset);
// }
// #endif /* HAVE_TM_GMTOFF */