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

import { env_copy, env_free, env_get, env_set, get_char, get_string, glue_strings, log_it, pw_dup, skip_comments, unget_char } from "./funcs.h";
import { DOM_STAR, DONT_LOG, DOW_STAR, entry, HR_STAR, MIN_STAR, WHEN_REBOOT } from "./structs.h";
import { struct__FILE } from './lib/stdio';
import { struct__passwd } from './lib/pwd';
import { Debug, DEXT, DPARS, FIRST_DOM, FIRST_DOW, FIRST_HOUR, FIRST_MINUTE, FIRST_MONTH, LAST_DOM, LAST_DOW, LAST_HOUR, LAST_MINUTE, LAST_MONTH, MAX_COMMAND, MAX_ENVSTR, MAX_TEMPSTR, OK, PPC_NULL, Skip_Blanks, Skip_Nonblanks } from "./macros.h";
import { atoi, bitstr_t, bit_nclear, bit_nset, bit_set, EOF, feof, free, getpid, getpwnam, isalpha, isdigit, strcasecmp, strchr, strcmp, strdup } from "./externs.h";
import { _string } from './lib/string';
import { DowNames, MonthNames } from "./globals.h";
import { bit_test } from "./lib/bitstring";
import { _PATH_BSHELL, _PATH_DEFPATH } from "./pathnames.h";
type ref_number = { n: number };
// #if !defined(lint) && !defined(LINT)
// static char rcsid[] = "$Id: entry.c,v 1.17 2004/01/23 18:56:42 vixie Exp $";
// #endif

// /* vix 26jan87 [RCS'd; rest of log is in RCS file]
//  * vix 01jan87 [added line-level error recovery]
//  * vix 31dec86 [added /step to the from-to range, per bob@acornrc]
//  * vix 30dec86 [written]
//  */

// #include "cron.h"

enum ecode_e {
	e_none, e_minute, e_hour, e_dom, e_month, e_dow,
	e_cmd, e_timespec, e_username, e_option, e_memory
};

// static const char *ecodes[] =
// 	{
// 		"no error",
// 		"bad minute",
// 		"bad hour",
// 		"bad day-of-month",
// 		"bad month",
// 		"bad day-of-week",
// 		"bad command",
// 		"bad time specifier",
// 		"bad username",
// 		"bad option",
// 		"out of memory"
// 	};
const ecodes = [
	"no error",
	"bad minute",
	"bad hour",
	"bad day-of-month",
	"bad month",
	"bad day-of-week",
	"bad command",
	"bad time specifier",
	"bad username",
	"bad option",
	"out of memory",
];

// static int	get_list(bitstr_t *, int, int, const char *[], int, FILE *),
// 		get_range(bitstr_t *, int, int, const char *[], int, FILE *),
// 		get_number(int *, int, const char *[], int, FILE *, const char *),
// 		set_element(bitstr_t *, int, int, int);

// void
export const free_entry = (e: entry) => {
	free(e.cmd);
	e.cmd = '';
	free(e.pwd);
	env_free(e.envp as string[]);
	free(e);
}

/* return NULL if eof or syntax error occurs;
 * otherwise return a pointer to a new entry.
 */
