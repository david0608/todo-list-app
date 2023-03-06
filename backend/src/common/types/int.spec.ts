import { pipe } from 'fp-ts/function';
import { isSome, isNone } from 'fp-ts/Option';
import { isLeft, isRight, toUnion } from 'fp-ts/Either';
import {
  Int,
  isInt,
  isIntRangeIncluding,
  checkInt,
  makeInt,
  tryMakeInt,
  makeIntUncheck,
} from './int';

describe('int', () => {
  const ints = [0, 123, -123, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
  const intStrings = [
    '123',
    '0',
    '-123',
    String(Number.MAX_SAFE_INTEGER),
    String(Number.MIN_SAFE_INTEGER),
  ];
  const nonIntStrings = ['a', '12a', '1.2'];
  const nonIntValues = [
    0.01,
    -1000.001,
    1000.001,
    true,
    false,
    BigInt(Number.MAX_VALUE),
    Symbol(1),
    {},
    [],
    null,
    undefined,
  ];

  describe('isInt', () => {
    const test = (tobe: boolean) => (v: unknown) => {
      expect(isInt(v)).toBe(tobe);
    };

    it('should return true if v is int.', () => {
      ints.forEach(test(true));
    });

    it('should return false if v is not int.', () => {
      intStrings.forEach(test(false));
      nonIntStrings.forEach(test(false));
      nonIntValues.forEach(test(false));
    });
  });

  describe('isIntRangeIncluding', () => {
    const test = (tobe: boolean) => (v: unknown) => {
      expect(isIntRangeIncluding(-123 as Int, 123 as Int)(v)).toBe(tobe);
    };

    it('should return true if v is int within the range.', () => {
      [-123, 0, 123].forEach(test(true));
    });

    it('should return false if v is int out of the range or not int value.', () => {
      [-200, 200].forEach(test(false));
      intStrings.forEach(test(false));
      nonIntStrings.forEach(test(false));
      nonIntValues.forEach(test(false));
    });
  });

  describe('checkInt', () => {
    const test = (shouldRight: boolean) => (v: unknown) => {
      const e = checkInt(v);
      expect(pipe(e, shouldRight ? isRight : isLeft)).toBe(true);
      expect(toUnion(e) === v).toBe(true);
    };

    it('should return right if v is int.', () => {
      ints.forEach(test(true));
    });

    it('should return left if v is not int,or int string, or non-int string.', () => {
      intStrings.forEach(test(false));
      nonIntStrings.forEach(test(false));
      nonIntValues.forEach(test(false));
    });
  });

  describe('makeInt', () => {
    const test = (shouldSome: boolean) => (v: unknown) => {
      const o = makeInt(v);
      expect(pipe(o, shouldSome ? isSome : isNone)).toBe(true);
      if (isSome(o)) {
        expect(isInt(o.value)).toBe(true);
      }
    };

    it('should return some if v is int or int string.', () => {
      ints.forEach(test(true));
      intStrings.forEach(test(true));
    });

    it('should return none if v is non-int value or non-int string.', () => {
      nonIntValues.forEach(test(false));
      nonIntStrings.forEach(test(false));
    });
  });

  describe('tryMakeInt', () => {
    const test = (shouldRight: boolean) => (v: unknown) => {
      const e = tryMakeInt(v);
      expect(pipe(e, shouldRight ? isRight : isLeft)).toBe(true);
      expect(pipe(e, toUnion, shouldRight ? isInt : (i) => i === v)).toBe(true);
    };

    it('should return right if v is int or int string.', () => {
      ints.forEach(test(true));
      intStrings.forEach(test(true));
    });

    it('should return left if v is non-int value or non-int string.', () => {
      nonIntValues.forEach(test(false));
      nonIntStrings.forEach(test(false));
    });
  });

  describe('makeIntUncheck', () => {
    const test = (shouldParse: boolean) => (v: unknown) => {
      const i = makeIntUncheck(v);
      expect(isInt(i)).toBe(shouldParse);
      if (!shouldParse) {
        expect(i === v).toBe(true);
      }
    };

    it('should parse if v is int or int string.', () => {
      ints.forEach(test(true));
      intStrings.forEach(test(true));
    });

    it('should not parse if v is non-int value or non-int string.', () => {
      nonIntValues.forEach(test(false));
      nonIntStrings.forEach(test(false));
    });
  });
});
