// https://github.com/vixie/cron/blob/master/structs.h

import { bit_decl } from "./externs.h";
import { struct__passwd } from "./lib/pwd";
import { struct__timespec } from "./lib/time";
import { DOM_COUNT, DOW_COUNT, HOUR_COUNT, MINUTE_COUNT, MONTH_COUNT } from "./macros.h";

class _entry {
    next: _entry | null;
    pwd: struct__passwd = new struct__passwd;
    envp: (string|null)[] | null = null;
    cmd: string | null = null;
    minute: number[] = bit_decl('minute' as never, MINUTE_COUNT);
    hour: number[] = bit_decl('hour' as never, HOUR_COUNT);
    dom: number[] = bit_decl('dom' as never, DOM_COUNT);
    month: number[] = bit_decl('month' as never, MONTH_COUNT);
    dow: number[] = bit_decl('dow' as never, DOW_COUNT);
    flags: number = 0;
};
export class entry extends _entry {};

export const MIN_STAR = 0x01;
export const HR_STAR = 0x02;
export const DOM_STAR = 0x04;
export const DOW_STAR = 0x08;
export const WHEN_REBOOT = 0x10;
export const DONT_LOG = 0x20;

/* the crontab database will be a list of the
 * following structure, one element per user
 * plus one for the system.
 *
 * These are the crontabs.
 */

class _user {
    next: _user | null = null;
    prev: _user | null = null;
    name: string | null = null;
    mtim: struct__timespec = new struct__timespec;
    crontab: entry | null = null;
};
export class user extends _user {};

class _cron_db {
    head: user | null = null;
    tail: user | null = null;
    mtim: struct__timespec = new struct__timespec;		/* last modtime on spooldir */

    public shallowCopy(from:_cron_db) {
        this.head = from.head;
        this.tail = from.tail;
        this.mtim = from.mtim;
    }
};
export class cron_db extends _cron_db {};
				/* in the C tradition, we only create
 * variables for the main program, just
 * extern them elsewhere.
 */