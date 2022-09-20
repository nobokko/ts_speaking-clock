// https://github.com/vixie/cron/blob/690fc534c7316e2cf6ff16b8e83ba7734b5186d2/database.c

import { DIR_T } from "./externs.h";
import { free_user, glue_strings, load_user, log_it } from "./funcs.h";
import { ts_zero } from "./globals.h";
import { closedir, DIR, opendir, readdir, struct__dirent } from "./lib/dirent.h";
import { close, open, O_NOFOLLOW, O_NONBLOCK, O_RDONLY } from "./lib/fcntl";
import { endpwent, getpwnam, struct__passwd } from "./lib/pwd";
import { exit } from "./lib/stdlib";
import { _string } from "./lib/string";
import { fstat, stat, struct__stat, S_ISREG } from "./lib/sys/stat";
import { getpid } from "./lib/sys/types";
import { struct__timespec } from "./lib/time";
import { Debug, DLOAD, ERROR_EXIT, OK, ROOT_UID } from "./macros.h";
import { SPOOL_DIR, SYSCRONTAB } from "./pathnames.h";
import { cron_db, user } from "./structs.h";

// #if !defined(lint) && !defined(LINT)
// static char rcsid[] = "$Id: database.c,v 1.7 2004/01/23 18:56:42 vixie Exp $";
// #endif

// #include "cron.h"
// #include <stdbool.h>

const TMAX = (a:struct__timespec,b:struct__timespec) => (is_greater_than(a,b)?(a):(b));
const TEQUAL = (a:struct__timespec,b:struct__timespec) => (a.tv_sec == b.tv_sec && a.tv_nsec == b.tv_nsec);

const is_greater_than = (left:struct__timespec, right:struct__timespec):boolean => {
	if (left.tv_sec > right.tv_sec)
		return true;
	else if (left.tv_sec < right.tv_sec)
		return false;
	return left.tv_nsec > right.tv_nsec;
}

export const load_database = (old_db:cron_db) => {
	let statbuf:struct__stat = new struct__stat;
    let syscron_stat:struct__stat = new struct__stat;
	let new_db = new cron_db;
	let dp:DIR_T|null = new struct__dirent;
	let dir:DIR;
	let u:user|null = new user;
    let nu:user|null = new user;

	Debug(DLOAD, "[%ld] load_database()\n", getpid())

	/* before we start loading any data, do a stat on SPOOL_DIR
	 * so that if anything changes as of this moment (i.e., before we've
	 * cached any of the database), we'll see the changes next time.
	 */
	if (stat(SPOOL_DIR, statbuf) < OK) {
		log_it("CRON", getpid(), "STAT FAILED", SPOOL_DIR);
		exit(ERROR_EXIT);
	}

	/* track system crontab file
	 */
	if (stat(SYSCRONTAB, syscron_stat) < OK)
		syscron_stat.st_mtim = ts_zero;

	/* if spooldir's mtime has not changed, we don't need to fiddle with
	 * the database.
	 *
	 * Note that old_db->mtime is initialized to 0 in main(), and
	 * so is guaranteed to be different than the stat() mtime the first
	 * time this function is called.
	 */
	if (TEQUAL(old_db.mtim, TMAX(statbuf.st_mtim, syscron_stat.st_mtim))) {
		Debug(DLOAD, "[%ld] spool dir mtime unch, no load needed.\n",
			      getpid())
		return;
	}

	/* something's different.  make a new database, moving unchanged
	 * elements from the old database, reloading elements that have
	 * actually changed.  Whatever is left in the old database when
	 * we're done is chaff -- crontabs that disappeared.
	 */
	new_db.mtim = TMAX(statbuf.st_mtim, syscron_stat.st_mtim);
	new_db.head = new_db.tail = null;

	if (!TEQUAL(syscron_stat.st_mtim, ts_zero))
		process_crontab("root", null, SYSCRONTAB, syscron_stat, new_db, old_db);

	/* we used to keep this dir open all the time, for the sake of
	 * efficiency.  however, we need to close it in every fork, and
	 * we fork a lot more often than the mtime of the dir changes.
	 */
	if (!(dir = opendir(SPOOL_DIR))) {
		log_it("CRON", getpid(), "OPENDIR FAILED", SPOOL_DIR);
		exit(ERROR_EXIT);
	}

	while (null != (dp = readdir(dir))) {
		let fname:string;
        let tabname:_string = new _string;

		/* avoid file names beginning with ".".  this is good
		 * because we would otherwise waste two guaranteed calls
		 * to getpwnam() for . and .., and also because user names
		 * starting with a period are just too nasty to consider.
		 */
		if (dp.d_name[0] == '.')
			continue;

		// if (strlen(dp->d_name) >= sizeof fname)
		// 	continue;	/* XXX log? */
        fname = dp.d_name;
		
		if (!glue_strings(tabname, 256, SPOOL_DIR, fname, '/'))
			continue;	/* XXX log? */

		process_crontab(fname, fname, tabname.s, statbuf, new_db, old_db);
	}
	closedir(dir);

	/* if we don't do this, then when our children eventually call
	 * getpwnam() in do_command.c's child_process to verify MAILTO=,
	 * they will screw us up (and v-v).
	 */
	endpwent();

	/* whatever's left in the old database is now junk.
	 */
	Debug(DLOAD, ("unlinking old database:\n"))
	for (u = old_db.head;  u != null;  u = nu) {
		Debug(DLOAD, "\t%s\n", u.name);
		nu = u.next;
		unlink_user(old_db, u);
		free_user(u);
	}

	/* overwrite the database control block with the new one.
	 */
	// old_db = new_db;
	old_db.shallowCopy(new_db);
	Debug(DLOAD, "load_database is done\n");
}

