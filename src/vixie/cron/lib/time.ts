export type time_t = number;
export class struct__tm {
    tm_sec:number = 0;
    tm_min:number = 0;
    tm_hour:number = 0;
    tm_mday:number = 0;
    tm_mon:number = 0;
    tm_year:number = 0;
    tm_wday:number = 0;
    tm_yday:number; // tm_year/1/1からの経過日数
    tm_isdst:number; // 夏時間
};
export class struct__timespec {
    tv_sec:time_t = 0;
    tv_nsec:number = 0;
  };

// struct tm* gmtime(const time_t* t);
export const gmtime = (time:time_t) => {
  const tm = new struct__tm;
  const now = new Date();

  tm.tm_year = now.getFullYear() - 1900;
  tm.tm_mon = now.getMonth();
  tm.tm_mday = now.getDate();
  tm.tm_hour = now.getHours();
  tm.tm_min = now.getMinutes();
  tm.tm_sec = now.getSeconds();
  tm.tm_wday = now.getDay();

  return tm;
};
// struct tm *gmtime_r(const time_t *time, struct tm *result);
export const gmtime_r = (time:time_t, result:struct__tm|null = null) => new struct__tm;
// time_t time( time_t *destTime )
export const time = (destTime:time_t|null):time_t => (new Date()).getTime();
// struct tm *localtime( const time_t *sourceTime )
export const localtime = (sourceTime:time_t) => new struct__tm;
// char *ctime(const time_t *timer);
export const ctime = (timer:time_t) => '2022/09/19 00:00:00';