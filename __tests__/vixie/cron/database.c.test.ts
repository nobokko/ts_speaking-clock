import * as database_c from "../../../src/vixie/cron/database.c";
import { struct__stat } from "../../../src/vixie/cron/lib/sys/stat";
import { cron_db, DOM_STAR, DOW_STAR, entry, HR_STAR, MIN_STAR, user } from '../../../src/vixie/cron/structs.h';

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

describe('load_database', () => {
    it('load_database', async () => {
        let cron_database = new cron_db;
        database_c.load_database(cron_database);
        expect(cron_database.head).not.toBeNull();
        {
            const expectCrontabP1 = (crontab: entry) => {
                expect(crontab.cmd).toBe('/bin/sh -c "ls -al"');
                expect(crontab.envp).toStrictEqual(["test1=1 test2", /* "SHELL=/bin/sh", */"PATH=/usr/bin:/bin", "LOGNAME=", null]);
                // expect(crontab.pwd).toStrictEqual(pw);
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
                // expect(crontab.pwd).toStrictEqual(pw);
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
                // expect(crontab.pwd).toStrictEqual(pw);
                expect(crontab.flags).toBe(HR_STAR);
                expect(crontab.minute).toStrictEqual([0b00000001, 0b0000000000, 0b0000000000, 0b0000000000, 0b0000000000, 0b0000000000, 0b0000000000, 0b00000000,]);
                expect(crontab.hour).toStrictEqual([0b11111111, 0b11111111, 0b11111111, 0b00000001]);
                expect(crontab.dom).toStrictEqual([0b11111111, 0b11111111, 0b11111111, 0b11111111,]);
                expect(crontab.month).toStrictEqual([0b11111111, 0b00011111,]);
                expect(crontab.dow).toStrictEqual([0b11111111, 0b00000001,]);
                expect(crontab.next).toBeNull();
            };
            const user = cron_database.head as user;
            expect(user.name).toBe('*system*');
            // expect(user.crontab).not.toBeNull();
            // {
            //     const crontab = user.crontab as entry;
            //     expect(crontab.cmd).toBe('cmd');
            // }
            expect(user.prev).toBeNull();
            expect(user.next).not.toBeNull();
            {
                const user_next = user.next as user;
                expect(user_next.name).toBe('');
                expect(user_next.crontab).not.toBeNull();
                expectCrontabP1(user_next.crontab as entry);
                expect(user_next.prev).toBe(user);
                expect(user.next).not.toBeNull();
                {
                    const user_next_next = user_next.next as user;
                    expect(user_next_next.name).toBe('');
                    expectCrontabP1(user_next_next.crontab as entry);
                    expect(user_next_next.prev).toBe(user_next);
                    expect(user_next_next.next).not.toBeNull();
                    {
                        const user_next_next_next = user_next_next.next as user;
                        expect(user_next_next_next.name).toBe('');
                        expectCrontabP1(user_next_next_next.crontab as entry);
                        expect(user_next_next_next.prev).toBe(user_next_next);
                        expect(user_next_next_next.next).toBeNull();
                        expect(cron_database.tail).toBe(user_next_next_next);
                    }
                }
            }
        }
        // expect(CronExecuter.testOnlyExports.vars.nextDateSortedScheduleIds.length).toBe(1);
        // expect(CronExecuter.testOnlyExports.vars.scheduleList[result].nextDate.getHours()).toBe(22);
    });
});

describe('process_crontab', () => {
    it('process_crontab', async () => {
        let new_db = new cron_db;
        let old_db = new cron_db;
        database_c.process_crontab('root', '/etc/crontab/root', 'tabname', new struct__stat, new_db, old_db);
        expect(new_db.head).not.toBeNull();
    });
});
