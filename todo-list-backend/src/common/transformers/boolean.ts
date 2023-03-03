import { Transform } from 'class-transformer';
import { makeBooleanUncheck } from '../types';

export const ToBoolean = () =>
  Transform(({ value }) => makeBooleanUncheck(value));
