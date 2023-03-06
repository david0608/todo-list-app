import { Transform } from 'class-transformer';
import { pipe } from 'fp-ts/function';
import { map as Amap } from 'fp-ts/Array';
import { makePriorityUncheck } from '../types/priority';

export const ToPriority = () =>
  Transform(({ value }) => makePriorityUncheck(value));

export const ToArrayOfPriority = () =>
  Transform(({ value }) =>
    pipe(String(value).split(','), Amap(makePriorityUncheck)),
  );
