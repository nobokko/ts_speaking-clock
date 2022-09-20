// /*
//  * Copyright (c) 1988,1990,1993,1994,2021 by Paul Vixie ("VIXIE")
//  * Copyright (c) 2004 by Internet Systems Consortium, Inc. ("ISC")
//  * Copyright (c) 1997,2000 by Internet Software Consortium, Inc.
//  *
//  * Permission to use, copy, modify, and distribute this software for any
//  * purpose with or without fee is hereby granted, provided that the above
//  * copyright notice and this permission notice appear in all copies.
//  *
//  * THE SOFTWARE IS PROVIDED "AS IS" AND ISC DISCLAIMS ALL WARRANTIES
//  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
//  * MERCHANTABILITY AND FITNESS.  IN NO EVENT SHALL ISC BE LIABLE FOR
//  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
//  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
//  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT
//  * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
//  */

import { env_free, env_init, env_set, free_entry, load_entry, load_env } from "./funcs.h";
import { errno } from "./lib/errno";
import { struct__passwd } from "./lib/pwd";
import { fclose, fdopen, perror, struct__FILE } from "./lib/stdio";
import { strdup, _string } from "./lib/string";
import { Debug, DPARS, ERR, FALSE, OK, TRUE } from "./macros.h";
import { entry, user } from "./structs.h";

// #if !defined(lint) && !defined(LINT)
// static char rcsid[] = "$Id: user.c,v 1.5 2004/01/23 18:56:43 vixie Exp $";
// #endif

// /* vix 26jan87 [log is in RCS file]
//  */

// #include "cron.h"

// void
export const free_user = (u:user) => {
	// entry *e, *ne;
    let e:entry|null;
    let ne:entry|null;

	// free(u->name);
    u.name = '';
	for (e = u.crontab;  e != null;  e = ne) {
		ne = e.next;
		free_entry(e);
	}
	// free(u);
}

// user *
export const load_user = (crontab_fd:number,pw:struct__passwd|null, name:string):user|null => {
	// char envstr[MAX_ENVSTR];
    let envstr:_string = new _string;
	// FILE *file;
    let file:struct__FILE|null;
	let u:user|null;
	let e:entry|null;
	// int status, save_errno;
    let status:number;
    let save_errno:number;
	// char **envp, **tenvp;
    let envp:(string|null)[];
    let tenvp:(string|null)[]|null;

	if (!(file = fdopen(crontab_fd, "r"))) {
		perror("fdopen on crontab_fd in load_user");
		return (null);
	}

	Debug(DPARS, ("load_user()\n"))

	/* file is open.  build user entry, then read the crontab file.
	 */
	// if ((u = (user *) malloc(sizeof(user))) == NULL)
	// 	return (NULL);
    u = new user;
	if ((u.name = strdup(name)) == null) {
		// save_errno = errno;
		// free(u);
		// errno = save_errno;
		return (null);
	}
	u.crontab = null;

	/* init environment.  this will be copied/augmented for each entry.
	 */
	if ((envp = env_init()) == null) {
		save_errno = errno;
		// free(u.name);
		// free(u);
		// errno = save_errno;
		return (null);
	}

    (() => {
        /* load the crontab
         */
        while ((status = load_env(envstr, file)) >= OK) {
            switch (status) {
            case ERR:
                free_user(u);
                u = null;
                // goto done;
                return;
            case FALSE:
                e = load_entry(file, null, pw, envp as string[]);
                if (e) {
                    e.next = u.crontab;
                    u.crontab = e;
                }
                break;
            case TRUE:
                if ((tenvp = env_set(envp, envstr.s)) == null) {
                    save_errno = errno;
                    free_user(u);
                    u = null;
                    // errno = save_errno;
                    // goto done;
                    return;
                }
                envp = tenvp;
                break;
            }
        }
    })();

 done:
	env_free(envp);
	fclose(file);
	Debug(DPARS, ("...load_user() done\n"))
	return (u);
}