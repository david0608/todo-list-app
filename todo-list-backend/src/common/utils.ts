import { Option, some, none } from 'fp-ts/Option';

export const countDownGenerator: <A>(
  c: (n: number) => A,
) => (n: number) => Option<[A, number]> = (c) => (n) => {
  if (n <= 0) return none;
  const data = c(n);
  return some([data, n - 1]);
};
