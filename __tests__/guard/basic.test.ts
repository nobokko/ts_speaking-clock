import * as Guard from "../../src/guard/basic";

describe('isString', () => {
    it('string', () => {
        const result = Guard.isString('0');
        expect(result).toBe(true);
    });
});

describe('isNumber', () => {
    it('number', () => {
        const result = Guard.isNumber(0);
        expect(result).toBe(true);
    });
});

describe('isBoolean', () => {
    it('boolean', () => {
        const result = Guard.isBoolean(false);
        expect(result).toBe(true);
    });
});

describe('isBigint', () => {
    it('bigint', () => {
        const result = Guard.isBigint(BigInt(0));
        expect(result).toBe(true);
    });
});

describe('isSymbol', () => {
    it('symbol', () => {
        const result = Guard.isSymbol(Symbol('0'));
        expect(result).toBe(true);
    });
});

describe('isFunction', () => {
    it('function', () => {
        const result = Guard.isFunction(() => { });
        expect(result).toBe(true);
    });
});

describe('isUndefined', () => {
    it('undefined', () => {
        const result = Guard.isUndefined(undefined);
        expect(result).toBe(true);
    });
});

describe('isObject', () => {
    it('object', () => {
        const result = Guard.isObject(new Date());
        expect(result).toBe(true);
    });
});

describe('isNull', () => {
    it('null', () => {
        const result = Guard.isNull(null);
        expect(result).toBe(true);
    });
});

describe('array', () => {
    it('array []', () => {
        const func = Guard.arraylize(Guard.isNumber);
        expect(func([])).toBe(true);
    });

    it('array [1]', () => {
        const func = Guard.arraylize(Guard.isNumber);
        expect(func([1])).toBe(true);
    });

    it('array [1, Symbol(2)]', () => {
        const target = [1, Symbol(2)];
        const func = Guard.arraylize(Guard.union(Guard.isNumber, Guard.isSymbol));
        expect(func(target)).toBe(true);
    });

    it('array [""] - 指定外の型', () => {
        const func = Guard.arraylize(Guard.isNumber);
        expect(func([''])).toBe(false);
    });

    it('array 1 - 配列ではない', () => {
        const func = Guard.arraylize(Guard.isNumber);
        expect(func(1)).toBe(false);
    });
});

describe('union', () => {
    it('string|number', () => {
        const func = Guard.union(Guard.isString, Guard.isNumber);
        expect(func('0')).toBe(true);
        expect(func(0)).toBe(true);
        expect(func(Symbol(0))).toBe(false);
    });
});

describe('optional', () => {
    it('string', () => {
        const func = Guard.optional(Guard.isString);
        expect(func('0')).toBe(true);
        expect(func(undefined)).toBe(true);
        expect(func(null)).toBe(true);
    });

    it('string (比較用)', () => {
        const func = Guard.isString;
        expect(func('0')).toBe(true);
        expect(func(undefined)).toBe(false);
        expect(func(null)).toBe(false);
    });
});

describe('customizeType', () => {
    it('{}', () => {
        const result = Guard.customizeType<{}>({})({});
        expect(result).toBe(true);
    });

    it('{a: number}', () => {
        const result = Guard.customizeType<{ a: number }>({ a: Guard.isNumber })({ a: 0 });
        expect(result).toBe(true);
    });

    it('{a?: number}', () => {
        const result = Guard.customizeType<{ a?: number }>({ a: Guard.optional(Guard.isNumber) })({});
        expect(result).toBe(true);
    });

    it('{a?: number} (比較用)', () => {
        const result = Guard.customizeType<{ a?: number }>({ a: Guard.isNumber })({});
        expect(result).toBe(false);
    });

    it('{a: {b:number, c:string}}', () => {
        const result = Guard.customizeType<{ a: { b: number, c: string } }>({
            a: Guard.customizeType<{ b: number, c: string }>({
                b: Guard.isNumber,
                c: Guard.isString,
            }),
        })({ a: { b: 1, c: 'true' } });
        expect(result).toBe(true);
    });

    it('not match {a: {b:number, c:string}}', () => {
        const result = Guard.customizeType<{ a: { b: number, c: string } }>({
            a: Guard.customizeType<{ b: number, c: string }>({
                b: Guard.isNumber,
                c: Guard.isString,
            }),
        })({});
        expect(result).toBe(false);
    });

    it('not match {a: {b:number, c:string}}', () => {
        const result = Guard.customizeType<{ a: { b: number, c: string } }>({
            a: Guard.customizeType<{ b: number, c: string }>({
                b: Guard.isNumber,
                c: Guard.isString,
            }),
        })({ a: {} });
        expect(result).toBe(false);
    });
});