// entry *
export const load_entry = (file: struct__FILE, error_func: ((...args:any[]) => void)|null, pw: struct__passwd | null, envp: string[]) => {
	/* this function reads one crontab entry -- the next -- from a file.
	 * it skips any leading blank lines, ignores comments, and returns
	 * NULL if for any reason the entry can't be read and parsed.
	 *
	 * the entry is also parsed here.
	 *
	 * syntax:
	 *   user crontab:
	 *	minutes hours doms months dows cmd\n
	 *   system crontab (/etc/crontab):
	 *	minutes hours doms months dows USERNAME cmd\n
	 */

	// ecode_e	ecode = e_none;
	let ecode: ecode_e = ecode_e.e_none;
	// entry *e;
	let e: entry | null = null;
	// int ch;
	let ch: number;
	// char cmd[MAX_COMMAND];
	let cmd: _string = new _string;
	// char envstr[MAX_ENVSTR];
	let envstr: _string = new _string;
	// char **tenvp;
	let tenvp: (string|null)[] | null = null;

	const label_eof = ():null => {
		if (e?.envp)
			env_free(e?.envp ?? []);
		if (e?.pwd)
			free(e.pwd);
		if (e?.cmd)
			free(e.cmd);
		free(e);
		while (ch != '\n'.charCodeAt(0) && !feof(file))
			ch = get_char(file);
		if (ecode != ecode_e.e_none && error_func)
			error_func(ecodes[ecode]);
		return (null);
	};
	Debug(DPARS, "load_entry()...about to eat comments\n");

	skip_comments(file);

	ch = get_char(file);
	if (ch == EOF)
		return (null);

	/* ch is now the first useful character of a useful line.
	 * it may be an @special or it may be the first character
	 * of a list of minutes.
	 */

	// e = (entry *) calloc(sizeof(entry), sizeof(char));
	e = new entry;

	if (ch == '@'.charCodeAt(0)) {
		/* all of these should be flagged and load-limited; i.e.,
		 * instead of @hourly meaning "0 * * * *" it should mean
		 * "close to the front of every hour but not 'til the
		 * system load is low".  Problems are: how do you know
		 * what "low" means? (save me from /etc/cron.conf!) and:
		 * how to guarantee low variance (how low is low?), which
		 * means how to we run roughly every hour -- seems like
		 * we need to keep a history or let the first hour set
		 * the schedule, which means we aren't load-limited
		 * anymore.  too much for my overloaded brain. (vix, jan90)
		 * HINT
		 */
		ch = get_string(cmd, MAX_COMMAND, file, " \t\n");
		if (!strcmp("reboot", cmd.s)) {
			e.flags |= WHEN_REBOOT;
		} else if (!strcmp("yearly", cmd.s) || !strcmp("annually", cmd.s)) {
			bit_set(e.minute, 0);
			bit_set(e.hour, 0);
			bit_set(e.dom, 0);
			bit_set(e.month, 0);
			bit_nset(e.dow, 0, (LAST_DOW - FIRST_DOW + 1));
			e.flags |= DOW_STAR;
		} else if (!strcmp("monthly", cmd.s)) {
			bit_set(e.minute, 0);
			bit_set(e.hour, 0);
			bit_set(e.dom, 0);
			bit_nset(e.month, 0, (LAST_MONTH - FIRST_MONTH + 1));
			bit_nset(e.dow, 0, (LAST_DOW - FIRST_DOW + 1));
			e.flags |= DOW_STAR;
		} else if (!strcmp("weekly", cmd.s)) {
			bit_set(e.minute, 0);
			bit_set(e.hour, 0);
			bit_nset(e.dom, 0, (LAST_DOM - FIRST_DOM + 1));
			bit_nset(e.month, 0, (LAST_MONTH - FIRST_MONTH + 1));
			bit_set(e.dow, 0);
			e.flags |= DOW_STAR;
		} else if (!strcmp("daily", cmd.s) || !strcmp("midnight", cmd.s)) {
			bit_set(e.minute, 0);
			bit_set(e.hour, 0);
			bit_nset(e.dom, 0, (LAST_DOM - FIRST_DOM + 1));
			bit_nset(e.month, 0, (LAST_MONTH - FIRST_MONTH + 1));
			bit_nset(e.dow, 0, (LAST_DOW - FIRST_DOW + 1));
		} else if (!strcmp("hourly", cmd.s)) {
			bit_set(e.minute, 0);
			bit_nset(e.hour, 0, (LAST_HOUR - FIRST_HOUR + 1));
			bit_nset(e.dom, 0, (LAST_DOM - FIRST_DOM + 1));
			bit_nset(e.month, 0, (LAST_MONTH - FIRST_MONTH + 1));
			bit_nset(e.dow, 0, (LAST_DOW - FIRST_DOW + 1));
			e.flags |= HR_STAR;
		} else {
			ecode = ecode_e.e_timespec;
			// goto eof;
			return label_eof();

		}
		/* Advance past whitespace between shortcut and
		 * username/command.
		 */
		ch = Skip_Blanks({n:ch}, file);
		if (ch == EOF || ch == '\n'.charCodeAt(0)) {
			ecode = ecode_e.e_cmd;
			// goto eof;
			return label_eof();

		}
	} else {
		Debug(DPARS, ("load_entry()...about to parse numerics\n"))

		if (ch == '*'.charCodeAt(0))
			e.flags |= MIN_STAR;
		ch = get_list(e.minute, FIRST_MINUTE, LAST_MINUTE,
			PPC_NULL, ch, file);
		if (ch == EOF) {
			ecode = ecode_e.e_minute;
			// goto eof;
			return label_eof();

		}

		/* hours
		 */

		if (ch == '*'.charCodeAt(0))
			e.flags |= HR_STAR;
		ch = get_list(e.hour, FIRST_HOUR, LAST_HOUR,
			PPC_NULL, ch, file);
		if (ch == EOF) {
			ecode = ecode_e.e_hour;
			// goto eof;
			return label_eof();

		}

		/* DOM (days of month)
		 */

		if (ch == '*'.charCodeAt(0))
			e.flags |= DOM_STAR;
		ch = get_list(e.dom, FIRST_DOM, LAST_DOM,
			PPC_NULL, ch, file);
		if (ch == EOF) {
			ecode = ecode_e.e_dom;
			// goto eof;
			return label_eof();

		}

		/* month
		 */

		ch = get_list(e.month, FIRST_MONTH, LAST_MONTH,
			MonthNames, ch, file);
		if (ch == EOF) {
			ecode = ecode_e.e_month;
			// goto eof;
			return label_eof();

		}

		/* DOW (days of week)
		 */

		if (ch == '*'.charCodeAt(0))
			e.flags |= DOW_STAR;
		ch = get_list(e.dow, FIRST_DOW, LAST_DOW,
			DowNames, ch, file);
		if (ch == EOF) {
			ecode = ecode_e.e_dow;
			// goto eof;
			return label_eof();

		}
	}

	/* make sundays equivalent */
	if (bit_test(e.dow, 0) || bit_test(e.dow, 7)) {
		bit_set(e.dow, 0);
		bit_set(e.dow, 7);
	}

	/* check for permature EOL and catch a common typo */
	if (ch == '\n'.charCodeAt(0) || ch == '*'.charCodeAt(0)) {
		ecode = ecode_e.e_cmd;
		// goto eof;
		return label_eof();

	}

	/* ch is the first character of a command, or a username */
	unget_char(ch, file);

	if (!pw) {
		// char		*username = cmd;	/* temp buffer */
		let username: _string = cmd;	/* temp buffer */

		Debug(DPARS, ("load_entry()...about to parse username\n"))
		ch = get_string(username, MAX_COMMAND, file, " \t\n");

		Debug(DPARS, "load_entry()...got %s\n", username);
		if (ch == EOF || ch == '\n'.charCodeAt(0) || ch == '*'.charCodeAt(0)) {
			ecode = ecode_e.e_cmd;
			// goto eof;
			return label_eof();

		}

		/* Need to have consumed blanks before checking for options
		 * below. */
		ch = Skip_Blanks({n:ch}, file)
		unget_char(ch, file);

		pw = getpwnam(username.s);
		if (pw == null) {
			ecode = ecode_e.e_username;
			// goto eof;
			return label_eof();

		}
		Debug(DPARS, "load_entry()...uid %ld, gid %ld\n",
			pw.pw_uid, pw.pw_gid)
	}

	if ((e.pwd = pw_dup(pw)) == null) {
		ecode = ecode_e.e_memory;
		// goto eof;
		return label_eof();

	}
	// bzero(e.pwd.pw_passwd, strlen(e.pwd.pw_passwd));
	e.pwd.pw_passwd = '';

	/* copy and fix up environment.  some variables are just defaults and
	 * others are overrides.
	 */
	if ((e.envp = env_copy(envp)) == null) {
		ecode = ecode_e.e_memory;
		// goto eof;
		return label_eof();

	}
	if (!env_get("SHELL", e.envp ?? [])) {
		if (glue_strings(envstr, MAX_ENVSTR, "SHELL",
			_PATH_BSHELL, '=')) {
			if ((tenvp = env_set(e.envp ?? [], envstr.s)) == null) {
				ecode = ecode_e.e_memory;
				// goto eof;
				return label_eof();

			}
			e.envp = tenvp;
		} else
			log_it("CRON", getpid(), "error", "can't set SHELL");
	}
	if (!env_get("HOME", e.envp ?? [])) {
		if (glue_strings(envstr, MAX_ENVSTR, "HOME",
			pw.pw_dir, '=')) {
			if ((tenvp = env_set(e.envp ?? [], envstr.s)) == null) {
				ecode = ecode_e.e_memory;
				// goto eof;
				return label_eof();

			}
			e.envp = tenvp;
		} else
			log_it("CRON", getpid(), "error", "can't set HOME");
	}
	// #ifndef LOGIN_CAP
	/* If login.conf is in used we will get the default PATH later. */
	if (!env_get("PATH", e.envp ?? [])) {
		if (glue_strings(envstr, MAX_ENVSTR, "PATH",
			_PATH_DEFPATH, '=')) {
			if ((tenvp = env_set(e.envp ?? [], envstr.s)) == null) {
				ecode = ecode_e.e_memory;
				// goto eof;
				return label_eof();

			}
			e.envp = tenvp;
		} else
			log_it("CRON", getpid(), "error", "can't set PATH");
	}
	// #endif /* LOGIN_CAP */
	if (glue_strings(envstr, MAX_ENVSTR, "LOGNAME",
		pw.pw_name, '=')) {
		if ((tenvp = env_set(e.envp ?? [], envstr.s)) == null) {
			ecode = ecode_e.e_memory;
			// goto eof;
			return label_eof();

		}
		e.envp = tenvp;
	} else
		log_it("CRON", getpid(), "error", "can't set LOGNAME");
	// #if defined(BSD) || defined(__linux)
	// 	if (glue_strings(envstr, sizeof envstr, "USER",
	// 			 pw->pw_name, '=')) {
	// 		if ((tenvp = env_set(e->envp, envstr)) == NULL) {
	// 			ecode = e_memory;
	// goto eof;
	// 		}
	// 		e->envp = tenvp;
	// 	} else
	// 		log_it("CRON", getpid(), "error", "can't set USER");
	// #endif

	Debug(DPARS, "load_entry()...about to parse command\n")

	/* If the first character of the command is '-' it is a cron option.
	 */
	while ((ch = get_char(file)) == '-'.charCodeAt(0)) {
		switch (ch = get_char(file)) {
			case 'q'.charCodeAt(0):
				e.flags |= DONT_LOG;
				ch = Skip_Nonblanks({n:ch}, file)
				break;
			default:
				ecode = ecode_e.e_option;
				// goto eof;
				return label_eof();

		}
		ch = Skip_Blanks({n:ch}, file)
		if (ch == EOF || ch == '\n'.charCodeAt(0)) {
			ecode = ecode_e.e_cmd;
			// goto eof;
			return label_eof();

		}
	}
	unget_char(ch, file);

	/* Everything up to the next \n or EOF is part of the command...
	 * too bad we don't know in advance how long it will be, since we
	 * need to malloc a string for it... so, we limit it to MAX_COMMAND.
	 */
	ch = get_string(cmd, MAX_COMMAND, file, "\n");

	/* a file without a \n before the EOF is rude, so we'll complain...
	 */
	if (ch == EOF) {
		ecode = ecode_e.e_cmd;
		// goto eof;
		return label_eof();

	}

	/* got the command in the 'cmd' string; save it in *e.
	 */
	if ((e.cmd = strdup(cmd.s)) == null) {
		ecode = ecode_e.e_memory;
		// goto eof;
		return label_eof();

	}

	Debug(DPARS, ("load_entry()...returning successfully\n"))

	/* success, fini, return pointer to the entry we just created...
	 */
	return (e);

	//  eof:
	// 	if (e?.envp)
	// 		env_free(e?.envp ?? []);
	// 	// if (e.pwd)
	// 	// 	free(e.pwd);
	// 	// if (e.cmd)
	// 	// 	free(e.cmd);
	// 	// free(e);
	// 	while (ch != '\n'.charCodeAt(0) && !feof(file))
	// 		ch = get_char(file);
	// 	if (ecode != ecode_e.e_none && error_func)
	// 		error_func(ecodes[ecode]);
	// 	return (null);
}

