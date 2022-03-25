import { Injectable } from '@nestjs/common';
import { Moment } from 'moment';

@Injectable()
export class BetaOriginalAnalyze {
  public calculateBeta(code: string, startTime: Moment, endTime: Moment) {
    console.log('calculate beta');
  }
}
