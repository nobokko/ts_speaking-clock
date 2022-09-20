// https://github.com/vixie/cron/blob/master/globals.h

export const copyright = ['@(#) Vixie Cron'];

export const MonthNames = [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const DowNames = [
	"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
];
declare global {
 var ProgramName:string;
}
globalThis.ProgramName = "amnesia";
declare global {
	var LineNumber:number;
}
globalThis.LineNumber = 0;
declare global {
	var StartTime:number;
}
globalThis.StartTime = 0;
declare global {
	var NoFork:number;
}
globalThis.NoFork = 0;
export const ts_zero = { tv_sec: 0, tv_nsec: 0 };
declare global {
	var DebugFlags:number;
}
globalThis.DebugFlags = 0;
export const DebugFlagNames = [
	"ext", "sch", "proc", "pars", "load", "misc", "test", "bit",
];
