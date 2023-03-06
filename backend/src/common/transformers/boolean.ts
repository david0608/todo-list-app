import { Transform } from 'class-transformer';
import { makeBooleanUncheck } from '../types/boolean';

export const ToBoolean = () =>
  Transform(({ value }) => makeBooleanUncheck(value));
