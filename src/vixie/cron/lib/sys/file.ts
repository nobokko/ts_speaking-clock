// #define Ta LOCK_SH Ta Ta 0x01 Ta       /* 共有ファイルロック */
// #define Ta LOCK_EX Ta Ta 0x02 Ta       /* 排他的ファイルロック */
export const LOCK_EX = 0x02;
// #define Ta LOCK_NB Ta Ta 0x04 Ta       /* ロックするときにブロックしない */
export const LOCK_NB = 0x04;
// #define Ta LOCK_UN Ta Ta 0x08 Ta       /* ファイルをアンロックする */
// int flock(int fd, int operation);  
export const flock = (fd:number, operation:number) => 0;
