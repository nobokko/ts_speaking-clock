// https://github.com/vixie/cron/blob/master/externs.h

// #include <sys/param.h>

import { getgid as _getgid, getpid as _getpid, getuid as _getuid } from "./lib/sys/types";
export const getgid = _getgid;
export const getpid = _getpid;
export const getuid = _getuid;

// #include <sys/time.h>

import * as lib_sys_wait from "./lib/sys/wait";
export const waitpid = lib_sys_wait.waitpid;
export const wait = lib_sys_wait.wait;
export const WIFEXITED = lib_sys_wait.WIFEXITED;
export const WEXITSTATUS = lib_sys_wait.WEXITSTATUS;
export const WIFSIGNALED = lib_sys_wait.WIFSIGNALED;
export const WUNTRACED = lib_sys_wait.WUNTRACED;
export const WIFSTOPPED = lib_sys_wait.WIFSTOPPED;
export const WSTOPSIG = lib_sys_wait.WSTOPSIG;
export const WTERMSIG = lib_sys_wait.WTERMSIG;

// #include <sys/fcntl.h>

import * as lib_sys_file from "./lib/sys/file";
export const LOCK_EX = lib_sys_file.LOCK_EX;
export const LOCK_NB = lib_sys_file.LOCK_NB;
export const flock = lib_sys_file.flock;

import * as lib_sys_stat from "./lib/sys/stat";
export const fchmod = lib_sys_stat.fchmod;
export const fstat = lib_sys_stat.fstat;

import * as lib_bitstring from "./lib/bitstring";
export type bitstr_t = lib_bitstring.bitstr_t;
export const bit_test = lib_bitstring.bit_test;
export const bit_set = lib_bitstring.bit_set;
export const bit_nset = lib_bitstring.bit_nset;
export const bit_decl = lib_bitstring.bit_decl;
export const bit_nclear = lib_bitstring.bit_nclear;

import * as lib_ctype from "./lib/ctype";
export const isascii = lib_ctype.isascii;
export const isprint = lib_ctype.isprint;
export const isalnum = lib_ctype.isalnum;
export const isdigit = lib_ctype.isdigit;
export const isalpha = lib_ctype.isalpha;

import { struct__dirent } from "./lib/dirent.h";
import * as lib_errno from "./lib/errno";
export const EINTR = lib_errno.EINTR;
export const ENOENT = lib_errno.ENOENT;

import * as lib_fcntl from "./lib/fcntl";
export const O_RDWR = lib_fcntl.O_RDWR;
export const O_WRONLY = lib_fcntl.O_WRONLY;
export const O_APPEND = lib_fcntl.O_APPEND;
export const O_CREAT = lib_fcntl.O_CREAT;
export const F_SETFD = lib_fcntl.F_SETFD;
export const open = lib_fcntl.open;
export const close = lib_fcntl.close;
export const fcntl = lib_fcntl.fcntl;

import * as lib_grp from "./lib/grp";
export const initgroups = lib_grp.initgroups;

import { LC_ALL as _LC_ALL, setlocale as _setlocale } from "./lib/locale";
export const LC_ALL = _LC_ALL;
export const setlocale = _setlocale;

import * as lib_pwd from "./lib/pwd";
export const endpwent = lib_pwd.endpwent;
export const getpwuid = lib_pwd.getpwuid;
export const getpwnam = lib_pwd.getpwnam;

import * as lib_signal from "./lib/signal";
export const SIGCHLD = lib_signal.SIGCHLD;
export const SIGINT = lib_signal.SIGINT;
export const SIGQUIT = lib_signal.SIGQUIT;
export const SIGHUP = lib_signal.SIGHUP;
export const SIG_BLOCK = lib_signal.SIG_BLOCK;
export const SIG_SETMASK = lib_signal.SIG_SETMASK;
export const SIG_IGN = lib_signal.SIG_IGN;
export const sigset_t = lib_signal.sigset_t;
export const SIG_DFL = lib_signal.SIG_DFL;
export const sigaction = lib_signal.sigaction;
export const sigemptyset = lib_signal.sigemptyset;
export const signal = lib_signal.signal;
export const sigaddset = lib_signal.sigaddset;
export const sigprocmask = lib_signal.sigprocmask;
export const kill = lib_signal.kill;

// #include <stdarg.h>

import * as lib_stdio from "./lib/stdio";
export const stdin = lib_stdio.stdin;
export const stdout = lib_stdio.stdout;
export const stderr = lib_stdio.stderr;
export const EOF = lib_stdio.EOF;
export const fprintf = lib_stdio.fprintf;
export const sprintf = lib_stdio.sprintf;
export const perror = lib_stdio.perror;
export const fdopen = lib_stdio.fdopen;
export const fclose = lib_stdio.fclose;
export const putc = lib_stdio.putc;
export const getc = lib_stdio.getc;
export const fileno = lib_stdio.fileno;
export const fopen = lib_stdio.fopen;
export const fseek = lib_stdio.fseek;
export const fgets = lib_stdio.fgets;
export const ferror = lib_stdio.ferror;
export const putchar = lib_stdio.putchar;
export const fflush = lib_stdio.fflush;
export const rewind = lib_stdio.rewind;
export const printf = lib_stdio.printf;
export const ftell = lib_stdio.ftell;
export const rename = lib_stdio.rename;
export const feof = lib_stdio.feof;

