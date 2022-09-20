import * as user_c from "../../../src/vixie/cron/user.c";
import { struct__passwd } from '../../../src/vixie/cron/lib/pwd';
import { user, entry, MIN_STAR, DOW_STAR, DOM_STAR, HR_STAR } from '../../../src/vixie/cron/structs.h';

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

describe('load_user', () => {
    it('load_user', async () => {
        const crontabfd = 1;
        const pw = new struct__passwd;
        const name = 'testuser';
        const u = user_c.load_user(crontabfd, pw, name);
        expect(u).not.toBeNull();
        {
            const user = u as user;
            expect(user.name).toBe(name);
            expect(user.prev).toBeNull();
            expect(user.next).toBeNull();
            expect(user.crontab).not.toBeNull();
            const expectCrontabP1 = (crontab: entry) => {
                expect(crontab.cmd).toBe('/bin/sh -c "ls -al"');
                expect(crontab.envp).toStrictEqual(["test1=1 test2", /* "SHELL=/bin/sh", */"PATH=/usr/bin:/bin", "LOGNAME=", null]);
                expect(crontab.pwd).toStrictEqual(pw);
                expect(crontab.flags).toBe(MIN_STAR | HR_STAR | DOM_STAR | DOW_STAR);
                expect(crontab.minute).toStrictEqual([0b11111111, 0b11111111, 0b11111111, 0b11111111, 0b11111111, 0b11111111, 0b11111111, 0b00001111,]);
                expect(crontab.hour).toStrictEqual([0b11111111, 0b11111111, 0b11111111, 0b00000000]);
                expect(crontab.dom).toStrictEqual([0b11111111, 0b11111111, 0b11111111, 0b01111111,]);
                expect(crontab.month).toStrictEqual([0b11111111, 0b00001111,]);
                expect(crontab.dow).toStrictEqual([0b11111111, 0b00000000,]);
                expect(crontab.next).not.toBeNull();
                expectCrontabP2(crontab.next as entry);
            };
            const expectCrontabP2 = (crontab: entry) => {
                expect(crontab.cmd).toBe('/bin/sh -c "ls -alrt"');
                expect(crontab.envp).toStrictEqual(["test1=1 test2", /* "SHELL=/bin/sh", */"PATH=/usr/bin:/bin", "LOGNAME=", null]);
                expect(crontab.pwd).toStrictEqual(pw);
                expect(crontab.flags).toBe(0);
                expect(crontab.minute).toStrictEqual([0b00000010, 0b0000000000, 0b0000000000, 0b0000000000, 0b0000000000, 0b0000000000, 0b0000000000, 0b00000000,]);
                expect(crontab.hour).toStrictEqual([0b00000100, 0b00000000, 0b00000000, 0b00000000]);
                expect(crontab.dom).toStrictEqual([0b00000100, 0b00000000, 0b00000000, 0b00000000,]);
                expect(crontab.month).toStrictEqual([0b00001000, 0b00000000,]);
                expect(crontab.dow).toStrictEqual([0b00100000, 0b00000000,]);
                expect(crontab.next).not.toBeNull();
                expectCrontabP3(crontab.next as entry);
            };
            const expectCrontabP3 = (crontab: entry) => {
                expect(crontab.cmd).toBe('/bin/sh -c "ls -a"');
                expect(crontab.envp).toStrictEqual(["test1=1 test2", /* "SHELL=/bin/sh", */"PATH=/usr/bin:/bin", "LOGNAME=", null]);
                expect(crontab.pwd).toStrictEqual(pw);
                expect(crontab.flags).toBe(HR_STAR);
                expect(crontab.minute).toStrictEqual([0b00000001, 0b0000000000, 0b0000000000, 0b0000000000, 0b0000000000, 0b0000000000, 0b0000000000, 0b00000000,]);
                expect(crontab.hour).toStrictEqual([0b11111111, 0b11111111, 0b11111111, 0b00000001]);
                expect(crontab.dom).toStrictEqual([0b11111111, 0b11111111, 0b11111111, 0b11111111,]);
                expect(crontab.month).toStrictEqual([0b11111111, 0b00011111,]);
                expect(crontab.dow).toStrictEqual([0b11111111, 0b00000001,]);
                expect(crontab.next).toBeNull();
            };
            expectCrontabP1(user.crontab as entry);
        }
    });
});
