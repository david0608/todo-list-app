import { Transform } from 'class-transformer';
import { parsePriority, parseArrayOfPriority } from '../types/priority';

export const ToPriority = () => Transform(({ value }) => parsePriority(value));

export const ToArrayOfPriority = () =>
  Transform(({ value }) => parseArrayOfPriority(String(value).split(',')));
