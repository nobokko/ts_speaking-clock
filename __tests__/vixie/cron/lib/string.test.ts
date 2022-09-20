import * as lib_string from "../../../../src/vixie/cron/lib/string";

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

describe('memcpy', () => {
    it('memcpy', async () => {
        let buf1 = {
            n : 1,
            memcpy : function (buf) {this.n = buf.n;},
        };
        let buf2 = {
            n : 2,
        };
        lib_string.memcpy(buf1, buf2, 0);
        expect(buf1.n).toBe(2);
        // expect(CronExecuter.testOnlyExports.vars.nextDateSortedScheduleIds.length).toBe(1);
        // expect(CronExecuter.testOnlyExports.vars.scheduleList[result].nextDate.getHours()).toBe(22);
    });
});
