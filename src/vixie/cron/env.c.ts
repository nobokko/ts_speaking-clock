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

import { free, malloc, strncmp } from "./externs.h";
import { get_string, glue_strings, skip_comments, strcmp_until } from "./funcs.h";
import { isspace } from "./lib/ctype";
import { errno } from "./lib/errno";
import { EOF, fseek, ftell, struct__FILE } from "./lib/stdio";
import { abort } from "./lib/stdlib";
import { strchr, strdup, strlen, _string } from "./lib/string";
import { Debug, DPARS, ERR, FALSE, MAX_ENVSTR, Set_LineNum, TRUE } from "./macros.h";

// #if !defined(lint) && !defined(LINT)
// static char rcsid[] = "$Id: env.c,v 1.10 2004/01/23 18:56:42 vixie Exp $";
// #endif

// #include "cron.h"

// char **
export const env_init = () => {
	// char **p = (char **) malloc(sizeof(char **));
    let p:string[] = [];

	// if (p != NULL)
	// 	p[0] = NULL;
	return (p);
}

// void
export const env_free = (envp:(string|null)[]) => {
	// char **p;

	// for (p = envp; *p != null; p++)
	// 	free(*p);
	// free(envp);
}

// char **
export const env_copy = (envp:string[]) => {
	// int count, i, save_errno;
	let count:number, i:number, save_errno:number;
	// char **p;
	let p:((string|null)[]|null) = [];

	for (count = 0; envp[count] != null; count++)
		null;
	// p = malloc((count+1) * sizeof(char *));  /* 1 for the NULL */
	p = malloc<string|null>((count+1) * 1);  /* 1 for the NULL */
	if (p != null) {
		for (i = 0; i < count; i++)
			if ((p[i] = strdup(envp[i])) == null) {
				save_errno = errno;
				while (--i >= 0)
					free(p[i]);
				free(p);
				// errno = save_errno;
				return (null);
			}
		p[count] = null;
	}
	return (p);
}

// char **
export const env_set = (envp:(string|null)[], envstr:string) => {
	// int count, found;
    let count:number;
    let found:number;
	// char **p, *envtmp;
    let p:(string|null)[];
    let envtmp:string|null;

	/*
	 * count the number of elements, including the null pointer;
	 * also set 'found' to -1 or index of entry if already in here.
	 */
	found = -1;
	for (count = 0; envp[count] != null; count++) {
		if (!strcmp_until(envp[count] as string, envstr, '='))
			found = count;
	}
	count++;	/* for the NULL */

	if (found != -1) {
		/*
		 * it exists already, so just free the existing setting,
		 * save our new one there, and return the existing array.
		 */
		if ((envtmp = strdup(envstr)) == null)
			return (null);
		// free(envp[found]);
		envp[found] = envtmp;
		return (envp);
	}

	/*
	 * it doesn't exist yet, so resize the array, move null pointer over
	 * one, save our string over the old null pointer, and return resized
	 * array.
	 */
	if ((envtmp = strdup(envstr)) == null)
		return (null);
	// p = (char **) realloc((void *) envp,
	// 		      (size_t) ((count+1) * sizeof(char **)));
    p = envp;
	if (p == null) {
		// free(envtmp);
		return (null);
	}
	p[count] = p[count-1];
	p[count-1] = envtmp;
	return (p);
}

/* The following states are used by load_env(), traversed in order: */
enum env_state {
	NAMEI,		/* First char of NAME, may be quote */
	NAME,		/* Subsequent chars of NAME */
	EQ1,		/* After end of name, looking for '=' sign */
	EQ2,		/* After '=', skipping whitespace */
	VALUEI,		/* First char of VALUE, may be quote */
	VALUE,		/* Subsequent chars of VALUE */
	FINI,		/* All done, skipping trailing whitespace */
	ERROR,		/* Error */
};

/* return	ERR = end of file
 *		FALSE = not an env setting (file was repositioned)
 *		TRUE = was an env setting
 */
