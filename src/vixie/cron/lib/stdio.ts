import * as fs from 'fs';
import * as util from 'util';
import { _string } from './string';
import { SEEK_SET } from './unistd';
const __fd_stdin = process.stdin.fd;
const __fd_stdout = process.stdout.fd;
const __fd_stderr = process.stderr.fd;
export class struct__FILE {
    mode: string = 'w';
    ptr: string = '';
    rcount: number = 0;
    wcount: number;
    base: string;
    bufsiz: number;
    fd: number;
    smallbuf: string[] = [''];

    private filename: string;
    private filecontent = '"test1"=1 test2\n'
        + '"test2"=2 test3\n'
        + 'pw_u\n'
        + '@hourly /bin/sh -c "ls -a"\n'
        + '1 2 3 4 5 /bin/sh -c "ls -alrt"\n'
        + '* * * * * /bin/sh -c "ls -al"\n'
        ;
    private _ungetc_buf: number[] = [];
    putc = (c: number) => {
        if (this.filecontent.length != this.wcount) {
            if (this.filecontent.length < this.wcount) {
                throw new Error('putc : write error');
            }
            this.filecontent = this.filecontent.substring(0, this.wcount);
        }
        this.filecontent += String.fromCharCode(c);
        this.wcount++;

        return c;
    }
    printf = (format: string, ...args:any[]) => {
        const buf = new _string;
        sprintf(buf, format, ...args);
        if (this.filecontent.length != this.wcount) {
            if (this.filecontent.length < this.wcount) {
                throw new Error('printf : write error');
            }
            this.filecontent = this.filecontent.substring(0, this.wcount);
        }
        this.filecontent += buf.s;
        this.wcount += buf.s.length;
    };
    ftell() {
        return this.rcount;
    }
    getc() {
        if (this._ungetc_buf.length) {
            return this._ungetc_buf.pop() as number;
        }
        if (this.feof()) { return EOF; }
        const c = this.filecontent.charCodeAt(this.rcount)
        this.rcount += 1;
        return c;
    }
    ungetc(c: number) {
        this._ungetc_buf.push(c);
        return c;
    }
    rewind() {
        this.rcount = 0;
    }
    fseek(offset: number, origin: number) {
        switch (origin) {
            case SEEK_SET:
                this.rcount = offset;
                break;
            case /*SEEK_CUR*/2:
                this.rcount += offset;
                break;
            case /*SEEK_END*/3:
                this.rcount = this.filecontent.length - offset;
                break;
            default:
                return -1;
        }
        return 0;
    }
    feof() {
        return this.filecontent.length <= this.rcount;
    }
    private static __createInstance(mode: string, fd: number | undefined, filename: string | null) {
        const f = new struct__FILE;
        f.filename = filename ?? '';
        f.fd = fd ?? 0;
        f.mode = mode;
        return f;
    }
    static fopen(filename: string, mode: string) {
        return struct__FILE.__createInstance(mode, undefined, filename);
    };
    static fdopen(fd: number, mode: string) {
        return struct__FILE.__createInstance(mode, fd, null);
    };
};

export const stdin: struct__FILE = (() => {
    const f = struct__FILE.fdopen(__fd_stdin, 'r');
    f.printf = (format, ...args) => {
        throw new Error('stdinへの書き込み');
    }

    return f;
})();
export const stdout: struct__FILE = (() => {
    const f = struct__FILE.fdopen(__fd_stdout, 'w');
    f.printf = (format, ...args) => {
        console.log({ format, args });
    };
    f.putc = (ch:number) => {
        fs.writeSync(process.stdout.fd, String.fromCharCode(ch));
        // console.log(String.fromCharCode(ch));
        return ch;
    };

    return f;
})();
export const stderr: struct__FILE = (() => {
    const f = struct__FILE.fdopen(__fd_stderr, 'w');
    f.printf = (format, ...args) => {
        // fs.writeSync(process.stdout.fd, JSON.stringify({ format, args }));
        // console.error({ format, args });
        console.error(util.format(format, ...args));
    }

    return f;
})();
export const EOF = -1;

export const fprintf = (file: struct__FILE | null, format:string, ...args:any[]) => {
    if (file === null) {
        return -1;
    }
    file.printf(format, ...args);
};
// int getchar(void);
export const getchar = () => 0;
// int printf(const char* restrict format, …);
export const printf = (format: string, ...args:any[]) => fprintf(stdin, format, ...args);
// FILE* fopen(const char* restrict filename, const char* restrict mode);
export const fopen = (filename: string, mode: string) => struct__FILE.fopen(filename, mode);
// FILE *fdopen(int fd, const char *mode);
export const fdopen = (fd: number, mode: string) => {
    const f = new struct__FILE;
    f.fd = fd;
    f.mode = mode;
    return f;
};
// void perror(const char* s);
export const perror = (s: string) => { };
// long int ftell(FILE *stream);
export const ftell = (stream: struct__FILE | null) => stream?.ftell() ?? 0;
// int ungetc(int c, FILE* stream);
export const ungetc = (c: number, stream: struct__FILE | null) => {
    if (stream == null) {
        return EOF;
    }

    return stream.ungetc(c);
};
// int fseek ( FILE * stream, long int offset, int whence );
export const fseek = (stream: struct__FILE | null, offset: number, whence: number) => stream?.fseek(offset, whence);
// int fclose(FILE* stream);
export const fclose = (stream: struct__FILE | null) => 0;
// int getc(FILE* stream);
export const getc = (stream: struct__FILE | null) => { if (stream == null) { return EOF; } return stream.getc(); };
// int sprintf(char *buffer, const char *format [, argument] ...);
export const sprintf = (buffer: _string, format: string, ...argument:any[]) => {
    buffer.setString(JSON.stringify(format, argument));
    return 0;
};
// int putc(int c, FILE* stream);
export const putc = (c: number, stream: struct__FILE | null) => stream?.putc(c) ?? EOF;
// int putchar( char );
export const putchar = (c: number) => putc(c, stdout);
// int fileno(FILE *stream);
export const fileno = (stream: struct__FILE | null) => 1;
// char* fgets(char* restrict s, int n, FILE* restrict stream);
export const fgets = (s: _string, n: number, stream: struct__FILE | null) => {
    if (stream == null) return null;
    s.setString('');
    for (let c = getc(stream); c != EOF; c = getc(stream)) {
        s.s += String.fromCharCode(c);
        if (c == '\n'.charCodeAt(0)) break;
    }
    return s.s;
};
// int ferror(FILE* stream);
export const ferror = (stream: struct__FILE | null) => 0;
// int fflush(FILE* stream);
export const fflush = (stream: struct__FILE | null) => stream == null ? EOF : 0;
// void rewind(FILE* stream);
export const rewind = (stream: struct__FILE | null) => { stream?.rewind() };
// int rename(const char* oldname, const char* newname);
export const rename = (oldname: string, newname: string) => 0;
// int feof(FILE *fp);
export const feof = (stream: struct__FILE | null) => stream?.feof() ?? false;