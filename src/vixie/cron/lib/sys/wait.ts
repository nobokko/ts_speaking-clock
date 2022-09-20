// https://unix.superglobalmegacorp.com/Net2/newsrc/sys/wait.h.html
export const WNOHANG = 1;
export const WUNTRACED = 2;
type number_ptr = number[];
// pid_t waitpid(pid_t pid, int *status_ptr, int options);
export const waitpid = (_pid:number/*:pid_t*/, _status_ptr:number_ptr, _options:number) => 0;

export const WEXITSTATUS = (_wstatus:number_ptr) => 0;
export const WIFEXITED = (_wstatus:number) => true;
export const WIFSIGNALED = (_wstatus:number) => true;
// pid_t wait(int *wstatus);
export const wait = (_wstatus:number) => 0;
// #define WIFSTOPPED(x)	(_WSTATUS(x) == _WSTOPPED)
export const WIFSTOPPED = (x:number) => (_WSTATUS(x) == _WSTOPPED);
// #define	_WSTATUS(x)	(_W_INT(x) & 0177)
export const _WSTATUS = (x:number)	=> (_W_INT(x) & 0o177);
// #define	_WSTOPPED	0177		/* _WSTATUS if process is stopped */
export const _WSTOPPED = 0o177;
// _W_INT(i)	(i)
export const _W_INT = (i:number) => i;
// #define WSTOPSIG(x)	(_W_INT(x) >> 8)
export const WSTOPSIG = (x:number)	=> (_W_INT(x) >> 8);
// #define WTERMSIG(x)	(_WSTATUS(x))
export const WTERMSIG = (x:number)	=> (_WSTATUS(x));