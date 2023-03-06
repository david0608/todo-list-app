import * as O from 'fp-ts/Option';

export const countDownGenerator: <A>(
  c: (n: number) => A,
) => (n: number) => O.Option<[A, number]> = (c) => (n) => {
  if (n <= 0) return O.none;
  const data = c(n);
  return O.some([data, n - 1]);
};
