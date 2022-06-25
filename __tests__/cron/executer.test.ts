import * as CronExecuter from "../../src/cron/executer";
import * as CronSettingParser from "../../src/cron/settingParser";

beforeAll(() => {
    jest.spyOn(globalThis.Date, "now").mockImplementation(() => (new Date(2022, 6 - 1, 19, 22, 48, 1, 1)).getTime());

    jest.spyOn(globalThis, "setTimeout").mockImplementation((callback: (args: void) => void, ms?: number): any => {
        console.debug('call setTimeout. skiped.');

        return 0;
    });
});

beforeEach(() => {
    CronExecuter.testOnlyExports.vars.schedule.length = 0;

    for (const eventHandler of Object.values(CronExecuter.testOnlyExports.vars.eventHandlers)) {
        eventHandler.length = 0;
    }
});

describe('append', () => {
    it('* * * * * string', () => {
        const result = CronExecuter.append('* * * * *', () => { });
        expect(CronExecuter.testOnlyExports.vars.schedule.length).toBe(1);
        expect(CronExecuter.testOnlyExports.vars.schedule[0].nextDate.getHours()).toBe(22);
    });

    it('* * * * * CronTime', () => {
        const result = CronExecuter.append(CronSettingParser.parse('* * * * *'), () => { });
        expect(CronExecuter.testOnlyExports.vars.schedule.length).toBe(1);
        expect(CronExecuter.testOnlyExports.vars.schedule[0].nextDate.getHours()).toBe(22);
    });
});

describe('remove', () => {
    it('remove', () => {
        const id1 = CronExecuter.append('* * * * *', () => { });
        const id2 = CronExecuter.append('* * * * *', () => { });
        const id3 = CronExecuter.append('* * * * *', () => { });
        expect(CronExecuter.testOnlyExports.vars.schedule.length).toBe(3);
        CronExecuter.remove(id2);
        expect(CronExecuter.testOnlyExports.vars.schedule.length).toBe(2);
        CronExecuter.remove(id2);
        expect(CronExecuter.testOnlyExports.vars.schedule.length).toBe(2);
        CronExecuter.remove(100);
        expect(CronExecuter.testOnlyExports.vars.schedule.length).toBe(2);
        CronExecuter.remove(id1, id3);
        expect(CronExecuter.testOnlyExports.vars.schedule.length).toBe(0);
    });
});

describe('addEventListener', () => {
    it('addEventListener start', () => {
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.start.length).toBe(0);
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.update.length).toBe(0);
        CronExecuter.addEventListener('start', () => { });
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.start.length).toBe(1);
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.update.length).toBe(0);
    });

    it('addEventListener update', () => {
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.start.length).toBe(0);
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.update.length).toBe(0);
        CronExecuter.addEventListener('update', () => { });
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.start.length).toBe(0);
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.update.length).toBe(1);
    });

    it('addEventListener beforeExecute', () => {
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.beforeExecute.length).toBe(0);
        CronExecuter.addEventListener('beforeExecute', () => { });
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.beforeExecute.length).toBe(1);
    });

    it('addEventListener afterExecute', () => {
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.afterExecute.length).toBe(0);
        CronExecuter.addEventListener('afterExecute', () => { });
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.afterExecute.length).toBe(1);
    });
});

describe('removeEventListener', () => {
    it('removeEventListener start', () => {
        const startListener = () => { };
        CronExecuter.addEventListener('start', startListener);
        CronExecuter.addEventListener('update', () => { });
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.start.length).toBe(1);
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.update.length).toBe(1);
        CronExecuter.removeEventListener('start', startListener);
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.start.length).toBe(0);
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.update.length).toBe(1);
    });

    it('removeEventListener update', () => {
        const updateListener = () => { };
        CronExecuter.addEventListener('start', () => { });
        CronExecuter.addEventListener('update', updateListener);
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.start.length).toBe(1);
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.update.length).toBe(1);
        CronExecuter.removeEventListener('update', updateListener);
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.start.length).toBe(1);
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.update.length).toBe(0);
    });

    it('removeEventListener 同じ処理だけど別定義', () => {
        CronExecuter.addEventListener('start', () => { });
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.start.length).toBe(1);
        CronExecuter.removeEventListener('start', () => { });
        expect(CronExecuter.testOnlyExports.vars.eventHandlers.start.length).toBe(1);
    });
});

