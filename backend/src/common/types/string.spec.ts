import { pipe } from 'fp-ts/function';
import { isLeft, isRight, toUnion } from 'fp-ts/Either';
import { isString, checkString } from './string';

describe('number', () => {
  const strings = ['', '123', 'abc', String(123)];
  const nonStringValues = [
    true,
    false,
    BigInt(Number.MAX_VALUE),
    Symbol(1),
    {},
    [],
    null,
    undefined,
  ];

  describe('isString', () => {
    const test = (tobe: boolean) => (v: unknown) => {
      expect(isString(v)).toBe(tobe);
    };

    it('should return true if v is string.', () => {
      strings.forEach(test(true));
    });

    it('should return false if v is non-string value', () => {
      nonStringValues.forEach(test(false));
    });
  });

  describe('checkString', () => {
    const test = (shouldRight: boolean) => (v: unknown) => {
      const e = checkString(v);
      expect(pipe(e, shouldRight ? isRight : isLeft)).toBe(true);
      expect(toUnion(e) === v).toBe(true);
    };

    it('should return right if v is string.', () => {
      strings.forEach(test(true));
    });

    it('should return left if v is non-string value.', () => {
      nonStringValues.forEach(test(false));
    });
  });
});
