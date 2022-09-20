import { mode_t } from "./sys/types";

// https://github.com/torvalds/linux/blob/master/include/uapi/asm-generic/fcntl.h
export const O_RDONLY = 0o0;
export const O_WRONLY = 0o0000001;
export const O_RDWR = 0o2;
export const O_APPEND = 0o0002000;
export const O_NONBLOCK	= 0o4000;
export const O_NOFOLLOW = 0o400000;
export const O_CREAT = 0o0000100;
export const F_SETFD = 2;

export const open = (pathname:string, flags:number, mode:mode_t) => 0;
export const close = (fd:number) => 0;
// int fcntl(int fd, int cmd, ... /* arg */ );
export const fcntl = (fd:number, cmd:number, ...arg:any[]) => 0;