import { struct__utimbuf } from "./sys/types";

// int utime(const char *filename, const struct utimbuf *times);
export const utime = (filename:string, times:struct__utimbuf|null) => 0;
