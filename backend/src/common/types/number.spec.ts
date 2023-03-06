import { pipe } from 'fp-ts/function';
import { isSome, isNone } from 'fp-ts/Option';
import { isLeft, isRight, toUnion } from 'fp-ts/Either';
import {
  isNumber,
  makeNumber,
  tryMakeNumber,
  makeNumberUncheck,
} from './number';

describe('number', () => {
  const numbers = [
    0,
    123,
    -123,
    0.123,
    -0.123,
    Number.MAX_VALUE,
    Number.MIN_VALUE,
  ];
  const numberStrings = [
    '123',
    '-123',
    '0.123',
    '.123',
    String(Number.MAX_VALUE),
    String(Number.MIN_VALUE),
  ];
  const nonNumberStrings = ['a', '12a', '1.2.'];
  const nonNumberValues = [
    true,
    false,
    BigInt(Number.MAX_VALUE),
    Symbol(1),
    {},
    [],
    null,
    undefined,
  ];

  describe('isNumber', () => {
    const test = (tobe: boolean) => (v: unknown) => {
      expect(isNumber(v)).toBe(tobe);
    };

    it('should return true if v is number.', () => {
      numbers.forEach(test(true));
    });

    it('should return false if v is non-number value', () => {
      nonNumberValues.forEach(test(false));
    });
  });

  describe('makeNumber', () => {
    const test = (shouldSome: boolean) => (v: unknown) => {
      expect(pipe(v, makeNumber, shouldSome ? isSome : isNone)).toBe(true);
    };

    it('should return some if v is number or number string.', () => {
      numbers.forEach(test(true));
      numberStrings.forEach(test(true));
    });

    it('should return none if v is non-number string or non-number value.', () => {
      nonNumberStrings.forEach(test(false));
      nonNumberValues.forEach(test(false));
    });
  });

  describe('tryMakeNumber', () => {
    const test = (shouldRight: boolean) => (v: unknown) => {
      const e = tryMakeNumber(v);
      expect(pipe(e, shouldRight ? isRight : isLeft)).toBe(true);
      if (!shouldRight) {
        expect(toUnion(e) === v).toBe(true);
      }
    };

    it('should return right if v is number or number string.', () => {
      numbers.forEach(test(true));
      numberStrings.forEach(test(true));
    });

    it('should return left if v is non-number string or non-number value.', () => {
      nonNumberStrings.forEach(test(false));
      nonNumberValues.forEach(test(false));
    });
  });

  describe('makeNumberUncheck', () => {
    const test = (shouldParse: boolean) => (v: unknown) => {
      const n = makeNumberUncheck(v);
      expect(isNumber(n)).toBe(shouldParse);
      if (!shouldParse) {
        expect(n === v).toBe(true);
      }
    };

    it('should parse number and number string.', () => {
      numbers.forEach(test(true));
      numberStrings.forEach(test(true));
    });

    it('should not parse non-number string or non-number value.', () => {
      nonNumberStrings.forEach(test(false));
      nonNumberValues.forEach(test(false));
    });
  });
});
