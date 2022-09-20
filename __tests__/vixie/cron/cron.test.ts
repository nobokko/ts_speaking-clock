import * as cron from "../../../src/vixie/cron/cron";

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
    it('main', async () => {
        // cron.main(0, []);
    });
});
