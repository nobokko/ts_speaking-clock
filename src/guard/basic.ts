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

type TypeConclude<T> = (value: any) => value is T;

export function arraylize<T>(func: TypeConclude<T>): (TypeConclude<Array<T>>) {
    return (value: any): value is Array<T> => {
        if (!(value instanceof Array)) {
            return false;
        }

        return value.every(func);
    };
}

export function union<S, T = S, U = S>(funcA: TypeConclude<S>, funcB?: TypeConclude<T>, funcC?: TypeConclude<U>): TypeConclude<S | T | U> {
    const funcs: ((value: any) => boolean)[] = [funcA];
    if (funcB) {
        funcs.push(funcB);
    }
    if (funcC) {
        funcs.push(funcC);
    }
    return (value: any): value is S | T | U => {
        return funcs.some(func => func(value));
    };
}

export function optional<T>(func: TypeConclude<T>): TypeConclude<T> {
    return union(isUndefined, isNull, func);
}

type Blueprint<T> = { [key in (keyof T)]: Blueprint<T[key]> | TypeConclude<T[key]> };

export function customizeType<T>(blueprint: Blueprint<T>): TypeConclude<T> {
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
