// https://github.com/vixie/cron/blob/master/cron.h

/* cron.h - header for vixie's cron
 *
 * $Id: cron.h,v 1.6 2004/01/23 18:56:42 vixie Exp $
 *
 * vix 14nov88 [rest of log is in RCS]
 * vix 14jan87 [0 or 7 can be sunday; thanks, mwm@berkeley]
 * vix 30dec86 [written]
 */
declare global {
	var CRON_VERSION: string;
}
globalThis.CRON_VERSION = 'V4.999';
import { DEBUGGING, MAILFMT, MAILARG } from "./config.h";
import { DIR_T, PID_T, SIG_T, TIME_T, WAIT_T, LOCK_EX, LOCK_NB, MY_GID, MY_UID, TZONE, WCOREDUMP, isascii, tzname, stderr, fprintf, exit, sigaction, LC_ALL, setlocale, sigemptyset, putenv, getpid, fork, setsid, open, O_RDWR, dup2, close, _exit, sleep } from "./externs.h";
import { CRONDIR, CRON_ALLOW, CRON_DENY, EDITOR, LOG_FILE, PIDDIR, PIDFILE, SPOOL_DIR, SYSCRONTAB, _PATH_BSHELL, _PATH_CRON_PID, _PATH_DEFPATH, _PATH_DEVNULL, _PATH_SENDMAIL, _PATH_TMP } from "./pathnames.h";
import { DEXT, DLOAD, DMISC, DOM_COUNT, DOW_COUNT, DPARS, DPROC, DSCH, DTEST, Debug, ERR, ERROR_EXIT, FALSE, FIRST_DOM, FIRST_DOW, FIRST_HOUR, FIRST_MINUTE, FIRST_MONTH, HOUR_COUNT, INIT_PID, LAST_DOM, LAST_DOW, LAST_HOUR, LAST_MINUTE, LAST_MONTH, MAXHOSTNAMELEN, MAX_COMMAND, MAX_ENVSTR, MAX_FNAME, MAX_TEMPSTR, MAX_UNAME, MINUTE_COUNT, MONTH_COUNT, MkUpper, OK, OK_EXIT, O_NOFOLLOW, PPC_NULL, READ_PIPE, ROOT_UID, ROOT_USER, SECONDS_PER_HOUR, SECONDS_PER_MINUTE, STDERR, STDIN, STDOUT, Set_LineNum, Skip_Blanks, Skip_Nonblanks, TRUE, WRITE_PIPE } from "./macros.h";
import { DOM_STAR, DONT_LOG, DOW_STAR, HR_STAR, MIN_STAR, WHEN_REBOOT, cron_db, entry, user } from "./structs.h";
import { acquire_daemonlock, get_gmtoff, job_add, job_runqueue, log_close, log_it, set_cron_cwd, set_cron_uid, set_debug_flags } from "./funcs.h";
import { DebugFlagNames, DowNames, MonthNames, copyright, ts_zero } from "./globals.h";
import { load_database } from "./database.c";
import { gmtime, localtime, struct__tm, time, time_t } from "./lib/time";
import { bit_test } from "./lib/bitstring";
import { waitpid, WEXITSTATUS, WNOHANG } from "./lib/sys/wait";
import { EINTR, errno } from "./lib/errno";
import { getopt } from "./lib/unistd";

// https://github.com/vixie/cron/blob/master/cron.c

// #if !defined(lint) && !defined(LINT)
// static char rcsid[] = "$Id: cron.c,v 1.12 2004/01/23 18:56:42 vixie Exp $";
// #endif

// #define	MAIN_PROGRAM

// #include "cron.h"

enum timejump { negative, small, medium, large };

// static	void	usage(void),
// 		run_reboot_jobs(cron_db *),
// 		find_jobs(int, cron_db *, int, int),
// 		set_time(int),
// 		cron_sleep(int),
// 		sigchld_handler(int),
// 		sighup_handler(int),
// 		sigchld_reaper(void),
// 		quit(int),
// 		parse_args(int c, char *v[]);

// static	volatile sig_atomic_t	got_sighup, got_sigchld;
let got_sighup = 0;
let got_sigchld = 0;
let timeRunning: number = 0;
let virtualTime: number = 0;
let clockTime: number = 0;
let GMToff: number = 0;

