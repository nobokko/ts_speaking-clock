import { struct__timespec, time_t } from '../time';
import { gid_t, mode_t, off_t, uid_t } from "./types";

type dev_t = number;
type ino_t = number;
type nlink_t = number;
type blksize_t = number;
type blkcnt_t = number;

export class struct__stat {
    st_dev:dev_t;     /* ファイルがあるデバイスの ID */
    st_ino:ino_t;     /* inode 番号 */
    st_mode: mode_t;    /* アクセス保護 */
    st_nlink:nlink_t;   /* ハードリンクの数 */
    st_uid:uid_t;     /* 所有者のユーザー ID */
    st_gid:gid_t;     /* 所有者のグループ ID */
    st_rdev:dev_t;    /* デバイス ID (特殊ファイルの場合) */
    st_size:off_t;    /* 全体のサイズ (バイト単位) */
    st_blksize:blksize_t; /* ファイルシステム I/O での
                             ブロックサイズ */
    st_blocks:blkcnt_t;  /* 割り当てられた 512B のブロック数 */

    st_atim: struct__timespec = new struct__timespec;  /* 最終アクセス時刻 */
    st_mtim: struct__timespec = new struct__timespec;  /* 最終修正時刻 */
    st_ctim: struct__timespec = new struct__timespec;  /* 最終状態変更時刻 */

    // #define st_atime st_atim.tv_sec      /* 後方互換性 */
    st_atime:time_t;
    // #define st_mtime st_mtim.tv_sec
    st_mtime:time_t;
    // #define st_ctime st_ctim.tv_sec
    st_ctime:time_t;
};

// #define S_ISREG(m)      ((m & 0170000) == 0100000)      /* regular file */
export const S_ISREG = (m:number) => ((m & 0o170000) == 0o100000);

export const stat = (pathname: string, buf: struct__stat) => {
    buf.st_mtim.tv_sec = 1;
    return 0;
};

// int fstat(int fildes, struct stat *buf);
export const fstat = (fildes: number, buf: struct__stat | null) => {
    if (buf != null) {
        buf.st_mode = 0o100000 + 0o600;
        buf.st_uid = 0;
        buf.st_nlink = 1;
    };
    return 0;
};

// int fchmod(int fd, mode_t mode);
export const fchmod = (fd:number, mode:mode_t) => 0;