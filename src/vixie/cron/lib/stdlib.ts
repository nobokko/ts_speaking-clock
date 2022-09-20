import { size_t } from "./stddef";
import { _string } from "./string";

export const exit = (status:number) => {if (status != 0) throw new Error(`終了します : ${status}`);};
export const _exit = (status:number) => {throw new Error(`終了します : ${status}`);};
export const putenv = (str:string) => 0;
// void abort(void);
export const abort = () => {throw new Error(`終了します : (abort)`);}
// long strtol(const char *s, char **endptr, int base);
export const strtol = (s:string, endptr:_string|null, base:number) => (2 <= base && base <= 36) ? Number.parseInt(s, base) : Number.parseInt(s);
// int mkstemp(char *template);
export const mkstemp = (template:string) => 1;
// char* getenv(const char* s);
export const getenv = (s:string):string|null => process.env[s] ?? null;
// int atoi(const char* str);
export const atoi = (str:string) => Number.parseInt(str) ?? 0;
// void* malloc(size_t size);
export const malloc = <T>(size:size_t):T[]|null => {
    if (size <= 0) {
        return null;
    } 
    return new Array<T>(size);
};
// void free(void* ptr);
export const free = <T>(ptr:T) => {};
