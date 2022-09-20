type signal_func_t = (n: number) => void;

export const SIGCHLD = 20;
export const SIGINT = 1;/* todo:dummy */
export const SIGQUIT = 2;/* todo:dummy */
export const SIGHUP = 3;/* todo:dummy */
export const SIG_BLOCK = 1; /* todo:dummy */
export const SIG_SETMASK = 2; /* todo:dummy */
export const SIG_IGN = (n:number) => {}; /* todo:dummy */
// #define SIG_DFL (void (*)(int))0
export const SIG_DFL = (n: number) => { };
class siginfo_t {
    si_signo: number;     /* Signal number */
    si_errno: number;     /* An errno value */
    si_code: number;      /* Signal code */
    si_trapno: number;    /* Trap number that caused hardware-generated signal (unused on most architectures) */
    // si_pid:pid_t;       /* Sending process ID */
    // si_uid:uid_t;       /* Real user ID of sending process */
    si_status: number;    /* Exit value or signal */
    // si_utime:clock_t;     /* User time consumed */
    // si_stime:clock_t;     /* System time consumed */
    // si_value:sigval; /* Signal value */
    si_int: number;       /* POSIX.1b signal */
    si_ptr: any;       /* POSIX.1b signal */
    si_overrun: number;   /* Timer overrun count; POSIX.1b timers */
    si_timerid: number;   /* Timer ID; POSIX.1b timers */
    si_addr: any;      /* Memory location which caused fault */
    si_band: number;      /* Band event (was int in glibc 2.3.2 and earlier) */
    si_fd: number;        /* File descriptor */
    si_addr_lsb: number;  /* Least significant bit of address (since Linux 2.6.32) */
    si_lower: any;     /* Lower bound when address violation occurred (since Linux 3.19) */
    si_upper: any;     /* Upper bound when address violation occurred (since Linux 3.19) */
    si_pkey: number;      /* Protection key on PTE that caused fault (since Linux 4.6) */
    si_call_addr: any; /* Address of system call instruction (since Linux 3.5) */
    si_syscall: number;   /* Number of attempted system call (since Linux 3.5) */
    si_arch: number;  /* Architecture of attempted system call (since Linux 3.5) */
};

export class sigset_t { };

export class sigaction {
    sa_handler = (i: number) => { };
    sa_mask: sigset_t;
    sa_flags: number;
    sa_sigaction = (i: number, s: siginfo_t, p: any) => { };
};

export const sigemptyset = (set: sigset_t | null) => 0;
// void(*signal(int sig, void(*func)(int)))(int);
// typedef void (*func_t)(int);
// func_t signal(int sig, func_t func);
export const signal = (sig: number, func: signal_func_t): signal_func_t => (n: number) => { };
// int sigaddset(sigset_t *set, int signum);
export const sigaddset = (set:sigset_t|null, signum:number) => 0;
// int sigprocmask(int how, const sigset_t *set, sigset_t *oldset);
export const sigprocmask = (how:number,set:sigset_t|null, oldset:sigset_t|null) => 0;
// int kill(pid_t pid, int sig);
export const kill = (pid:number/*:pid_t*/, sig:number) => 0;
