import * as Parser from "./settingParser";

const eventHandlers = {
    // xxx[Schedule]は省略する
    start: Array<CallableFunction>(),
    update: Array<CallableFunction>(),
    beforeExecute: Array<CallableFunction>(),
    afterExecute: Array<CallableFunction>(),
};
type CronEvent = keyof typeof eventHandlers;
export function addEventListener(event: CronEvent, listener: CallableFunction) {
    eventHandlers[event].push(listener);
}
export function removeEventListener(event: CronEvent, listener: CallableFunction) {
    eventHandlers[event] = eventHandlers[event].filter(eventListener => {
        return listener != eventListener;
    });
}

type CronTaskResult = void | Promise<any>;
type CronTaskA = () => CronTaskResult;
type CronTaskB = (cronTime: Parser.CronTime) => CronTaskResult;
type CronTask = CronTaskA | CronTaskB;

function isCronTaskA(task: CronTask): task is CronTaskA {
    return task.length == 0;
}

function isCronTaskB(task: CronTask): task is CronTaskB {
    return task.length == 1;
}

function currentDate() {
    return new Date(Date.now());
}

type CronLastExecuteTime = {
    分: number,
    時: number,
    日: number,
    月: number,
    曜日: number,
};

type CronScheduleInfo = {
    id: number,
    label?: string,
    description?: string,
    cronTime: Parser.CronTime,
    task: CronTask,
    lastCronExecute?: CronLastExecuteTime,
    nextDate: Date,
};

const schedule: CronScheduleInfo[] = [];

function start__time() {
    const now = currentDate();
    const next = new Date(now);
    next.setMilliseconds(1000);
    next.setSeconds(60);

    return next.getTime() - now.getTime();
}

function start__exec() {
    new Promise(() => {
        if (schedule.length == 0) {
            return;
        }
        const now = currentDate();
        while (schedule[0].nextDate.getTime() <= now.getTime()) {
            now.setMilliseconds(1);
            const targetSchedule = schedule[0];
            const lastCronExecute = {
                分: targetSchedule.nextDate.getMinutes(),
                時: targetSchedule.nextDate.getHours(),
                日: targetSchedule.nextDate.getDate(),
                月: targetSchedule.nextDate.getMonth() + 1,
                曜日: targetSchedule.nextDate.getDay(),
            };
            Promise.all(eventHandlers.beforeExecute.map(listener => new Promise((resolve) => { resolve(listener()); })))
                .then(() => {
                    return new Promise((resolve) => {
                        if (isCronTaskA(targetSchedule.task)) {
                            resolve(targetSchedule.task());
                        } else if (isCronTaskB(targetSchedule.task)) {
                            resolve(targetSchedule.task({ ...targetSchedule.cronTime }));
                        }
                    });
                })
                .then(() => {
                    return Promise.all(eventHandlers.afterExecute.map(listener => new Promise((resolve) => { resolve(listener()); })));
                });
            targetSchedule.nextDate = nextTime(targetSchedule.cronTime, now, lastCronExecute);
            targetSchedule.lastCronExecute = lastCronExecute;
            // console.debug(`next : ${targetSchedule.nextDate}`)
            scheduleSort();
        }
    });
    setTimeout(start__exec, start__time());
}

let started = false;
export function start() {
    if (!started) {
        started = true;
        new Promise(() => {
            eventHandlers.start.forEach(listener => listener());
        });
        scheduleSort();
        start__exec();
    }
}

export function status() {
    return {
        started: started,
        sequence: sequence,
        schedule: schedule.map(info => info.id),
    };
}

function scheduleSort() {
    const before = schedule.map(s => `${s.id}_${s.nextDate}`).join(',');
    schedule.sort((a, b) => {
        return a.nextDate.getTime() - b.nextDate.getTime();
    });
    const after = schedule.map(s => `${s.id}_${s.nextDate}`).join(',');
    if (before != after) {
        new Promise(() => {
            eventHandlers.update.forEach(listener => listener());
        });
    }
}

let sequence = 1;

export function append(setting: string | Parser.CronTime, task: CronTask, label?: string, description?: string): number {
    const cronTime = typeof setting == 'string' ? Parser.parse(setting) : setting;
    const nextDate = nextTime(cronTime, currentDate());
    const id = sequence++;
    schedule.push({ id: id, cronTime, task, label, description, nextDate });
    // console.debug(schedule);

    if (started) {
        scheduleSort();
    }

    return id;
}