// static int
const get_list = (bits: bitstr_t[], low: number, high: number, names: string[] | null, ch: number, file: struct__FILE) => {
	// int done;
	let done: boolean;

	/* we know that we point to a non-blank character here;
	 * must do a Skip_Blanks before we exit, so that the
	 * next call (or the code that picks up the cmd) can
	 * assume the same thing.
	 */

	Debug(DPARS | DEXT, ("get_list()...entered\n"))

	/* list = range {"," range}
	 */

	/* clear the bit string, since the default is 'off'.
	 */
	bit_nclear(bits, 0, (high - low + 1));

	/* process all ranges
	 */
	done = false;
	while (!done) {
		if (EOF == (ch = get_range(bits, low, high, names as [], ch, file)))
			return (EOF);
		if (ch == ','.charCodeAt(0))
			ch = get_char(file);
		else
			done = true;
	}

	/* exiting.  skip to some blanks, then skip over the blanks.
	 */
	ch = Skip_Nonblanks({n:ch}, file)
	ch = Skip_Blanks({n:ch}, file)

	Debug(DPARS | DEXT, "get_list()...exiting w/ %02x\n", ch)

	return (ch);
}


// static int
const get_range = (bits: bitstr_t[], low: number, high: number, names: string[],
	ch: number, file: struct__FILE) => {
	/* range = number | number "-" number [ "/" number ]
	 */

	// int i, num1, num2, num3;
	let i: number;
	let num1: ref_number = { n: 0 };
	let num2: ref_number = { n: 0 };
	let num3: ref_number = { n: 0 };

	Debug(DPARS | DEXT, ("get_range()...entering, exit won't show\n"))

	if (ch == '*'.charCodeAt(0)) {
		/* '*' means "first-last" but can still be modified by /step
		 */
		num1.n = low;
		num2.n = high;
		ch = get_char(file);
		if (ch == EOF)
			return (EOF);
	} else {
		ch = get_number(num1, low, names, ch, file, ",- \t\n");
		if (ch == EOF)
			return (EOF);

		if (ch != '-'.charCodeAt(0)) {
			/* not a range, it's a single number.
			 */
			if (EOF == set_element(bits, low, high, num1.n)) {
				unget_char(ch, file);
				return (EOF);
			}
			return (ch);
		} else {
			/* eat the dash
			 */
			ch = get_char(file);
			if (ch == EOF)
				return (EOF);

			/* get the number following the dash
			 */
			ch = get_number(num2, low, names, ch, file, "/, \t\n");
			if (ch == EOF || num1.n > num2.n)
				return (EOF);
		}
	}

	/* check for step size
	 */
	if (ch == '/'.charCodeAt(0)) {
		/* eat the slash
		 */
		ch = get_char(file);
		if (ch == EOF)
			return (EOF);

		/* get the step size -- note: we don't pass the
		 * names here, because the number is not an
		 * element id, it's a step size.  'low' is
		 * sent as a 0 since there is no offset either.
		 */
		ch = get_number(num3, 0, PPC_NULL, ch, file, ", \t\n");
		if (ch == EOF || num3.n == 0)
			return (EOF);
	} else {
		/* no step.  default==1.
		 */
		num3.n = 1;
	}

	/* range. set all elements from num1 to num2, stepping
	 * by num3.  (the step is a downward-compatible extension
	 * proposed conceptually by bob@acornrc, syntactically
	 * designed then implemented by paul vixie).
	 */
	for (i = num1.n; i <= num2.n; i += num3.n)
		if (EOF == set_element(bits, low, high, i)) {
			unget_char(ch, file);
			return (EOF);
		}

	return (ch);
}

