import { gid_t, uid_t } from "./sys/types";

export class struct__passwd {
    pw_name: string = '';       /* ユーザー名 */
    pw_passwd: string = '';     /* ユーザーのパスワード */
    pw_uid: uid_t = 0;        /* ユーザー ID */
    pw_gid: gid_t = 0;        /* グループ ID */
    pw_gecos: string = '';      /* ユーザー情報 */
    pw_dir: string = '';        /* ホームディレクトリ */
    pw_shell: string = '';      /* シェルプログラム */

    memcpy(buf:struct__passwd) {
        this.pw_uid = buf.pw_uid;
        this.pw_gid = buf.pw_gid;
        this.pw_name = buf.pw_name;
        this.pw_passwd = buf.pw_passwd;
        this.pw_gecos = buf.pw_gecos;
        this.pw_dir = buf.pw_dir;
        this.pw_shell = buf.pw_shell;
    }
};

export const endpwent = () => { };
// struct passwd *getpwnam(const char *name);
export const getpwnam = (name: string) => {
    const passwd = new struct__passwd;
    passwd.pw_name = name;
    return passwd;
};
// struct passwd *getpwuid(uid_t uid);
export const getpwuid = (uid: uid_t) => {
    const passwd = new struct__passwd;
    passwd.pw_name = 'pw_u';
    passwd.pw_uid = uid;
    return passwd;
};
