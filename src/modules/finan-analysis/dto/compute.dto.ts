import { IsNotEmpty } from 'class-validator';
import { IsOnlyDate } from '@module/core/validator/isOnlyDate';

export class ComputeAlphaDto {
  @IsNotEmpty()
  code1: string;

  @IsNotEmpty()
  code2: string;

  @IsOnlyDate()
  startTime: string;

  endTime: string;
}