function usage(): void {
	// let dflags;

	fprintf(stderr, "usage:  %s [-n] [-x [", ProgramName);
	DebugFlagNames.forEach(dflags => {
		fprintf(stderr, "%s%s", dflags, dflags.length ? "," : "]");
	});
	fprintf(stderr, "]\n");
	exit(ERROR_EXIT);
}

export function main(argc: number, argv: string[]): number {
	let sact = new sigaction;
	let database: cron_db = new cron_db;
	let fd: number = 0;

	ProgramName = argv[0];

	setlocale(LC_ALL, "");

	// #if defined(BSD)
	// 	setlinebuf(stdout);
	// 	setlinebuf(stderr);
	// #endif

	NoFork = 0;
	parse_args(argc, argv);

	// bzero((char *)&sact, sizeof sact);
	sigemptyset(sact.sa_mask);
	sact.sa_flags = 0;
	// #ifdef SA_RESTART
	// 	sact.sa_flags |= SA_RESTART;
	// #endif
	sact.sa_handler = sigchld_handler;
	// (void) sigaction(SIGCHLD, &sact, NULL);
	sact.sa_handler = sighup_handler;
	// (void) sigaction(SIGHUP, &sact, NULL);
	sact.sa_handler = quit;
	// (void) sigaction(SIGINT, &sact, NULL);
	// (void) sigaction(SIGTERM, &sact, NULL);

	acquire_daemonlock(0);
	set_cron_uid();
	set_cron_cwd();

	if (putenv("PATH=" + _PATH_DEFPATH) < 0) {
		log_it("CRON", getpid(), "DEATH", "can't malloc");
		exit(1);
	}

	/* if there are no debug flags turned on, fork as a daemon should.
	 */
	if (DebugFlags) {
		if (DEBUGGING) {
			fprintf(stderr, "[%ld] cron started\n", getpid());
		}
	} else if (NoFork == 0) {
		switch (fork()) {
			case -1:
				log_it("CRON", getpid(), "DEATH", "can't fork");
				exit(0);
				break;
			case 0:
				/* child process */
				setsid();
				if ((fd = open(_PATH_DEVNULL, O_RDWR, 0)) >= 0) {
					dup2(fd, STDIN);
					dup2(fd, STDOUT);
					dup2(fd, STDERR);
					if (fd != STDERR)
						close(fd);
				}
				log_it("CRON", getpid(), "STARTUP", CRON_VERSION);
				break;
			default:
				/* parent process should just die */
				_exit(0);
		}
	}

	acquire_daemonlock(0);
	database.head = null;
	database.tail = null;
	database.mtim = ts_zero;
	load_database(database);
	set_time(true);
	run_reboot_jobs(database);
	timeRunning = virtualTime = clockTime;

	/*
	 * Too many clocks, not enough time (Al. Einstein)
	 * These clocks are in minutes since the epoch, adjusted for timezone.
	 * virtualTime: is the time it *would* be if we woke up
	 * promptly and nobody ever changed the clock. It is
	 * monotonically increasing... unless a timejump happens.
	 * At the top of the loop, all jobs for 'virtualTime' have run.
	 * timeRunning: is the time we last awakened.
	 * clockTime: is the time when set_time was last called.
	 */
	while (true) {
		let timeDiff: number;
		let wakeupKind: timejump;

		/* ... wait for the time (in minutes) to change ... */
		do {
			cron_sleep(timeRunning + 1);
			set_time(false);
		} while (clockTime == timeRunning);
		timeRunning = clockTime;

		/*
		 * Calculate how the current time differs from our virtual
		 * clock.  Classify the change into one of 4 cases.
		 */
		timeDiff = timeRunning - virtualTime;

		/* shortcut for the most common case */
		if (timeDiff == 1) {
			virtualTime = timeRunning;
			find_jobs(virtualTime, database, true, true);
		} else {
			if (timeDiff > (3 * MINUTE_COUNT) ||
				timeDiff < -(3 * MINUTE_COUNT))
				wakeupKind = timejump.large;
			else if (timeDiff > 5)
				wakeupKind = timejump.medium;
			else if (timeDiff > 0)
				wakeupKind = timejump.small;
			else
				wakeupKind = timejump.negative;

			switch (wakeupKind) {
				case timejump.small:
					/*
					 * case 1: timeDiff is a small positive number
					 * (wokeup late) run jobs for each virtual
					 * minute until caught up.
					 */
					Debug(DSCH, "[%ld], normal case %d minutes to go\n", getpid(), timeDiff);
					do {
						if (job_runqueue())
							sleep(10);
						virtualTime++;
						find_jobs(virtualTime, database, true, true);
					} while (virtualTime < timeRunning);
					break;

				case timejump.medium:
					/*
					 * case 2: timeDiff is a medium-sized positive
					 * number, for example because we went to DST
					 * run wildcard jobs once, then run any
					 * fixed-time jobs that would otherwise be
					 * skipped if we use up our minute (possible,
					 * if there are a lot of jobs to run) go
					 * around the loop again so that wildcard jobs
					 * have a chance to run, and we do our
					 * housekeeping.
					 */
					Debug(DSCH, "[%ld], DST begins %d minutes to go\n", getpid(), timeDiff);
					/* run wildcard jobs for current minute */
					find_jobs(timeRunning, database, true, false);

					/* run fixed-time jobs for each minute missed */
					do {
						if (job_runqueue())
							sleep(10);
						virtualTime++;
						find_jobs(virtualTime, database, false, true);
						set_time(false);
					} while (virtualTime < timeRunning &&
						clockTime == timeRunning);
					break;

				case timejump.negative:
					/*
					 * case 3: timeDiff is a small or medium-sized
					 * negative num, eg. because of DST ending.
					 * Just run the wildcard jobs. The fixed-time
					 * jobs probably have already run, and should
					 * not be repeated.  Virtual time does not
					 * change until we are caught up.
					 */
					Debug(DSCH, "[%ld], DST ends %d minutes to go\n", getpid(), timeDiff);
					find_jobs(timeRunning, database, true, false);
					break;
				default:
					/*
					 * other: time has changed a *lot*,
					 * jump virtual time, and run everything
					 */
					Debug(DSCH, "[%ld], clock jumped\n", getpid())
					virtualTime = timeRunning;
					find_jobs(timeRunning, database, true, true);
			}
		}

		/* Jobs to be run (if any) are loaded; clear the queue. */
		job_runqueue();

		/* Check to see if we received a signal while running jobs. */
		if (got_sighup) {
			got_sighup = 0;
			log_close();
		}
		if (got_sigchld) {
			got_sigchld = 0;
			sigchld_reaper();
		}
		load_database(database);
	}
}

