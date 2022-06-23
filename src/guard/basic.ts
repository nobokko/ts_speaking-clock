export function isString(value: any): value is string {
    return typeof (value) === 'string';
}

export function isNumber(value: any): value is number {
    return typeof (value) === 'number';
}

export function isBoolean(value: any): value is boolean {
    return typeof (value) === 'boolean';
}

export function isBigint(value: any): value is bigint {
    return typeof (value) === 'bigint';
}

export function isSymbol(value: any): value is symbol {
    return typeof (value) === 'symbol';
}

export function isFunction(value: any): value is Function {
    return typeof (value) === 'function';
}

export function isUndefined(value: any): value is undefined {
    return typeof (value) === 'undefined';
}

export function isObject(value: any): value is object {
    return value !== null && typeof (value) === 'object';
}

export function isNull(value: any): value is null {
    return value === null;
}

export function union(...functions: Function[]): (value: any) => boolean {
    return ((value: any) => functions.some(func => func(value)));
}

export function optional(func: Function): (value: any) => boolean {
    return union(isUndefined, isNull, func);
}

type Blueprint<T> = { [key in (keyof T)]: Blueprint<any> | ((value: any) => boolean) };

export function isCustomType<T>(blueprint: Blueprint<T>): (((value: any) => value is T)) {
    const f = (value: any, blueprint: Blueprint<any> | ((value: any) => boolean)): boolean => {
        if (isFunction(blueprint)) {
            if (!blueprint(value)) {
                return false;
            }
        } else {
            for (const key in blueprint) {
                if (!f(value?.[key] ?? undefined, blueprint[key])) {
                    return false;
                }
            }
        }

        return true;
    };

    return (value: any): value is T => {
        return f(value, blueprint);
    };
}
