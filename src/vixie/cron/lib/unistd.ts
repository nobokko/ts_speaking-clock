// import { exec, execFile, fork, spawn } from "child_process";
import * as child_process from "child_process";

import { _string } from './string';
import { gid_t, off_t, uid_t } from './sys/types';
// http://www.sde.cs.titech.ac.jp/~gondow/dwarf2-xml/HTML-dxref//usr/include/sys/unistd.h.html
export const SEEK_SET = 0;
export const _SC_OPEN_MAX = 5;

export const fork = () => 0;
export const setsid = () => 0;
export const dup2 = (oldfd: number, newfd: number) => 0;
// unsigned int sleep(unsigned int seconds);
export const sleep = (seconds: number) => 0;
declare global {
    var optarg: string;
    var optind: number;
    var opterr: number;
}
globalThis.optind = 1;
globalThis.opterr = 0;
let marker = 1;
// int getopt(int argc, char * const argv[], const char *optstring);
export const getopt = (argc: number, argv: string[], optstring: string): number => {
    if (argv.length <= globalThis.optind) {
        marker = 1;
        return -1;
    }
    if (argv[globalThis.optind].charAt(0) !== '-') {
        marker = 1;
        return -1;
    }
    if (argv[globalThis.optind] === '--') {
        marker = 1;
        return -1;
    }

    const c = argv[globalThis.optind].charAt(marker++);
    const idx = optstring.indexOf(c);
    if (idx < 0) {
        return '?'.charCodeAt(0);
    }
    if (optstring.charAt(idx + 1) != ':') {
        if (argv[globalThis.optind].length <= marker) {
            globalThis.optind++;
            marker = 1;
        }

        return c.charCodeAt(0);
    }

    const rest = argv[globalThis.optind].substring(marker);
    if (rest == '') {
        globalThis.optind++;
        if (argv.length <= globalThis.optind) {
            return '?'.charCodeAt(0);
        }
        if (argv[globalThis.optind] === '--') {
            globalThis.optind++;
            if (argv.length <= globalThis.optind) {
                return '?'.charCodeAt(0);
            }
        }
        globalThis.optarg = argv[globalThis.optind];
    } else {
        globalThis.optarg = rest;
    }
    globalThis.optind++;
    marker = 1;
    return c.charCodeAt(0);
};
// // int close(int fd);
// export const close = (fd:number) => 0;
// ssize_t read(int fd, void *buf, size_t count);
export const read = (fd: number, buf: _string, count: number) => 0;
// off_t lseek(int fd, off_t offset, int whence);
export const lseek = (fd: number, offset: off_t, whence: number): off_t => 0;
// int write(int fd, void *buf, unsigned int byte)
export const write = (fd: number, buf: string, byte: number) => 0;
// int ftruncate(int fd, off_t length);
export const ftruncate = (fd: number, length: off_t) => 0;
// struct fd_pair {
//     long fd[2];
//     };
// struct fd_pair pipe();
// int pipe(int pipefd[2]);
export const pipe = (pipefd: number[]) => 0;
// pid_t vfork(void);
export const vfork = ()/*:pid_t*/ => 0;
// int chdir(const char *path);
export const chdir = (path: string | null) => 0;
// int execle(const char *path, const char *arg, ...);
export const execle = (path: string | null, arg: string | null, ..._args:any[]) => 0;
// long sysconf(int name);
export const sysconf = (name: number) => 0;
// int setgid(gid_t gid);
export const setgid = (gid: gid_t) => 0;
// int setuid(uid_t uid);  
export const setuid = (uid: uid_t) => 0;
// int execvp(const char *file, char *const argv[]);
export const execvp = (file: string, argv: string[]) => 0;
// int gethostname(char *name, size_t len);
export const gethostname = (name: _string, len: number) => {
    name.setString('hostname');
    return 0;
};
// int setregid(gid_t rgid, gid_t egid);
export const setregid = (rgid: gid_t, egid: gid_t) => 0;
// gid_t getegid(void);  
export const getegid = () => 0;
// int setreuid(uid_t ruid, uid_t euid);
export const setreuid = (ruid: uid_t, euid: uid_t) => 0;
// uid_t geteuid(void);  
export const geteuid = () => 0;
// int unlink(const char *pathname);
export const unlink = (pathname: string) => 0;
// int chown(const char *pathname, uid_t owner, gid_t group);
export const chown = (pathname: string, owner: uid_t, group: gid_t) => 0;
// int execlp(const char *file, const char *arg, ...);
export const execlp = (file: string, arg: string, ...args:any[]) => {
    if (file == null) {
        return -1;
    }
    const options: string[] = [];
    // if (arg !== null) {
    //     options.push(arg);
    // }
    if (args.length) {
        args.pop();// 最後は取り除く
        options.push(...args);
    }
    const cp = child_process.spawn(file, options);
    cp.stdout.on('data', (chunk) => {
        console.log(new Date())
        console.log(chunk.length)
        // console.log(chunk.toString())
    });
    return 0;
};
