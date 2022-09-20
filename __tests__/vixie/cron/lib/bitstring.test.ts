import * as lib_bitstring from "../../../../src/vixie/cron/lib/bitstring";

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

describe('bit_nset', () => {
    it('bit_nset', async () => {
        let name = [1, 2, 3, 4, 5];
        lib_bitstring.bit_nset(name, 2, 4);
        // expect(result in CronExecuter.testOnlyExports.vars.scheduleList).toBe(true);
        // expect(CronExecuter.testOnlyExports.vars.nextDateSortedScheduleIds.length).toBe(1);
        // expect(CronExecuter.testOnlyExports.vars.scheduleList[result].nextDate.getHours()).toBe(22);
    });
});