const run_reboot_jobs = (db: cron_db) => {
	let u: user | null;
	let e: entry | null;

	for (u = db.head; u != null; u = u.next) {
		for (e = u.crontab; e != null; e = e.next) {
			if (e.flags & WHEN_REBOOT)
				job_add(e, u);
		}
	}
	job_runqueue();
}

const find_jobs = (vtime: number, db: cron_db, doWild: boolean, doNonWild: boolean) => {
	let virtualSecond = vtime * SECONDS_PER_MINUTE;
	let tm = gmtime(virtualSecond);
	let minute: number;
	let hour: number;
	let dom: number;
	let month: number;
	let dow: number;
	let u: user | null;
	let e: entry | null;

	/* make 0-based values out of these so we can use them as indicies
	 */
	minute = tm.tm_min - FIRST_MINUTE;
	hour = tm.tm_hour - FIRST_HOUR;
	dom = tm.tm_mday - FIRST_DOM;
	month = tm.tm_mon + 1 /* 0..11 -> 1..12 */ - FIRST_MONTH;
	dow = tm.tm_wday - FIRST_DOW;

	Debug(DSCH, "[%ld] tick(%d,%d,%d,%d,%d) %s %s\n", getpid(), minute, hour, dom, month, dow, doWild ? " " : "No wildcard", doNonWild ? " " : "Wildcard only");

	/* the dom/dow situation is odd.  '* * 1,15 * Sun' will run on the
	 * first and fifteenth AND every Sunday;  '* * * * Sun' will run *only*
	 * on Sundays;  '* * 1,15 * *' will run *only* the 1st and 15th.  this
	 * is why we keep 'e->dow_star' and 'e->dom_star'.  yes, it's bizarre.
	 * like many bizarre things, it's the standard.
	 */
	for (u = db.head; u != null; u = u.next) {
		for (e = u.crontab; e != null; e = e.next) {
			Debug(DSCH | DEXT, "user [%s:%ld:%ld:...] cmd=\"%s\"\n", e.pwd.pw_name, e.pwd.pw_uid, e.pwd.pw_gid, e.cmd);
			if (bit_test(e.minute, minute) &&
				bit_test(e.hour, hour) &&
				bit_test(e.month, month) &&
				(((e.flags & DOM_STAR) || (e.flags & DOW_STAR))
					? (bit_test(e.dow, dow) && bit_test(e.dom, dom))
					: (bit_test(e.dow, dow) || bit_test(e.dom, dom))
				)
			) {
				if ((doNonWild &&
					!(e.flags & (MIN_STAR | HR_STAR))) ||
					(doWild && (e.flags & (MIN_STAR | HR_STAR))))
					job_add(e, u);
			}
		}
	}
}

