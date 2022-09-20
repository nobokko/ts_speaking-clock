import { close, dup2, EINTR, execvp, fclose, fdopen, fileno, fprintf, initgroups, PID_T, pipe, setgid, setuid, sigaddset, sigemptyset, SIGHUP, SIGINT, sigprocmask, SIGQUIT, SIG_BLOCK, SIG_SETMASK, stderr, strtok, sysconf, vfork, waitpid, WAIT_T, WEXITSTATUS, WIFEXITED, _exit, _SC_OPEN_MAX } from './externs.h';
import { errno } from './lib/errno';
import { struct__passwd } from './lib/pwd';
import { sigset_t } from './lib/signal';
import { struct__FILE } from './lib/stdio';
import { STDERR, STDIN, STDOUT } from './macros.h';
// /*
//  * Copyright (c) 1988, 1993, 1994
//  *	The Regents of the University of California.  All rights reserved.
//  *
//  * This code is derived from software written by Ken Arnold and
//  * published in UNIX Review, Vol. 6, No. 8.
//  *
//  * Redistribution and use in source and binary forms, with or without
//  * modification, are permitted provided that the following conditions
//  * are met:
//  * 1. Redistributions of source code must retain the above copyright
//  *    notice, this list of conditions and the following disclaimer.
//  * 2. Redistributions in binary form must reproduce the above copyright
//  *    notice, this list of conditions and the following disclaimer in the
//  *    documentation and/or other materials provided with the distribution.
//  * 3. All advertising materials mentioning features or use of this software
//  *    must display the following acknowledgement:
//  *	This product includes software developed by the University of
//  *	California, Berkeley and its contributors.
//  *
//  * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND
//  * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//  * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//  * ARE DISCLAIMED.  IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
//  * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
//  * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
//  * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
//  * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
//  * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
//  * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
//  * SUCH DAMAGE.
//  *
//  */

// /* this came out of the ftpd sources; it's been modified to avoid the
//  * globbing stuff since we don't need it.  also execvp instead of execv.
//  */

// #ifndef lint
// #if 0
// static sccsid[] = "@(#)popen.c	8.3 (Berkeley) 4/6/94";
// #else
// static char rcsid[] = "$Id: popen.c,v 1.6 2003/02/16 04:40:01 vixie Exp $";
// #endif
// #endif /* not lint */

// #include "cron.h"

// #define MAX_ARGV	100
// #define MAX_GARGV	1000

// /*
//  * Special version of popen which avoids call to shell.  This ensures noone
//  * may create a pipe to a hidden program as a side effect of a list or dir
//  * command.
//  */
// static PID_T *pids;
let pids:PID_T[]|null = null;
// static int fds;
let fds:number;

// FILE *
export const cron_popen = (program:string, type:string, pw:struct__passwd|null) => {
	// char *cp;
    let cp:string|null;
	// FILE *iop;
	let iop:struct__FILE|null;
	// int argc, pdes[2];
	let argc:number;
    let pdes:number[] = [0,0];
	// PID_T pid;
	let pid:PID_T;
	// char *argv[MAX_ARGV];
	let argv:(string|null)[] = [];

	if ((type != 'r' && type != 'w') || type.length != 1)
		return (null);

	if (!pids) {
		if ((fds = sysconf(_SC_OPEN_MAX)) <= 0)
			return (null);
		// if (!(pids = (PID_T *)malloc((size_t)(fds * sizeof(PID_T)))))
		// 	return (NULL);
        pids = new Array<number>(fds);
		// bzero(pids, fds * sizeof(PID_T));
        pids = pids.map(pid => 0);
	}
	if (pipe(pdes) < 0)
		return (null);

	// /* break up string into pieces */
	// for (argc = 0, cp = program; argc < MAX_ARGV - 1; cp = null) {
	// 	if (!(argv[argc++] = strtok(cp, " \t\n")))
	// 		break;
    // }
    argv = program.split(/[ \t\n]/);
	// argv[MAX_ARGV-1] = NULL;
    argv.push(null);

	switch (pid = vfork()) {
	case -1:			/* error */
		close(pdes[0]);
		close(pdes[1]);
		return (null);
		/* NOTREACHED */
	case 0:				/* child */
		if (pw) {
// #ifdef LOGIN_CAP
// 			if (setusercontext(0, pw, pw->pw_uid, LOGIN_SETALL) < 0) {
// 				fprintf(stderr,
// 				    "setusercontext failed for %s\n",
// 				    pw->pw_name);
// 				_exit(ERROR_EXIT);
// 			}
// #else
			if (setgid(pw.pw_gid) < 0 ||
			    initgroups(pw.pw_name, pw.pw_gid) < 0) {
				fprintf(stderr,
				    "unable to set groups for %s\n",
				    pw.pw_name);
				_exit(1);
			}
// #if (defined(BSD)) && (BSD >= 199103)
// 			setlogin(pw->pw_name);
// #endif /* BSD */
			if (setuid(pw.pw_uid)) {
				fprintf(stderr,
				    "unable to set uid for %s\n",
				    pw.pw_name);
				_exit(1);
			}
// #endif /* LOGIN_CAP */
		}
		if (type == 'r') {
			if (pdes[1] != STDOUT) {
				dup2(pdes[1], STDOUT);
				close(pdes[1]);
			}
			dup2(STDOUT, STDERR);	/* stderr too! */
			close(pdes[0]);
		} else {
			if (pdes[0] != STDIN) {
				dup2(pdes[0], STDIN);
				close(pdes[0]);
			}
			close(pdes[1]);
		}
		execvp(argv[0] ?? '', argv as string[]);
		_exit(1);
	}

	/* parent; assume fdopen can't fail...  */
	if (type == 'r') {
		iop = fdopen(pdes[0], type);
		close(pdes[1]);
	} else {
		iop = fdopen(pdes[1], type);
		close(pdes[0]);
	}
	pids[fileno(iop)] = pid;

	return (iop);
}

// int
export const cron_pclose = (iop:struct__FILE|null) => {
	// int fdes;
	let fdes:number = 0;
	// PID_T pid;
	let pid:PID_T;
	// WAIT_T status;
	let status:number[] = [0];
	// sigset_t sigset, osigset;
	let sigset:sigset_t|null = null;
    let osigset:sigset_t|null = null;

	/*
	 * pclose returns -1 if stream is not associated with a
	 * `popened' command, or, if already `pclosed'.
	 */
	if (pids?.length == 0 || (pids?.[fdes = fileno(iop)] ?? 0) == 0)
		return (-1);
    if (pids == null) pids = [];
	fclose(iop);
	sigemptyset(sigset);
	sigaddset(sigset, SIGINT);
	sigaddset(sigset, SIGQUIT);
	sigaddset(sigset, SIGHUP);
	sigprocmask(SIG_BLOCK, sigset, osigset);
	while ((pid = waitpid(pids[fdes], status, 0)) < 0 && errno == EINTR)
		continue;
	sigprocmask(SIG_SETMASK, osigset, null);
	pids[fdes] = 0;
	if (pid < 0)
		return (pid);
	if (WIFEXITED(status[0]))
		return (WEXITSTATUS(status));
	return (1);
}
