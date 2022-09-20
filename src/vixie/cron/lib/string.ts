export class _string {
    s:string = '';
    setString(str:string) {
        this.s = str;
        this.pos = 0;
    }
    private pos:number = 0;
    next() {
        if (this.s.length > this.pos) {
            return this.s.charAt(this.pos++);
        } else {
            return '';
        }
    }
}

// char *strdup(const char *s);
export const strdup = (s:string) => s;
// size_t strlen(const char* s);
export const strlen = (s:string) => s.length;
// char *strchr(const char *s, int c);
export const strchr = (s:string, c:number) => {
    const pos = s.indexOf(String.fromCharCode(c));
    return pos < 0 ? null : s.substring(pos);
};
// char *strerror(int errnum);
export const strerror = (errnum:number) => '';
// int strncmp(const char *s1, const char *s2, size_t n);
export const strncmp = (s1:string, s2:string, n:number) => (s1.substring(0, n) == s2.substring(0, n) ? 0 : 1);
// char *strtok(char *s1, const char *s2);
export const strtok = (s1:string, s2:string) => {
    const m = s1.match(new RegExp(`[${s2}]`));
    if (m == null) return null;
    return s1.substring(m[0].length+1);
};
// char *strcpy(char *s1, const char *s2);
export const strcpy = (s1:_string, s2:string) => {s1.setString(s2); return s1.s;}
// int strcmp(const char *s1, const char *s2);
export const strcmp = (s1:string, s2:string) => s1 == s2 ? 0 : 1;
// int strcasecmp(const char *s1, const char *s2);
export const strcasecmp = (s1:string, s2:string) => s1.toLowerCase() == s2.toLowerCase() ? 0 : 1;
// void *memcpy(void *buf1, const void *buf2, size_t n);
export const memcpy = <T>(buf1:T, buf2:T, n:number) => {
    if ((buf1 as {memcpy:(buf:T) => void})?.memcpy) {
        (buf1 as {memcpy:(buf:T) => void}).memcpy(buf2);
    }
    return buf1;
};