// int
export const load_env = (envstr:_string, f:struct__FILE) => {
	// long filepos;
    let filepos:number;
	// int fileline;
    let fileline:number;
	// enum env_state state;
    let state:env_state;
	// char name[MAX_ENVSTR], val[MAX_ENVSTR];
    let name:_string;
    let val:_string;
	// char quotechar, *c, *str;
    let quotechar:string;
    let c:string;
    let str:_string;

	filepos = ftell(f);
	fileline = globalThis.LineNumber;
	skip_comments(f);
	if (EOF == get_string(envstr, MAX_ENVSTR, f, "\n"))
		return (ERR);

	Debug(DPARS, "load_env, read <%s>\n", envstr);

	// bzero(name, sizeof name);
    name = new _string;
	// bzero(val, sizeof val);
    val = new _string;
	str = name;
	state = env_state.NAMEI;
	quotechar = '';
	c = envstr.next();
	while (state != env_state.ERROR && c) {
		switch (state) {
		case env_state.NAMEI:
		case env_state.VALUEI:
			if (c == '\'' || c == '"') {
				quotechar = c;
                c = envstr.next();
            }
			state++;
			/* FALLTHROUGH */
		case env_state.NAME:
		case env_state.VALUE:
			if (quotechar) {
				if (c == quotechar) {
					state++;
                    c = envstr.next();
					break;
				}
				if (state == env_state.NAME && c == '=') {
					state = env_state.ERROR;
					break;
				}
			} else {
				if (state == env_state.NAME) {
					if (isspace(c.charCodeAt(0))) {
						c = envstr.next();
						state++;
						break;
					}
					if (c == '=') {
						state++;
						break;
					}
				}
			}
			str.s += c;
            c = envstr.next();
			break;

		case env_state.EQ1:
			if (c == '=') {
				state++;
				str = val;
				quotechar = '';
			} else {
				if (!isspace(c.charCodeAt(0)))
					state = env_state.ERROR;
			}
			c = envstr.next();
			break;

		case env_state.EQ2:
		case env_state.FINI:
			if (isspace(c.charCodeAt(0)))
				c = envstr.next();
			else
				state++;
			break;

		default:
			abort();
		}
	}
	if (state != env_state.FINI && !(state == env_state.VALUE && !quotechar)) {
		Debug(DPARS, "load_env, not an env var, state = %d\n", state)
		fseek(f, filepos, 0);
		Set_LineNum(fileline);
		return (FALSE);
	}
	if (state == env_state.VALUE) {
		/* End of unquoted value: trim trailing whitespace */
		// c = val + strlen(val);
		// while (c > val && isspace((unsigned char)c[-1]))
		// 	*(--c) = '\0';
        val.s = val.s.trimEnd();
	}

	/* 2 fields from parser; looks like an env setting */

	/*
	 * This can't overflow because get_string() limited the size of the
	 * name and val fields.  Still, it doesn't hurt to be careful...
	 */
	if (!glue_strings(envstr, MAX_ENVSTR, name.s, val.s, '='))
		return (FALSE);
	Debug(DPARS, "load_env, <%s> <%s> -> <%s>\n", name, val, envstr);
	return (TRUE);
}

// char *
export const env_get = (name:string, envp:(string|null)[]) => {
	// int len = strlen(name);
	let len:number = strlen(name);
	// char *p, *q;
	let q:string|null;

	// while ((p = *envp++) != NULL) {
	// 	if (!(q = strchr(p, '=')))
	// 		continue;
	// 	if ((q - p) == len && !strncmp(p, name, len))
	// 		return (q+1);
	// }
	for (let p of envp) {
		if (p == null) break;
		if (!(q = strchr(p, '='.charCodeAt(0))))
			continue;
		// if ((q - p) == len && !strncmp(p, name, len))
		if (q.length == len && !strncmp(p, name, len))
			return (q+1);
	}
	return (null);
}