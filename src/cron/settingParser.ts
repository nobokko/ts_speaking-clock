import * as Guard from "../guard/basic"

type CronSettingLiteralInfo = {
    original: string,
    targets: number[],
    step?: number,
    anytime: boolean,
};

// cronは左から「分」「時」「日」「月」「曜日」
export type CronTime = {
    original: string,
    分: CronSettingLiteralInfo,
    時: CronSettingLiteralInfo,
    日: CronSettingLiteralInfo,
    月: CronSettingLiteralInfo,
    曜日: CronSettingLiteralInfo,
};

const isCronSettingLiteralInfo = Guard.isCustomType<CronSettingLiteralInfo>({
    original: Guard.isString,
    targets: Guard.isObject,
    step: Guard.optional(Guard.isNumber),
    anytime: Guard.isBoolean,
});

export const isCronTime = Guard.isCustomType<CronTime>({
    original:Guard.isString,
    分: isCronSettingLiteralInfo,
    時: isCronSettingLiteralInfo,
    日: isCronSettingLiteralInfo,
    月: isCronSettingLiteralInfo,
    曜日: isCronSettingLiteralInfo,
});

const CronMinNumber = {
    分: 0,
    時: 0,
    日: 1,
    月: 1,
    曜日: 0,
} as const;

const CronMaxNumber = {
    分: 59,
    時: 23,
    日: 31,
    月: 12,
    曜日: 7,
} as const;

const CronIndexMinMax = [
    { min: CronMinNumber.分, max: CronMaxNumber.分 },
    { min: CronMinNumber.時, max: CronMaxNumber.時 },
    { min: CronMinNumber.日, max: CronMaxNumber.日 },
    { min: CronMinNumber.月, max: CronMaxNumber.月 },
    { min: CronMinNumber.曜日, max: CronMaxNumber.曜日 },
];

export function parse(cronFormatStr: string): CronTime {
    const schedules = cronFormatStr.split(/[ \t]+/, 5);
    const [分, 時, 日, 月, 曜日] = schedules.map((schedule, index) => {
        // 「/」で左右分割
        const [, timeLiteral, stepLiteral] = schedule.match(/([^\/]+)\/?(.+)?/);
        const step = Number(stepLiteral ?? 0);
        const anytime = timeLiteral == '*';
        // 「,」で分割
        const enableNumbers = Array.from(new Set(timeLiteral.split(',').map((leftsplitstr) => {
            // 「-」で左右分割
            const rangevalue = leftsplitstr.match(/^([0-9]{1,2})-([0-9]{1,2})$/);
            if (rangevalue) {
                const [, startstr, endstr] = rangevalue;
                const start = Number(startstr);
                const end = Number(endstr);
                const l: number[] = [];
                if (start <= end) {
                    for (let i = start; i <= end; i++) {
                        l.push(i);
                    }
                } else {
                    for (let i = start; i <= CronIndexMinMax[index].max; i++) {
                        l.push(i);
                    }
                    for (let i = CronIndexMinMax[index].min; i <= end; i++) {
                        l.push(i);
                    }
                }
                return l.join(',');
            } else {
                if (leftsplitstr == '*') {
                    const l: number[] = [];
                    for (let i = CronIndexMinMax[index].min; i <= CronIndexMinMax[index].max; i++) {
                        l.push(i);
                    }
                    return l.join(',');
                } else {
                    return leftsplitstr;
                }
            }
        }).join(',').split(',').map((leftsplitstr) => {
            switch (index) {
                case 4:
                    if (leftsplitstr == '7') {
                        leftsplitstr = '0';
                    }
                    break;
            }
            return leftsplitstr;
        }))).filter((value) => {
            if (!/^[0-9]{1,2}$/.test(value)) {
                return false;
            }
            if (CronIndexMinMax[index].min > Number(value)) {
                return false;
            }
            if (Number(value) > CronIndexMinMax[index].max) {
                return false
            }
            return true;
        }).sort((a, b) => {
            return Number(a) - Number(b);
        }).map(value => Number(value));

        return { original: schedule, targets: enableNumbers, step: (step === 0 ? null : step), anytime: anytime };
    });

    return { original: cronFormatStr, 分, 時, 日, 月, 曜日 };
}

export const testOnlyExports = {
    isCronSettingLiteralInfo,
    vars: {
    },
};