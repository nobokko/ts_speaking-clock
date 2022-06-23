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

describe('union', () => {
    it('string|number', () => {
        const func = Guard.union(Guard.isString, Guard.isNumber);
        expect(func('0')).toBe(true);
        expect(func(0)).toBe(true);
    });
});

describe('optional', () => {
    it('string', () => {
        const func = Guard.optional(Guard.isString);
        expect(func('0')).toBe(true);
        expect(func(undefined)).toBe(true);
    });
});

describe('isMyType', () => {
    it('{}', () => {
        const result = Guard.isCustomType<{}>({})({});
        expect(result).toBe(true);
    });

    it('{a: number}', () => {
        const result = Guard.isCustomType<{ a: number }>({ a: Guard.isNumber })({ a: 0 });
        expect(result).toBe(true);
    });

    it('{a?: number}', () => {
        const result = Guard.isCustomType<{ a?: number }>({ a: Guard.optional(Guard.isNumber) })({});
        expect(result).toBe(true);
    });

    it('{a: {b:number, c:string}}', () => {
        const result = Guard.isCustomType<{ a: { b: number, c: string } }>({
            a: Guard.isCustomType<{ b: number, c: string }>({
                b: Guard.isNumber,
                c: Guard.isString,
            }),
        })({ a: { b: 1, c: 'true' } });
        expect(result).toBe(true);
    });

    it('not match {a: {b:number, c:string}}', () => {
        const result = Guard.isCustomType<{ a: { b: number, c: string } }>({
            a: Guard.isCustomType<{ b: number, c: string }>({
                b: Guard.isNumber,
                c: Guard.isString,
            }),
        })({});
        expect(result).toBe(false);
    });

    it('not match {a: {b:number, c:string}}', () => {
        const result = Guard.isCustomType<{ a: { b: number, c: string } }>({
            a: Guard.isCustomType<{ b: number, c: string }>({
                b: Guard.isNumber,
                c: Guard.isString,
            }),
        })({a: {}});
        expect(result).toBe(false);
    });
});
