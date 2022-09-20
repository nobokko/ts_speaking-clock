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

import { do_command } from "./funcs.h";
import { entry, user } from "./structs.h";

// #if !defined(lint) && !defined(LINT)
// static char rcsid[] = "$Id: job.c,v 1.6 2004/01/23 18:56:43 vixie Exp $";
// #endif

// #include "cron.h"

class _job {
	// struct _job	*next;
    next:_job|null = null;
	// entry		*e;
    e:entry|null = null;
	// user		*u;
    u:user|null = null;
}
type job = _job;

// static job	*jhead = NULL, *jtail = NULL;
let jhead:job|null = null;
let jtail:job|null = null;

// void
// job_add(entry *e, user *u) {
// 	job *j;

// 	/* if already on queue, keep going */
// 	for (j = jhead; j != NULL; j = j->next)
// 		if (j->e == e && j->u == u)
// 			return;

// 	/* build a job queue element */
// 	if ((j = (job *)malloc(sizeof(job))) == NULL)
// 		return;
// 	j->next = NULL;
// 	j->e = e;
// 	j->u = u;

// 	/* add it to the tail */
// 	if (jhead == NULL)
// 		jhead = j;
// 	else
// 		jtail->next = j;
// 	jtail = j;
// }

// int
export const job_runqueue = () => {
	// job *j, *jn;
    let j:job|null;
    let jn:job|null;
	// int run = 0;
    let run = 0;

	for (j = jhead; j; j = jn) {
		do_command(j.e, j.u);
		jn = j.next;
		// free(j);
		run++;
	}
	jhead = jtail = null;

    return (run);
}