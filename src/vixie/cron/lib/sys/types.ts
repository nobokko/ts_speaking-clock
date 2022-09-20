import { time_t } from "../time";

export const getuid = () => 0;
export const getgid = () => 0;
export const getpid = () => 0;
export type mode_t = number;
export type off_t = number;
export type gid_t = number;
export type uid_t = number;
export class struct__utimbuf {
    actime:time_t = 0;       /* アクセス時刻 */
    modtime:time_t = 0;      /* 修正時刻 */
};