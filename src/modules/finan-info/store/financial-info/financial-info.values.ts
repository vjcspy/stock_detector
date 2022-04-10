export class FinancialInfoValues {
  static START_PAGE_FOR_YEAR = 2;
  static START_PAGE_FOR_QUARTER = 8;

  static EXCHANGE_KEY = 'finan.info.sync-financial-info';
  static PUBLISHER_ROUTING_KEY = 'finan.info.sync-financial-info.cor';

  static PUBLISHER_ROUTING_KEY_INDICATOR_YEAR =
    'finan.info.sync-financial-info.cor.indicator.year';
  static PUBLISHER_ROUTING_KEY_INDICATOR_QUARTER =
    'finan.info.sync-financial-info.cor.indicator.quarter';

  static PUBLISHER_ROUTING_KEY_BS_YEAR =
    'finan.info.sync-financial-info.cor.balance-sheet.year';
  static PUBLISHER_ROUTING_KEY_BS_QUARTER =
    'finan.info.sync-financial-info.cor.balance-sheet.quarter';

  static PUBLISHER_ROUTING_KEY_BR_YEAR =
    'finan.info.sync-financial-info.cor.biz-report.year';
  static PUBLISHER_ROUTING_KEY_BR_QUARTER =
    'finan.info.sync-financial-info.cor.biz-report.quarter';

  static PUBLISHER_ROUTING_KEY_CF_YEAR =
    'finan.info.sync-financial-info.cor.cash-flow.year';
  static PUBLISHER_ROUTING_KEY_CF_QUARTER =
    'finan.info.sync-financial-info.cor.cash-flow.quarter';

  // Order matching
  static ORDER_MATCHING_KEY = 'finan.info.sync-financial-info.order-matching';
}
