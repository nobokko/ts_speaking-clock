import * as cron from "../../../src/vixie/cron/crontab.c";
import { EDITOR } from '../../../src/vixie/cron/pathnames.h';

// beforeAll(() => {
//     jest.spyOn(globalThis.Date, "now").mockImplementation(() => (new Date(2022, 6 - 1, 19, 22, 48, 1, 1)).getTime());

//     jest.spyOn(globalThis, "setTimeout").mockImplementation((callback: (args: void) => void, ms?: number): any => {
//         console.debug('call setTimeout. skiped.');

//         return 0;
//     });
// });

// beforeEach(() => {
//     CronExecuter.testOnlyExports.vars.nextDateSortedScheduleIds.length = 0;

//     for (const eventHandler of Object.values(CronExecuter.testOnlyExports.vars.eventHandlers)) {
//         eventHandler.length = 0;
//     }
// });

describe('main', () => {
    it('-l', async () => {
        try {
            cron.main(4, ['crontab', '-u', 'testuser_l', '-l']);
        } catch (err) {}
        // expect(result in CronExecuter.testOnlyExports.vars.scheduleList).toBe(true);
        // expect(CronExecuter.testOnlyExports.vars.nextDateSortedScheduleIds.length).toBe(1);
        // expect(CronExecuter.testOnlyExports.vars.scheduleList[result].nextDate.getHours()).toBe(22);
    });
    it('-r', async () => {
        try {
            cron.main(4, ['crontab', '-u', 'testuser_r', '-r']);
        } catch (err) {}
        // expect(result in CronExecuter.testOnlyExports.vars.scheduleList).toBe(true);
        // expect(CronExecuter.testOnlyExports.vars.nextDateSortedScheduleIds.length).toBe(1);
        // expect(CronExecuter.testOnlyExports.vars.scheduleList[result].nextDate.getHours()).toBe(22);
    });
    it('-e', async () => {
        try {
            process.env.EDITOR = 'cat';
            // cron.main(6, ['crontab', '-u', 'user', '-l', '-r', '-e']);
            cron.main(4, ['crontab', '-u', 'testuser_e', '-e']);
        } catch (err) {}
        // expect(result in CronExecuter.testOnlyExports.vars.scheduleList).toBe(true);
        // expect(CronExecuter.testOnlyExports.vars.nextDateSortedScheduleIds.length).toBe(1);
        // expect(CronExecuter.testOnlyExports.vars.scheduleList[result].nextDate.getHours()).toBe(22);
    });
    it('arg', async () => {
        try {
            cron.main(4, ['crontab', '-u', 'testuser_file', 'testfilename']);
        } catch (err) {}
        // expect(result in CronExecuter.testOnlyExports.vars.scheduleList).toBe(true);
        // expect(CronExecuter.testOnlyExports.vars.nextDateSortedScheduleIds.length).toBe(1);
        // expect(CronExecuter.testOnlyExports.vars.scheduleList[result].nextDate.getHours()).toBe(22);
    });
    it('arg none', async () => {
        try {
            cron.main(1, ['crontab']);
        } catch (err) {}
        // expect(result in CronExecuter.testOnlyExports.vars.scheduleList).toBe(true);
        // expect(CronExecuter.testOnlyExports.vars.nextDateSortedScheduleIds.length).toBe(1);
        // expect(CronExecuter.testOnlyExports.vars.scheduleList[result].nextDate.getHours()).toBe(22);
    });
});