describe('isCronTaskA', () => {
    it('isCronTaskA', () => {
        const task = () => { };
        const result = CronExecuter.testOnlyExports.isCronTaskA(task);
        expect(result).toBe(true);
    });
});

describe('isCronTaskB', () => {
    it('isCronTaskB', () => {
        const task = (param1: CronSettingParser.CronTime) => { };
        const result = CronExecuter.testOnlyExports.isCronTaskB(task);
        expect(result).toBe(true);
    });
});

describe('currentDate', () => {
    it('currentDate', () => {
        const result = CronExecuter.testOnlyExports.currentDate();
        expect(result.getTime()).toBe((new Date(2022, 6 - 1, 19, 22, 48, 1, 1)).getTime());
    });
});

describe('scheduleSort', () => {
    it('scheduleSort', async () => {
        CronExecuter.append('59 1 1 1 *', () => { }, 'p1', 'last');
        CronExecuter.append('0 1 1 1 *', () => { }, 'p2', 'first');
        CronExecuter.append('30 1 1 1 *', () => { }, 'p3', 'middle');
        CronExecuter.testOnlyExports.scheduleSort();
        await CronExecuter.testOnlyExports.vars.promises.scheduleSorting;
        expect(CronExecuter.testOnlyExports.vars.schedule.length).toBe(3);
        expect(CronExecuter.testOnlyExports.vars.schedule[0].label).toBe('p2');
        expect(CronExecuter.testOnlyExports.vars.schedule[1].label).toBe('p3');
        expect(CronExecuter.testOnlyExports.vars.schedule[2].label).toBe('p1');
    });
});

describe('start__exec', () => {
    it('start__exec', () => {
        CronExecuter.testOnlyExports.start__exec();
    });

    it('start__exec', () => {
        CronExecuter.append('* * * * *', () => { });
        CronExecuter.append('* * * * *', (schedule) => { });
        expect(CronExecuter.testOnlyExports.vars.schedule[0].nextDate.getMinutes()).toBe(49);
        expect(CronExecuter.testOnlyExports.vars.schedule[1].nextDate.getMinutes()).toBe(49);
        CronExecuter.testOnlyExports.start__exec();
        CronExecuter.testOnlyExports.vars.schedule[0].nextDate.setMinutes(48);
        CronExecuter.testOnlyExports.vars.schedule[1].nextDate.setMinutes(48);
        CronExecuter.testOnlyExports.start__exec();
    });
});

describe('start', () => {
    it('start', async () => {
        expect(CronExecuter.status().started).toBe(false);
        CronExecuter.start();
        expect(CronExecuter.status().started).toBe(true);
        CronExecuter.append('* * * 8 *', () => { });
        CronExecuter.append('* * * 7 *', () => { }, 'this');
        CronExecuter.append('* * * 9 *', () => { });
        await CronExecuter.testOnlyExports.vars.promises.scheduleSorting;
        expect(CronExecuter.testOnlyExports.vars.schedule[0].label).toBe('this');
    });
});

describe('status', () => {
    it('status', () => {
        expect(CronExecuter.status().schedule.length).toBe(0);
        const task = () => { };
        const id = CronExecuter.append('* * * * *', task);
        expect(CronExecuter.status().schedule.length).toBe(1);
        CronExecuter.remove(id);
        expect(CronExecuter.status().schedule.length).toBe(0);
    });
});

describe('info', () => {
    it('info exists', () => {
        expect(CronExecuter.status().schedule.length).toBe(0);
        const task = () => { };
        const id = CronExecuter.append('1,6 2,7 3,8 4,9 5', task);
        expect(CronExecuter.status().schedule.length).toBe(1);
        const info = CronExecuter.info(id);
        expect(info.id).toBe(id);
        expect(info.nextDate).toBe('2022-09-03T02:01:00.000Z');
        expect(info.cronTime.分.original).toBe('1,6');
        expect(info.cronTime.時.original).toBe('2,7');
        expect(info.cronTime.日.original).toBe('3,8');
        expect(info.cronTime.月.original).toBe('4,9');
        expect(info.cronTime.曜日.original).toBe('5');
    });

    it('info not exist', () => {
        expect(CronExecuter.status().schedule.length).toBe(0);
        const task = () => { };
        const id = CronExecuter.append('1,6 2,7 3,8 4,9 5', task);
        expect(CronExecuter.status().schedule.length).toBe(1);
        const info = CronExecuter.info(id + 100);
        expect(info).toBe(null);
    });
});