export const link_user = (db:cron_db, u:user) => {
	if (db.head == null)
		db.head = u;
	if (db.tail)
		db.tail.next = u;
	u.prev = db.tail;
	u.next = null;
	db.tail = u;
}

export const unlink_user = (db:cron_db, u:user) => {
	if (u.prev == null)
		db.head = u.next;
	else
		u.prev.next = u.next;

	if (u.next == null)
		db.tail = u.prev;
	else
		u.next.prev = u.prev;
}

// user *
export const find_user = (db:cron_db, name:string):user|null => {
	let u:user|null;

	for (u = db.head;  u != null;  u = u.next)
		if (u.name == name)
			break;
	return (u);
}

export const process_crontab = (uname:string, fname:string|null, tabname:string, statbuf:struct__stat, new_db:cron_db, old_db:cron_db) =>
{
	let pw:struct__passwd|null = null;
	let crontab_fd = OK - 1;
	let u:user|null = null;

    (() => {
        if (fname == null) {
            /* must be set to something for logging purposes.
             */
            fname = "*system*";
        } else if ((pw = getpwnam(uname)) == null) {
            /* file doesn't have a user in passwd file.
             */
            log_it(fname, getpid(), "ORPHAN", "no passwd entry");
            // goto next_crontab;
            return;
        }
    
        if ((crontab_fd = open(tabname, O_RDONLY|O_NONBLOCK|O_NOFOLLOW, 0)) < OK) {
            /* crontab not accessible?
             */
            log_it(fname, getpid(), "CAN'T OPEN", tabname);
            // goto next_crontab;
            return;
        }
    
        if (fstat(crontab_fd, statbuf) < OK) {
            log_it(fname, getpid(), "FSTAT FAILED", tabname);
            // goto next_crontab;
            return;
        }
        if (!S_ISREG(statbuf.st_mode)) {
            log_it(fname, getpid(), "NOT REGULAR", tabname);
            // goto next_crontab;
            return;
        }
        if ((statbuf.st_mode & 0o7777) != 0o600) {
            log_it(fname, getpid(), "BAD FILE MODE", tabname);
            // goto next_crontab;
            return;
        }
        if (statbuf.st_uid != ROOT_UID && (pw == null ||
            statbuf.st_uid != pw.pw_uid || uname != pw.pw_name)) {
            log_it(fname, getpid(), "WRONG FILE OWNER", tabname);
            // goto next_crontab;
            return;
        }
        if (statbuf.st_nlink != 1) {
            log_it(fname, getpid(), "BAD LINK COUNT", tabname);
            // goto next_crontab;
            return;
        }
    
        Debug(DLOAD, "\t%s:", fname);
        u = find_user(old_db, fname);
        if (u != null) {
            /* if crontab has not changed since we last read it
             * in, then we can just use our existing entry.
             */
            if (TEQUAL(u.mtim, statbuf.st_mtim)) {
                Debug(DLOAD, (" [no change, using old data]"))
                unlink_user(old_db, u);
                link_user(new_db, u);
                // goto next_crontab;
                return;
            }
    
            /* before we fall through to the code that will reload
             * the user, let's deallocate and unlink the user in
             * the old database.  This is more a point of memory
             * efficiency than anything else, since all leftover
             * users will be deleted from the old database when
             * we finish with the crontab...
             */
            Debug(DLOAD, (" [delete old data]"))
            unlink_user(old_db, u);
            free_user(u);
            log_it(fname, getpid(), "RELOAD", tabname);
        }
        u = load_user(crontab_fd, pw, fname);
        if (u != null) {
            u.mtim = statbuf.st_mtim;
            link_user(new_db, u);
        }
    })();

 next_crontab:
	if (crontab_fd >= OK) {
		Debug(DLOAD, (" [done]\n"))
		close(crontab_fd);
	}
}