export function remove(...ids: number[]) {
    const targets:number[] = [];
    schedule.forEach((info, index) => {
        if (ids.indexOf(info.id) >= 0) {
            targets.push(index);
        }
    });
    while (targets.length) {
        // const after = schedule.slice(targets.pop(), 1);
        schedule.splice(targets.pop(), 1);
    }
    scheduleSort();
}

function nextTime(crontime: Parser.CronTime, now: Date, lastCronExecute?: CronLastExecuteTime) {
    const nextDate = new Date(now);
    // 未来方向にミリ秒をキレイにする
    nextDate.setMilliseconds(1000);
    // 未来方向に秒をキレイにする（結果基本的に実行時間より分が１分進む）
    nextDate.setSeconds(60);

    const calc = (単位: keyof (Parser.CronTime), min: number, max: () => number) => {
        const dateProperties = (() => {
            switch (単位) {
                case '分':
                    return {
                        getter: () => nextDate.getMinutes(),
                        setter: (value: number) => nextDate.setMinutes(value),
                    };
                case '時':
                    return {
                        getter: () => nextDate.getHours(),
                        setter: (value: number) => nextDate.setHours(value),
                    };
                case '日':
                    return {
                        getter: () => nextDate.getDate(),
                        setter: (value: number) => nextDate.setDate(value),
                    };
                case '月':
                    return {
                        getter: () => { return nextDate.getMonth() + 1; },
                        setter: (value: number) => nextDate.setMonth(value - 1),
                    };
            }
        })();
        let valuechange = false;
        if (!lastCronExecute) {
            const nextvalue = dateProperties.getter();
            if (crontime[単位].targets.indexOf(nextvalue) != -1) {
                // 一旦fix
            } else {
                valuechange = true;
                const pos = [...crontime[単位].targets, nextvalue].sort((a, b) => a - b).indexOf(nextvalue);
                if (pos == crontime[単位].targets.length) {
                    // 時間内に処理対象が無い為繰り上げて最初の時間を適用
                    dateProperties.setter((max() + 1 - min) + crontime[単位].targets[0]);
                } else {
                    dateProperties.setter(crontime[単位].targets[pos]);
                }
            }
        } else {
            // ※ この時点ではmax超かの場合がある
            if (lastCronExecute[単位] == dateProperties.getter()) {
                // 一旦fix
            } else {
                const nextvalue = lastCronExecute[単位] + (crontime[単位].step ?? 1);
                if (crontime[単位].targets.indexOf(nextvalue) != -1) {
                    // ※ targetsには通常max超かの値は含まれない
                    dateProperties.setter(nextvalue);
                } else {
                    valuechange = true;
                    const pos = [...crontime[単位].targets, nextvalue].sort((a, b) => a - b).indexOf(nextvalue);
                    if (pos == crontime[単位].targets.length && nextvalue > max() && crontime[単位].targets.indexOf(nextvalue % (max() + 1)) != -1) {
                        // ※ targetsには通常max超かの値が含まれる
                        dateProperties.setter(nextvalue);
                    } else {
                        // 実行ステップに実行可能時間が無い為、それ以降の時間を設定する
                        if (pos != crontime[単位].targets.length) {
                            dateProperties.setter(crontime[単位].targets[pos]);
                        } else {
                            dateProperties.setter((max() + 1) + crontime[単位].targets[0]);
                        }
                    }
                }
            }
        }

        return { valuechange, nextDate: new Date(nextDate) };
    };
    const d = [
        calc('分', 0, () => 59),
        calc('時', 0, () => 23),
    ];
    if (d[1].valuechange && d[0].nextDate.getHours() != d[1].nextDate.getHours()) {
        nextDate.setMinutes(crontime.分.targets[0]);
    }
    d.push(calc('日', 1, () => {
        const d = new Date(nextDate);
        // 翌月の1～4日くらい
        d.setDate(32);
        // 当月末
        d.setDate(0);

        return d.getDate();
    }));
    if (d[2].valuechange && d[1].nextDate.getDate() != d[2].nextDate.getDate()) {
        nextDate.setHours(crontime.時.targets[0]);
        nextDate.setMinutes(crontime.分.targets[0]);
    }
    d.push(calc('月', 0, () => 11));
    if (d[3].valuechange && d[2].nextDate.getMonth() != d[3].nextDate.getMonth()) {
        nextDate.setDate(crontime.日.targets[0]);
        nextDate.setHours(crontime.時.targets[0]);
        nextDate.setMinutes(crontime.分.targets[0]);
    }

    return nextDate;
}

export const testOnlyExports = {
    isCronTaskA,
    isCronTaskB,
    currentDate,
    start__time,
    start__exec,
    scheduleSort,
    nextTime,
    vars: {
        eventHandlers,
        schedule,
    },
};