describe('nextTime 1', () => {
    it('1分後', () => {
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * * * *'), targetDate);
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 21:12:00 GMT');
    });

    it('30分後', () => {
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('32 * * * *'), targetDate);
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 21:32:00 GMT');
    });


    it('60分後', () => {
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('11 * * * *'), targetDate);
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 22:11:00 GMT');
    });

    it('翌日', () => {
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* 0 * * *'), targetDate);
        expect(result.toUTCString()).toBe('Mon, 20 Jun 2022 00:00:00 GMT');
    });

    it('翌月(6-7)', () => {
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * 1 * *'), targetDate);
        expect(result.toUTCString()).toBe('Fri, 01 Jul 2022 00:00:00 GMT');
    });

    it('翌年', () => {
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * * 1 *'), targetDate);
        expect(result.toUTCString()).toBe('Sun, 01 Jan 2023 00:00:00 GMT');
    });

    it('翌月(7-8)', () => {
        const targetDate = new Date(2022, 7 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * 1 * *'), targetDate);
        expect(result.toUTCString()).toBe('Mon, 01 Aug 2022 00:00:00 GMT');
    });

    it('翌月(8-9)', () => {
        const targetDate = new Date(2022, 8 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * 1 * *'), targetDate);
        expect(result.toUTCString()).toBe('Thu, 01 Sep 2022 00:00:00 GMT');
    });

    it('翌月(9-10)', () => {
        const targetDate = new Date(2022, 9 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * 1 * *'), targetDate);
        expect(result.toUTCString()).toBe('Sat, 01 Oct 2022 00:00:00 GMT');
    });

    it('翌月(10-11)', () => {
        const targetDate = new Date(2022, 10 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * 1 * *'), targetDate);
        expect(result.toUTCString()).toBe('Tue, 01 Nov 2022 00:00:00 GMT');
    });

    it('翌月(11-12)', () => {
        const targetDate = new Date(2022, 11 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * 1 * *'), targetDate);
        expect(result.toUTCString()).toBe('Thu, 01 Dec 2022 00:00:00 GMT');
    });

    it('翌月(1-2)', () => {
        const targetDate = new Date(2022, 1 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * 1 * *'), targetDate);
        expect(result.toUTCString()).toBe('Tue, 01 Feb 2022 00:00:00 GMT');
    });

    it('翌月(2-3)', () => {
        const targetDate = new Date(2022, 2 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * 1 * *'), targetDate);
        expect(result.toUTCString()).toBe('Tue, 01 Mar 2022 00:00:00 GMT');
    });

    it('翌月(3-4)', () => {
        const targetDate = new Date(2022, 3 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * 1 * *'), targetDate);
        expect(result.toUTCString()).toBe('Fri, 01 Apr 2022 00:00:00 GMT');
    });

    it('翌月(4-5)', () => {
        const targetDate = new Date(2022, 4 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * 1 * *'), targetDate);
        expect(result.toUTCString()).toBe('Sun, 01 May 2022 00:00:00 GMT');
    });

    it('翌月(5-6)', () => {
        const targetDate = new Date(2022, 5 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * 1 * *'), targetDate);
        expect(result.toUTCString()).toBe('Wed, 01 Jun 2022 00:00:00 GMT');
    });

    it('翌月(2-3)(うるう年)', () => {
        const targetDate = new Date(2024, 2 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * 1 * *'), targetDate);
        expect(result.toUTCString()).toBe('Fri, 01 Mar 2024 00:00:00 GMT');
    });
});

describe('nextTime 2', () => {
    it('1分後', () => {
        const lastExecuteDate = new Date(2022, 6 - 1, 19, 21, 11, 0, 0);
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('* * * * *'), targetDate, {
            分: lastExecuteDate.getMinutes(),
            時: lastExecuteDate.getHours(),
            日: lastExecuteDate.getDate(),
            月: lastExecuteDate.getMonth(),
            曜日: lastExecuteDate.getDay(),
        });
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 21:12:00 GMT');
    });

    it('30分後', () => {
        const lastExecuteDate = new Date(2022, 6 - 1, 19, 21, 11, 0, 0);
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('*/30 * * * *'), targetDate, {
            分: lastExecuteDate.getMinutes(),
            時: lastExecuteDate.getHours(),
            日: lastExecuteDate.getDate(),
            月: lastExecuteDate.getMonth(),
            曜日: lastExecuteDate.getDay(),
        });
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 21:41:00 GMT');
    });

    it('30分後が動作設定時間ではない', () => {
        const lastExecuteDate = new Date(2022, 6 - 1, 19, 21, 11, 0, 0);
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('0-29/30 * * * *'), targetDate, {
            分: lastExecuteDate.getMinutes(),
            時: lastExecuteDate.getHours(),
            日: lastExecuteDate.getDate(),
            月: lastExecuteDate.getMonth(),
            曜日: lastExecuteDate.getDay(),
        });
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 22:00:00 GMT');
    });

    it('30分後が時刻跨ぎ', () => {
        const lastExecuteDate = new Date(2022, 6 - 1, 19, 21, 41, 0, 0);
        const targetDate = new Date(2022, 6 - 1, 19, 21, 41, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('*/30 * * * *'), targetDate, {
            分: lastExecuteDate.getMinutes(),
            時: lastExecuteDate.getHours(),
            日: lastExecuteDate.getDate(),
            月: lastExecuteDate.getMonth(),
            曜日: lastExecuteDate.getDay(),
        });
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 22:11:00 GMT');
    });

    it('基本的に3分毎だけど3分後は動作設定時刻ではない', () => {
        const lastExecuteDate = new Date(2022, 6 - 1, 19, 21, 11, 0, 0);
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('41-13/3 * * * *'), targetDate, {
            分: lastExecuteDate.getMinutes(),
            時: lastExecuteDate.getHours(),
            日: lastExecuteDate.getDate(),
            月: lastExecuteDate.getMonth(),
            曜日: lastExecuteDate.getDay(),
        });
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 21:41:00 GMT');
    });
});

describe('bug?', () => {
    it('*/5 * * * * - 2022-06-26T14:04:00.000Z - 6/25 22:59(6)', () => {
        // 原因：現在時刻が繰り上がるタイミングで二重に繰り上がっていた
        {
            const targetDate = new Date(2022, 6 - 1, 25, 22, 59, 1, 1);
            const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('*/5 * * * *'), targetDate, { 分: 59, 時: 22, 日: 25, 月: 6, 曜日: 6 });
            expect(result.toUTCString()).toBe('Sat, 25 Jun 2022 23:04:00 GMT');
        }
        {
            const targetDate = new Date(2022, 6 - 1, 25, 22, 59, 1, 1);
            const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('*/65 * * * *'), targetDate, { 分: 59, 時: 22, 日: 25, 月: 6, 曜日: 6 });
            expect(result.toUTCString()).toBe('Sun, 26 Jun 2022 00:04:00 GMT');
        }
        {
            const targetDate = new Date(2022, 6 - 1, 25, 23, 59, 1, 1);
            const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('59 */5 * * *'), targetDate, { 分: 59, 時: 23, 日: 25, 月: 6, 曜日: 6 });
            expect(result.toUTCString()).toBe('Sun, 26 Jun 2022 04:59:00 GMT');
        }
        {
            const targetDate = new Date(2022, 6 - 1, 30, 23, 59, 1, 1);
            const crontime = CronSettingParser.parse('59 23 */5 * *');
            const result = CronExecuter.testOnlyExports.nextTime(crontime, targetDate, {
                分: targetDate.getMinutes(),
                時: targetDate.getHours(),
                日: targetDate.getDate(),
                月: targetDate.getMonth() + 1,
                曜日: targetDate.getDay(),
            });
            expect(result.toUTCString()).toBe('Tue, 05 Jul 2022 23:59:00 GMT');
        }
        {
            const targetDate = new Date(2022, 12 - 1, 31, 23, 59, 1, 1);
            const crontime = CronSettingParser.parse('59 23 31 */5 *');
            const result = CronExecuter.testOnlyExports.nextTime(crontime, targetDate, {
                分: targetDate.getMinutes(),
                時: targetDate.getHours(),
                日: targetDate.getDate(),
                月: targetDate.getMonth() + 1,
                曜日: targetDate.getDay(),
            });
            expect(result.toUTCString()).toBe('Wed, 31 May 2023 23:59:00 GMT');
        }
    });
});
