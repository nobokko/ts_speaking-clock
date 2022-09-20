export class struct__dirent {
    d_ino/*:ino_t */ = 0;       /* inode 番号 */
    d_off/*:off_t */ = 0;       /* オフセットではない; 下記を参照 */
    d_reclen:number = 0;    /* このレコードの長さ */
    d_type:number = 0;      /* ファイル種別。全ファイルシステム */
    d_name:string = ''; /* ヌル終端されたファイル名 */
};

export class DIR {
    list = ['a','b','c'];
    read = 0;
};

// DIR *opendir(const char *name);
export const opendir = (name:string) => {
    return new DIR;
};

// struct dirent *readdir(DIR *dirp);
export const readdir = (dirp:DIR) => {
    if ((dirp.list.length <= dirp.read)) {
        return null;
    }
    dirp.read += 1;

    return new struct__dirent;
};

// int closedir(DIR *dirp);
export const closedir = (dirp:any) => 0;