/*
 * Set StartTime and clockTime to the current time.
 * These are used for computing what time it really is right now.
 * Note that clockTime is a unix wallclock time converted to minutes.
 */
const set_time = (initialize: boolean) => {
	let tm: struct__tm;
	let isdst: number = 0;

	StartTime = time(null);

	/* We adjust the time to GMT so we can catch DST changes. */
	tm = localtime(StartTime);
	if (initialize || tm.tm_isdst != isdst) {
		isdst = tm.tm_isdst;
		GMToff = get_gmtoff(StartTime, tm);
		Debug(DSCH, "[%ld] GMToff=%ld\n", getpid(), GMToff);
	}
	clockTime = (StartTime + GMToff) / (SECONDS_PER_MINUTE as time_t);
}

/*
 * Try to just hit the next minute.
 */
const cron_sleep = (target: number) => {
	let t1: time_t;
	let t2: time_t;
	let seconds_to_wait: number;

	t1 = time(null) + GMToff;
	seconds_to_wait = (target * SECONDS_PER_MINUTE - t1) + 1;
	Debug(DSCH, "[%ld] Target time=%ld, sec-to-wait=%d\n", getpid(), target * SECONDS_PER_MINUTE, seconds_to_wait);

	while (seconds_to_wait > 0 && seconds_to_wait < 65) {
		sleep(seconds_to_wait);

		/*
		 * Check to see if we were interrupted by a signal.
		 * If so, service the signal(s) then continue sleeping
		 * where we left off.
		 */
		if (got_sighup) {
			got_sighup = 0;
			log_close();
		}
		if (got_sigchld) {
			got_sigchld = 0;
			sigchld_reaper();
		}
		t2 = time(null) + GMToff;
		seconds_to_wait -= (t2 - t1);
		t1 = t2;
	}
}

function sighup_handler(x: number) {
	got_sighup = 1;
}

function sigchld_handler(x: number) {
	got_sigchld = 1;
}

function quit(x: number) {
	// (void) unlink(_PATH_CRON_PID);
	// _exit(0);
}

const sigchld_reaper = () => {
	let waiter;
	let pid;

	do {
		pid = waitpid(-1, waiter, WNOHANG);
		switch (pid) {
			case -1:
				if (errno == EINTR)
					continue;
				Debug(DPROC, "[%ld] sigchld...no children\n", getpid())
				break;
			case 0:
				Debug(DPROC, "[%ld] sigchld...no dead kids\n", getpid())
				break;
			default:
				Debug(DPROC, "[%ld] sigchld...pid #%ld died, stat=%d\n", getpid(), pid, WEXITSTATUS(waiter))
				break;
		}
	} while (pid > 0);
}

function parse_args(argc: number, argv: string[]): void {
	let argch: number;

	while (-1 != (argch = getopt(argc, argv, "nx:"))) {
		switch (argch) {
			default:
				usage();
			case 'x'.charCodeAt(0):
				if (!set_debug_flags(globalThis.optarg))
					usage();
				break;
			case 'n'.charCodeAt(0):
				NoFork = 1;
				break;
		}
	}
}