import * as CronExecuter from "../../src/cron/executer";
import * as CronSettingParser from "../../src/cron/settingParser";

beforeAll(() => {
    jest.spyOn(globalThis.Date, "now").mockImplementation(() => (new Date(2022, 6 - 1, 19, 22, 48, 1, 1)).getTime());

    jest.spyOn(globalThis, "setTimeout").mockImplementation((callback: (args: void) => void, ms?: number):any => {
        console.debug('call setTimeout. skiped.');

        return 0;
    });
});

beforeEach(() => {
    while (CronExecuter.testOnlyExports.vars.schedule.length > 0) {
        CronExecuter.testOnlyExports.vars.schedule.pop();
    }
});

describe('append', () => {
    it('* * * * * string', () => {
        const result = CronExecuter.append('* * * * *', () => {});
        expect(CronExecuter.testOnlyExports.vars.schedule.length).toBe(1);
        expect(CronExecuter.testOnlyExports.vars.schedule[0].nextDate.getHours()).toBe(22);
    });

    it('* * * * * CronTime', () => {
        const result = CronExecuter.append(CronSettingParser.parse('* * * * *'), () => {});
        expect(CronExecuter.testOnlyExports.vars.schedule.length).toBe(1);
        expect(CronExecuter.testOnlyExports.vars.schedule[0].nextDate.getHours()).toBe(22);
    });
});

describe('isCronTaskA', () => {
    it('isCronTaskA', () => {
        const task = () => {};
        const result = CronExecuter.testOnlyExports.isCronTaskA(task);
        expect(result).toBe(true);
    });
});

describe('isCronTaskB', () => {
    it('isCronTaskB', () => {
        const task = (param1:CronSettingParser.CronTime) => {};
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
    it('scheduleSort', () => {
        CronExecuter.append('59 1 1 1 *', () => {}, 'p1', 'last');
        CronExecuter.append('0 1 1 1 *', () => {}, 'p2', 'first');
        CronExecuter.append('30 1 1 1 *', () => {}, 'p3', 'middle');
        CronExecuter.testOnlyExports.scheduleSort();
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
        CronExecuter.append('* * * * *', () => {});
        CronExecuter.append('* * * * *', (schedule) => {});
        expect(CronExecuter.testOnlyExports.vars.schedule[0].nextDate.getMinutes()).toBe(49);
        expect(CronExecuter.testOnlyExports.vars.schedule[1].nextDate.getMinutes()).toBe(49);
        CronExecuter.testOnlyExports.start__exec();
        CronExecuter.testOnlyExports.vars.schedule[0].nextDate.setMinutes(48);
        CronExecuter.testOnlyExports.vars.schedule[1].nextDate.setMinutes(48);
        CronExecuter.testOnlyExports.start__exec();
    });
});

describe('start', () => {
    it('start', () => {
        expect(CronExecuter.status().started).toBe(false);
        CronExecuter.start();
        expect(CronExecuter.status().started).toBe(true);
        CronExecuter.append('* * * 8 *', () => {});
        CronExecuter.append('* * * 7 *', () => {}, 'this');
        CronExecuter.append('* * * 9 *', () => {});
        expect(CronExecuter.testOnlyExports.vars.schedule[0].label).toBe('this');
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
            分:lastExecuteDate.getMinutes(),
            時:lastExecuteDate.getHours(),
            日:lastExecuteDate.getDate(),
            月:lastExecuteDate.getMonth(),
            曜日:lastExecuteDate.getDay(),
        });
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 21:12:00 GMT');
    });

    it('30分後', () => {
        const lastExecuteDate = new Date(2022, 6 - 1, 19, 21, 11, 0, 0);
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('*/30 * * * *'), targetDate, {
            分:lastExecuteDate.getMinutes(),
            時:lastExecuteDate.getHours(),
            日:lastExecuteDate.getDate(),
            月:lastExecuteDate.getMonth(),
            曜日:lastExecuteDate.getDay(),
        });
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 21:41:00 GMT');
    });

    it('30分後が動作設定時間ではない', () => {
        const lastExecuteDate = new Date(2022, 6 - 1, 19, 21, 11, 0, 0);
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('0-29/30 * * * *'), targetDate, {
            分:lastExecuteDate.getMinutes(),
            時:lastExecuteDate.getHours(),
            日:lastExecuteDate.getDate(),
            月:lastExecuteDate.getMonth(),
            曜日:lastExecuteDate.getDay(),
        });
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 22:00:00 GMT');
    });

    it('30分後が時刻跨ぎ', () => {
        const lastExecuteDate = new Date(2022, 6 - 1, 19, 21, 41, 0, 0);
        const targetDate = new Date(2022, 6 - 1, 19, 21, 41, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('*/30 * * * *'), targetDate, {
            分:lastExecuteDate.getMinutes(),
            時:lastExecuteDate.getHours(),
            日:lastExecuteDate.getDate(),
            月:lastExecuteDate.getMonth(),
            曜日:lastExecuteDate.getDay(),
        });
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 22:11:00 GMT');
    });

    it('基本的に3分毎だけど3分後は動作設定時刻ではない', () => {
        const lastExecuteDate = new Date(2022, 6 - 1, 19, 21, 11, 0, 0);
        const targetDate = new Date(2022, 6 - 1, 19, 21, 11, 1, 1);
        const result = CronExecuter.testOnlyExports.nextTime(CronSettingParser.parse('41-13/3 * * * *'), targetDate, {
            分:lastExecuteDate.getMinutes(),
            時:lastExecuteDate.getHours(),
            日:lastExecuteDate.getDate(),
            月:lastExecuteDate.getMonth(),
            曜日:lastExecuteDate.getDay(),
        });
        expect(result.toUTCString()).toBe('Sun, 19 Jun 2022 21:41:00 GMT');
    });
});
