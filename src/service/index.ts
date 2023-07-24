import { randomInt } from 'crypto';

export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value)?.length) {
    return true;
  } else {
    return false;
  }
};
export const isNull = (val: string | number | null | undefined): boolean => val === null;
export const isUndefined = (obj: string | number | null | undefined): boolean => typeof obj === 'undefined';
export const isNil = (val: string): boolean => val === '';
export const isBoolean = (obj: boolean): boolean => typeof obj === 'boolean';
export const getOsEnv = (key: string): string => {
  const { env } = process;
  if (isEmpty(String(env[key]))) {
    throw new Error(`[ENV] ${key} is not set.`);
  }
  return String(env[String(key)]);
};
export const getOsEnvOptional = (key: string): string => String(process.env[key]);
export const toNumber = (val: string): number => Number.parseInt(val, 10);
export const toInteger = (val: any): number => {
  if (Number.isNaN(Number.parseInt(val, 10))) {
    return 0;
  }
  return Number.parseInt(val, 10);
};
export const toBool = (val: string | boolean): boolean => {
  if (val === true || val === 'true') {
    return true;
  }
  if (val === false || val === 'false') {
    return false;
  }
  throw new Error('Parse failed (boolean string is expected)');
};
export const isValidInt = (val: string): boolean => toInteger(val) !== 0;
export const normalizePort = (port: any): number | boolean => {
  const parsedPort = toNumber(port);
  if (Number.isNaN(parsedPort)) {
    return port;
  }
  if (parsedPort >= 0) {
    return parsedPort;
  }
  return false;
};
export const isObject = (fn: string): boolean => !isEmpty(fn) && typeof fn === 'object';
export const isFunction = (val: string): boolean => typeof val === 'function';
export const isString = (val: string): boolean => typeof val === 'string';
export const isNumber = (val: string): boolean => typeof val === 'number';
export const isConstructor = (val: string): boolean => val === 'constructor';
