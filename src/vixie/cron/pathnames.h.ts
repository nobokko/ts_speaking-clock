// https://github.com/vixie/cron/blob/master/pathnames.h

// #if (defined(BSD)) && (BSD >= 199103) || defined(__linux) || defined(AIX)
// # include <paths.h>
// #endif /*BSD*/

/* CRONDIR is where cron(8) and crontab(1) both chdir
 * to; SPOOL_DIR, CRON_ALLOW, CRON_DENY, and LOG_FILE
 * are all relative to this directory.
 */
export const CRONDIR = "/var/cron";

			/* SPOOLDIR is where the crontabs live.
			 * This directory will have its modtime updated
			 * whenever crontab(1) changes a crontab; this is
			 * the signal for cron(8) to look at each individual
			 * crontab file and reload those whose modtimes are
			 * newer than they were last time around (or which
			 * didn't exist last time around...)
			 */
export const SPOOL_DIR = "tabs";

			/* cron allow/deny file.  At least cron.deny must
			 * exist for ordinary users to run crontab.
			 */
export const CRON_ALLOW = "cron.allow";
export const CRON_DENY = "cron.deny";

			/* undefining this turns off logging to a file.  If
			 * neither LOG_FILE or SYSLOG is defined, we don't log.
			 * If both are defined, we log both ways.  Note that if
			 * LOG_CRON is defined by <syslog.h>, LOG_FILE will not
			 * be used.
			 */
export const LOG_FILE = "log";

			/* where should the daemon stick its PID?
			 * PIDDIR must end in '/'.
			 */
export const PIDDIR = "/etc/";
export const PIDFILE = "cron.pid";
export const _PATH_CRON_PID = `${PIDDIR}${PIDFILE}`;

			/* 4.3BSD-style crontab */
export const SYSCRONTAB = "/etc/crontab";

			/* what editor to use if no EDITOR or VISUAL
			 * environment variable specified.
			 */
export const EDITOR = "/usr/ucb/vi";

export const _PATH_SENDMAIL = "/usr/lib/sendmail";

export const _PATH_BSHELL = "/bin/sh";

export const _PATH_DEFPATH = "/usr/bin:/bin";

export const _PATH_TMP = "/tmp";

export const _PATH_DEVNULL = "/dev/null";