import * as lib_stdlib from "./lib/stdlib";
export const exit = lib_stdlib.exit;
export const _exit = lib_stdlib._exit;
export const putenv = lib_stdlib.putenv;
export const strtol = lib_stdlib.strtol;
export const abort = lib_stdlib.abort;
export const mkstemp = lib_stdlib.mkstemp;
export const getenv = lib_stdlib.getenv;
export const atoi = lib_stdlib.atoi;
export const malloc = lib_stdlib.malloc;
export const free = lib_stdlib.free;

import * as lib_string from "./lib/string";
export const strlen = lib_string.strlen;
export const strerror = lib_string.strerror;
export const strncmp = lib_string.strncmp;
export const strchr = lib_string.strchr;
export const strtok = lib_string.strtok;
export const strcpy = lib_string.strcpy;
export const strcmp = lib_string.strcmp;
export const strdup = lib_string.strdup;
export const strcasecmp = lib_string.strcasecmp;
export const memcpy = lib_string.memcpy;

import * as lib_time from './lib/time';
export type struct__tm = lib_time.struct__tm;
export type time_t = lib_time.time_t;
export const time = lib_time.time;
export const ctime = lib_time.ctime;

import * as lib_unistd from "./lib/unistd"
export const SEEK_SET = lib_unistd.SEEK_SET;
export const _SC_OPEN_MAX = lib_unistd._SC_OPEN_MAX;
export const fork = lib_unistd.fork;
export const setsid = lib_unistd.setsid;
export const dup2 = lib_unistd.dup2;
export const sleep = lib_unistd.sleep;
export const read = lib_unistd.read;
export const lseek = lib_unistd.lseek;
export const write = lib_unistd.write;
export const ftruncate = lib_unistd.ftruncate;
export const pipe = lib_unistd.pipe;
export const vfork = lib_unistd.vfork;
export const chdir = lib_unistd.chdir;
export const execle = lib_unistd.execle;
export const sysconf = lib_unistd.sysconf;
export const setgid = lib_unistd.setgid;
export const setuid = lib_unistd.setuid;
export const execvp = lib_unistd.execvp;
export const gethostname = lib_unistd.gethostname;
export const getopt = lib_unistd.getopt;
export const setregid = lib_unistd.setregid;
export const getegid = lib_unistd.getegid;
export const setreuid = lib_unistd.setreuid;
export const geteuid = lib_unistd.geteuid;
export const unlink = lib_unistd.unlink;
export const chown = lib_unistd.chown;
export const execlp = lib_unistd.execlp;

import * as lib_utime from "./lib/utime";
export const utime = lib_utime.utime;

// #if defined(SYSLOG)
// # include <syslog.h>
// #endif

// #if defined(LOGIN_CAP)
// # include <login_cap.h>
// #endif /*LOGIN_CAP*/

// #if defined(BSD_AUTH)
// # include <bsd_auth.h>
// #endif /*BSD_AUTH*/

// #define DIR_T	struct dirent
export type DIR_T = struct__dirent;
// #define WAIT_T	int
export type WAIT_T = number;
// #define SIG_T	sig_t
export type SIG_T = {};
// #define TIME_T	time_t
export type TIME_T = time_t;
// #define PID_T	pid_t
export type PID_T = number;

// #ifndef TZNAME_ALREADY_DEFINED
// extern char *tzname[2];
// #endif
export let tzname = ['', ''];

// #define TZONE(tm) tzname[(tm).tm_isdst]
export const TZONE = (tm: struct__tm) => tzname[tm.tm_isdst];

// #if (defined(BSD)) && (BSD >= 198606) || defined(__linux)
// # define HAVE_FCHOWN
// # define HAVE_FCHMOD
// #endif

// #if (defined(BSD)) && (BSD >= 199103) || defined(__linux)
// # define HAVE_SAVED_UIDS
// #endif

// #define MY_UID(pw) getuid()
export const MY_UID = (pw: lib_pwd.struct__passwd|null) => getuid();
// #define MY_GID(pw) getgid()
export const MY_GID = (pw: lib_pwd.struct__passwd|null) => getgid();

/* getopt() isn't part of POSIX.  some systems define it in <stdlib.h> anyway.
 * of those that do, some complain that our definition is different and some
 * do not.  to add to the misery and confusion, some systems define getopt()
 * in ways that we cannot predict or comprehend, yet do not define the adjunct
 * external variables needed for the interface.
 */
// #if (!defined(BSD) || (BSD < 198911))
// int	getopt(int, char * const *, const char *);
// #endif

// #if (!defined(BSD) || (BSD < 199103))
// extern	char *optarg;
// extern	int optind, opterr, optopt;
// export let optind = 0;
// #endif
/* digital unix needs this but does not give us a way to identify it.
 */
// extern	int		flock(int, int);

/* not all systems who provide flock() provide these definitions.
 */
// export const LOCK_SH = 1;
// export const LOCK_EX = 2;
// export const LOCK_NB = 4;
// export const LOCK_UN = 8;

export const WCOREDUMP = (st: number) => (((st) & 0o200) != 0);