// static int
const get_number = (numptr: ref_number, low: number, names: string[] | null, ch: number, file: struct__FILE,
	terms: string) => {
	// char temp[MAX_TEMPSTR], *pc;
	let temp: _string = new _string;
	temp.setString('');
	let pc: _string;
	// int len, i;
	let len: number;
	let i: number;

	pc = temp;
	len = 0;

	const label_bad = () => {
		unget_char(ch, file);
	};
	/* first look for a number */
	while (isdigit(ch)) {
		if (++len >= MAX_TEMPSTR) {
			// goto bad;
			label_bad();
			return EOF;
		}
		// *pc++ = ch;
		pc.s += String.fromCharCode(ch);
		ch = get_char(file);
	}
	// *pc = '\0';
	if (len != 0) {
		/* got a number, check for valid terminator */
		if (!strchr(terms, ch)) {
			// goto bad;
			label_bad();
			return EOF;
		}
		numptr.n = atoi(temp.s);
		return (ch);
	}

	/* no numbers, look for a string if we have any */
	if (names) {
		while (isalpha(ch)) {
			if (++len >= MAX_TEMPSTR) {
				// goto bad;
				label_bad();
				return EOF;
			}
			// *pc++ = ch;
			pc.s += String.fromCharCode(ch);
			ch = get_char(file);
		}
		// *pc = '\0';
		if (len != 0 && strchr(terms, ch)) {
			for (i = 0; names[i] != null; i++) {
				Debug(DPARS | DEXT,
					"get_num, compare(%s,%s)\n", names[i],
					temp)
				if (!strcasecmp(names[i], temp.s)) {
					numptr.n = i + low;
					return (ch);
				}
			}
		}
	}

	bad:
	// unget_char(ch, file);
	label_bad();
	return (EOF);
}

// static int
const set_element = (bits:bitstr_t[], low:number, high:number, number:number) => {
	Debug(DPARS|DEXT, "set_element(?,%d,%d,%d)\n", low, high, number);

	if (number < low || number > high)
		return (EOF);

	bit_set(bits, (number-low));
	return (OK);
}
