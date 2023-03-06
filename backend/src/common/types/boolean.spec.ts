import { pipe } from 'fp-ts/function';
import { isSome, isNone } from 'fp-ts/Option';
import { isLeft, isRight, toUnion } from 'fp-ts/Either';
import { makeBoolean, tryMakeBoolean, makeBooleanUncheck } from './boolean';

describe('boolean', () => {
  const booleanValues = [
    true,
    false,
    1,
    0,
    '1',
    '0',
    'True',
    'False',
    'true',
    'false',
    'T',
    'F',
    't',
    'f',
  ];
  const nonBooleanValues = [
    'string',
    '2',
    2,
    BigInt(Number.MAX_VALUE),
    Symbol(1),
    {},
    [],
    null,
    undefined,
  ];

  describe('makeBoolean', () => {
    const test = (shouldSome: boolean) => (v: unknown) => {
      const o = makeBoolean(v);
      expect(pipe(o, shouldSome ? isSome : isNone)).toBe(true);
      if (isSome(o)) {
        expect(typeof o.value === 'boolean').toBe(true);
      }
    };

    it('should return some if v is boolean value.', () => {
      booleanValues.forEach(test(true));
    });

    it('should return none if v is non-boolean value.', () => {
      nonBooleanValues.forEach(test(false));
    });
  });

  describe('tryMakeBoolean', () => {
    const test = (shouldRight: boolean) => (v: unknown) => {
      const e = tryMakeBoolean(v);
      expect(pipe(e, shouldRight ? isRight : isLeft)).toBe(true);
      if (!shouldRight) {
        expect(toUnion(e) === v).toBe(true);
      }
    };

    it('should return right if v is boolean value.', () => {
      booleanValues.forEach(test(true));
    });

    it('should return left if v is non-boolean value.', () => {
      nonBooleanValues.forEach(test(false));
    });
  });

  describe('makeBooleanUncheck', () => {
    const test = (shouldParse: boolean) => (v: unknown) => {
      const b = makeBooleanUncheck(v);
      expect(typeof b === 'boolean').toBe(shouldParse);
      if (!shouldParse) {
        expect(b === v).toBe(true);
      }
    };
    it('should parse boolean value.', () => {
      booleanValues.forEach(test(true));
    });

    it('should not parse non-boolean value.', () => {
      nonBooleanValues.forEach(test(false));
    });
  });
});
