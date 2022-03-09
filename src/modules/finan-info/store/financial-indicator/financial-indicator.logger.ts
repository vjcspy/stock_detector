import { initDefaultLogger } from '@module/core/util/logfile';

export class FinancialIndicatorLogger {
  static LOGGER;
}

export const financialIndicatorLogger = () => {
  if (typeof FinancialIndicatorLogger.LOGGER === 'undefined') {
    FinancialIndicatorLogger.LOGGER = initDefaultLogger(
      'consumers/financial-indicator.log',
    );
  }

  return FinancialIndicatorLogger.LOGGER;
};
