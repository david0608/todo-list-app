import { pipe } from 'fp-ts/function';
import { isSome, isNone } from 'fp-ts/Option';
import { isLeft, isRight, toUnion } from 'fp-ts/Either';
import {
  isPriority,
  isArrayOfPriority,
  makePriority,
  tryMakePriority,
  makePriorityUncheck,
} from './priority';

describe('priority', () => {
  const priorities = [1, 2, 3];
  const priorityArrays = [[1], [2], [3], [1, 2], [1, 2, 3], [1, 1, 1, 2, 3]];
  const nonPriorityArrays = [['1'], [1, 2, '3']];
  const priorityValues = [1, 2, 3, '1', '2', '3'];
  const nonPriorityValues = [
    true,
    false,
    0,
    4,
    '0',
    '4',
    BigInt(Number.MAX_VALUE),
    Symbol(1),
    {},
    [],
    null,
    undefined,
  ];

  describe('isPriority', () => {
    const test = (tobe: boolean) => (v: unknown) => {
      expect(isPriority(v)).toBe(tobe);
    };

    it('should return true if v is priority.', () => {
      priorities.forEach(test(true));
    });

    it('should return false if v is non-priority value', () => {
      nonPriorityValues.forEach(test(false));
    });
  });

  describe('isArrayOfPriority', () => {
    const test = (tobe: boolean) => (v: unknown[]) => {
      expect(isArrayOfPriority(v)).toBe(tobe);
    };

    it('should return true if v is array priority.', () => {
      priorityArrays.forEach(test(true));
    });

    it('should return false if v is not array of priority', () => {
      (nonPriorityArrays as unknown[]).forEach(test(false));
    });
  });

  describe('makePriority', () => {
    const test = (shouldSome: boolean) => (v: unknown) => {
      expect(pipe(v, makePriority, shouldSome ? isSome : isNone)).toBe(true);
    };

    it('should return some if v is priority value.', () => {
      priorityValues.forEach(test(true));
    });

    it('should return none if v is non-priority value.', () => {
      nonPriorityValues.forEach(test(false));
    });
  });

  describe('tryMakePriority', () => {
    const test = (shouldRight: boolean) => (v: unknown) => {
      const e = tryMakePriority(v);
      expect(pipe(e, shouldRight ? isRight : isLeft)).toBe(true);
      if (!shouldRight) {
        expect(toUnion(e) === v).toBe(true);
      }
    };

    it('should return right if v is priority value.', () => {
      priorityValues.forEach(test(true));
    });

    it('should return left if v is non-priority value.', () => {
      nonPriorityValues.forEach(test(false));
    });
  });

  describe('makePriorityUncheck', () => {
    const test = (shouldParse: boolean) => (v: unknown) => {
      const n = makePriorityUncheck(v);
      expect(isPriority(n)).toBe(shouldParse);
      if (!shouldParse) {
        expect(n === v).toBe(true);
      }
    };

    it('should parse priority value.', () => {
      priorityValues.forEach(test(true));
    });

    it('should not parse non-priority value.', () => {
      nonPriorityValues.forEach(test(false));
    });
  });
});
