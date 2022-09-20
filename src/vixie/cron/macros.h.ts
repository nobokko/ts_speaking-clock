// https://github.com/vixie/cron/blob/master/macros.h

	/* these are really immutable, and are
	 *   defined for symbolic convenience only
	 * TRUE, FALSE, and ERR must be distinct
	 * ERR must be < OK.
	 */
    export const TRUE = 1;
    export const FALSE = 0;
        /* system calls return this on success */
    export const OK = 0;
        /*   or this on error */
    export const ERR = -1;
    
        /* turn this on to get '-x' code */
    import {DEBUGGING} from "./config.h";
import { get_char } from "./funcs.h";
import { islower, toupper } from "./lib/ctype";
import { EOF, printf, struct__FILE } from './lib/stdio';
    // export const DEBUGGING = FALSE;
    
    export const INIT_PID = 1;	/* parent of orphans */
    export const READ_PIPE = 	0;	/* which end of a pipe pair do you read? */
    export const WRITE_PIPE = 	1;	/*   or write to? */
    export const STDIN = 		0;	/* what is stdin's file descriptor? */
    export const STDOUT = 		1;	/*   stdout's? */
    export const STDERR = 		2;	/*   stderr's? */
    export const ERROR_EXIT = 	1;	/* exit() with this will scare the shell */
    export const OK_EXIT = 		0;	/* exit() with this is considered 'normal' */
    export const MAX_FNAME = 	100;	/* max length of internally generated fn */
    export const MAX_COMMAND = 	1000;	/* max length of internally generated cmd */
    export const MAX_ENVSTR = 	1000;	/* max length of envvar=value\0 strings */
    export const MAX_TEMPSTR = 	100;	/* obvious */
    export const MAX_UNAME = 	33;	/* max length of username, should be overkill */
    export const ROOT_UID = 	0;	/* don't change this, it really must be root */
    export const ROOT_USER = 	"root";	/* ditto */
    
                    /* NOTE: these correspond to DebugFlagNames,
                     *	defined below.
                     */
    export const DEXT = 0x0001;	/* extend flag for other debug masks */
    export const DSCH = 0x0002;	/* scheduling debug mask */
    export const DPROC = 0x0004;	/* process control debug mask */
    export const DPARS = 0x0008;	/* parsing debug mask */
    export const DLOAD = 0x0010;	/* database loading debug mask */
    export const DMISC = 0x0020;	/* misc debug mask */
    export const DTEST = 0x0040;	/* test mode: don't execute any commands */
    
    export const PPC_NULL:null = null;
    
    export const MAXHOSTNAMELEN = 64;
    
    export const Skip_Blanks = (c:{n:number}, f:struct__FILE) => {
        while (c.n == '\t'.charCodeAt(0) || c.n == ' '.charCodeAt(0)) c.n = get_char(f);
        return c.n;
    };
    
    export const Skip_Nonblanks = (c:{n:number}, f:struct__FILE) => {
        while (c.n!='\t'.charCodeAt(0) && c.n!=' '.charCodeAt(0) && c.n!='\n'.charCodeAt(0) && c.n!= EOF) c.n = get_char(f);
        return c.n;
    };
    
    export const Debug = (mask:number, message:string, ...args:any[]) => {
        if (DEBUGGING) {
            if ((DebugFlags & (mask)) != 0) {printf (message, args);}
        } else {
            //
        }
    }
 
    export const MkUpper = (ch:number) => (islower(ch) ? toupper(ch) : ch);

    export const Set_LineNum = (ln:number) => {
        Debug(DPARS|DEXT, "linenum=%d\n", ln);
        LineNumber = ln;
    };
    
    // #ifdef HAVE_TM_GMTOFF
    // #define	get_gmtoff(c, t)	((t)->tm_gmtoff)
    // #endif
    
    export const SECONDS_PER_MINUTE = 60;
    export const SECONDS_PER_HOUR = 3600;
    
    export const FIRST_MINUTE = 0;
    export const LAST_MINUTE = 59;
    export const MINUTE_COUNT = (LAST_MINUTE - FIRST_MINUTE + 1);
    
    export const FIRST_HOUR = 0;
    export const LAST_HOUR = 23;
    export const HOUR_COUNT = (LAST_HOUR - FIRST_HOUR + 1);
    
    export const FIRST_DOM = 1;
    export const LAST_DOM = 31;
    export const DOM_COUNT = (LAST_DOM - FIRST_DOM + 1);
    
    export const FIRST_MONTH = 1;
    export const LAST_MONTH = 12;
    export const MONTH_COUNT = (LAST_MONTH - FIRST_MONTH + 1);
    
    /* note on DOW: 0 and 7 are both Sunday, for compatibility reasons. */
    export const FIRST_DOW = 0;
    export const LAST_DOW = 7;
    export const DOW_COUNT = (LAST_DOW - FIRST_DOW + 1);
    
    /*
     * Because crontab/at files may be owned by their respective users we
     * take extreme care in opening them.  If the OS lacks the O_NOFOLLOW
     * we will just have to live without it.  In order for this to be an
     * issue an attacker would have to subvert group CRON_GROUP.
     */
    export const O_NOFOLLOW = 0;
