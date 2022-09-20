// https://github.com/vixie/cron/blob/master/funcs.h

import { PID_T } from "./externs.h";
import { struct__passwd } from "./lib/pwd";
import { struct__tm, time_t } from "./lib/time";
import { entry, user } from "./structs.h";
import { struct__FILE } from "./lib/stdio";

import * as env_c from "./env.c";
import * as misc_c from "./misc.c";
import * as entry_c from "./entry.c";
import * as user_c from "./user.c";
import * as load_database_c from "./database.c";
import * as do_command_c from "./do_command.c";
import * as popen_c from "./popen.c";
import * as job_c from "./job.c";

/* Notes:
 *	This file has to be included by cron.h after data structure defs.
 *	We should reorg this into sections by module.
 */

//  void		set_cron_uid(void),
export const set_cron_uid = () => {};
//  set_cron_cwd(void),
export const set_cron_cwd = () => {};
export const load_database = load_database_c.load_database;
//  open_logfile(void),
//  sigpipe_func(void),
export const job_add = (e:entry|null, u:user|null) => {throw new Error('job_add')};
export const do_command = do_command_c.do_command;
//  link_user(cron_db *, user *),
//  unlink_user(cron_db *, user *),
export const free_user = user_c.free_user;
export const env_free = env_c.env_free;
export const unget_char = misc_c.unget_char;
export const free_entry = entry_c.free_entry;
//  acquire_daemonlock(int),
export const acquire_daemonlock = misc_c.acquire_daemonlock;
//  skip_comments(FILE *),
export const skip_comments = misc_c.skip_comments;
export const log_it = misc_c.log_it;
export const log_close = misc_c.log_close;

export const job_runqueue = job_c.job_runqueue;
//  set_debug_flags(const char *),
export const set_debug_flags = (flags:string) => {throw new Error('set_debug_flags');return 0;};
//  get_char(FILE *),
export const get_char = misc_c.get_char;
export const get_string = misc_c.get_string;
export const swap_uids = misc_c.swap_uids;
export const swap_uids_back = misc_c.swap_uids_back;
export const load_env = env_c.load_env;
export const cron_pclose = popen_c.cron_pclose;
export const glue_strings = misc_c.glue_strings;
export const strcmp_until = misc_c.strcmp_until;
export const allowed = misc_c.allowed;
//  strdtb(char *);

export const strlens = misc_c.strlens;

export const env_get = env_c.env_get;
//  *arpadate(time_t *),
export const mkprints = misc_c.mkprints;
export const first_word = misc_c.first_word;
export const env_init = env_c.env_init;
export const env_copy = env_c.env_copy;
export const env_set = env_c.env_set;

export const load_user = user_c.load_user;
//  *find_user(cron_db *, const char *);

export const load_entry = entry_c.load_entry;

export const cron_popen = popen_c.cron_popen;

import * as pw_dup_c from "./pw_dup.c";
export const pw_dup = pw_dup_c.pw_dup;

export const get_gmtoff = (clock:time_t, local:struct__tm) => {return 0};
