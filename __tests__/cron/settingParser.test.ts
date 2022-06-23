import * as Parser from "../../src/cron/settingParser";

describe('isCronSettingLiteralInfo', () => {
    it('*', () => {
        const result = Parser.testOnlyExports.isCronSettingLiteralInfo({ original: '*', targets: [0, 1, 2, 3, 4, 5, 6], anytime: true });
        expect(result).toBe(true);
    });

    it('*/2', () => {
        const result = Parser.testOnlyExports.isCronSettingLiteralInfo({ original: '*', step: 2, targets: [0, 1, 2, 3, 4, 5, 6], anytime: true });
        expect(result).toBe(true);
    });
});

describe('isCronTime', () => {
    it('* * * * *', () => {
        const result = Parser.isCronTime(Parser.parse('* * * * *'));
        // expect(result).toBe(true);
    });
});

describe('parse', () => {
    it('* * * * *', () => {
        const result = Parser.parse('* * * * *');

        expect(result.分.anytime).toBe(true);
        expect(result.分.step).toBe(null);
        expect(result.分.original).toBe('*');
        expect(result.分.targets.length).toBe(60);
        expect(result.分.targets.join(',')).toBe('0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59');

        expect(result.時.anytime).toBe(true);
        expect(result.時.step).toBe(null);
        expect(result.時.original).toBe('*');
        expect(result.時.targets.length).toBe(24);
        expect(result.時.targets.join(',')).toBe('0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23');

        expect(result.日.anytime).toBe(true);
        expect(result.日.step).toBe(null);
        expect(result.日.original).toBe('*');
        expect(result.日.targets.length).toBe(31);
        expect(result.日.targets.join(',')).toBe('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31');

        expect(result.月.anytime).toBe(true);
        expect(result.月.step).toBe(null);
        expect(result.月.original).toBe('*');
        expect(result.月.targets.length).toBe(12);
        expect(result.月.targets.join(',')).toBe('1,2,3,4,5,6,7,8,9,10,11,12');

        expect(result.曜日.anytime).toBe(true);
        expect(result.曜日.step).toBe(null);
        expect(result.曜日.original).toBe('*');
        expect(result.曜日.targets.length).toBe(7);
        expect(result.曜日.targets.join(',')).toBe('0,1,2,3,4,5,6');
    });

    it('0-59 0-23 1-31 1-12 0-7', () => {
        const result = Parser.parse('0-59 0-23 1-31 1-12 0-7');

        expect(result.分.anytime).toBe(false);
        expect(result.分.step).toBe(null);
        expect(result.分.original).toBe('0-59');
        expect(result.分.targets.length).toBe(60);
        expect(result.分.targets.join(',')).toBe('0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59');

        expect(result.時.anytime).toBe(false);
        expect(result.時.step).toBe(null);
        expect(result.時.original).toBe('0-23');
        expect(result.時.targets.length).toBe(24);
        expect(result.時.targets.join(',')).toBe('0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23');

        expect(result.日.anytime).toBe(false);
        expect(result.日.step).toBe(null);
        expect(result.日.original).toBe('1-31');
        expect(result.日.targets.length).toBe(31);
        expect(result.日.targets.join(',')).toBe('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31');

        expect(result.月.anytime).toBe(false);
        expect(result.月.step).toBe(null);
        expect(result.月.original).toBe('1-12');
        expect(result.月.targets.length).toBe(12);
        expect(result.月.targets.join(',')).toBe('1,2,3,4,5,6,7,8,9,10,11,12');

        expect(result.曜日.anytime).toBe(false);
        expect(result.曜日.step).toBe(null);
        expect(result.曜日.original).toBe('0-7');
        expect(result.曜日.targets.length).toBe(7);
        expect(result.曜日.targets.join(',')).toBe('0,1,2,3,4,5,6');
    });

    it('*/2 */3 */4 */5 */6', () => {
        const result = Parser.parse('*/2 */3 */4 */5 */6');

        expect(result.分.anytime).toBe(true);
        expect(result.分.step).toBe(2);
        expect(result.分.original).toBe('*/2');
        expect(result.分.targets.length).toBe(60);
        expect(result.分.targets.join(',')).toBe('0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59');

        expect(result.時.anytime).toBe(true);
        expect(result.時.step).toBe(3);
        expect(result.時.original).toBe('*/3');
        expect(result.時.targets.length).toBe(24);
        expect(result.時.targets.join(',')).toBe('0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23');

        expect(result.日.anytime).toBe(true);
        expect(result.日.step).toBe(4);
        expect(result.日.original).toBe('*/4');
        expect(result.日.targets.length).toBe(31);
        expect(result.日.targets.join(',')).toBe('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31');

        expect(result.月.anytime).toBe(true);
        expect(result.月.step).toBe(5);
        expect(result.月.original).toBe('*/5');
        expect(result.月.targets.length).toBe(12);
        expect(result.月.targets.join(',')).toBe('1,2,3,4,5,6,7,8,9,10,11,12');

        expect(result.曜日.anytime).toBe(true);
        expect(result.曜日.step).toBe(6);
        expect(result.曜日.original).toBe('*/6');
        expect(result.曜日.targets.length).toBe(7);
        expect(result.曜日.targets.join(',')).toBe('0,1,2,3,4,5,6');
    });

    it('55-4,15-24,35-44 23-1,11-13 28-1,15-16 12-1,6-7 6-1,3-4', () => {
        const result = Parser.parse('55-4,15-24,35-44 23-1,11-13 28-1,15-16 12-1,6-7 6-1,3-4');

        expect(result.分.anytime).toBe(false);
        expect(result.分.step).toBe(null);
        expect(result.分.original).toBe('55-4,15-24,35-44');
        expect(result.分.targets.length).toBe(30);
        expect(result.分.targets.join(',')).toBe('0,1,2,3,4,15,16,17,18,19,20,21,22,23,24,35,36,37,38,39,40,41,42,43,44,55,56,57,58,59');

        expect(result.時.anytime).toBe(false);
        expect(result.時.step).toBe(null);
        expect(result.時.original).toBe('23-1,11-13');
        expect(result.時.targets.length).toBe(6);
        expect(result.時.targets.join(',')).toBe('0,1,11,12,13,23');

        expect(result.日.anytime).toBe(false);
        expect(result.日.step).toBe(null);
        expect(result.日.original).toBe('28-1,15-16');
        expect(result.日.targets.length).toBe(7);
        expect(result.日.targets.join(',')).toBe('1,15,16,28,29,30,31');

        expect(result.月.anytime).toBe(false);
        expect(result.月.step).toBe(null);
        expect(result.月.original).toBe('12-1,6-7');
        expect(result.月.targets.length).toBe(4);
        expect(result.月.targets.join(',')).toBe('1,6,7,12');

        expect(result.曜日.anytime).toBe(false);
        expect(result.曜日.step).toBe(null);
        expect(result.曜日.original).toBe('6-1,3-4');
        expect(result.曜日.targets.length).toBe(5);
        expect(result.曜日.targets.join(',')).toBe('0,1,3,4,6');
    });

    it('60,100 24 0,32 13 8', () => {
        const result = Parser.parse('60,100 24 0,32 13 8');

        expect(result.分.anytime).toBe(false);
        expect(result.分.step).toBe(null);
        expect(result.分.original).toBe('60,100');
        expect(result.分.targets.length).toBe(0);

        expect(result.時.anytime).toBe(false);
        expect(result.時.step).toBe(null);
        expect(result.時.original).toBe('24');
        expect(result.時.targets.length).toBe(0);

        expect(result.日.anytime).toBe(false);
        expect(result.日.step).toBe(null);
        expect(result.日.original).toBe('0,32');
        expect(result.日.targets.length).toBe(0);

        expect(result.月.anytime).toBe(false);
        expect(result.月.step).toBe(null);
        expect(result.月.original).toBe('13');
        expect(result.月.targets.length).toBe(0);

        expect(result.曜日.anytime).toBe(false);
        expect(result.曜日.step).toBe(null);
        expect(result.曜日.original).toBe('8');
        expect(result.曜日.targets.length).toBe(0);
    });
});
