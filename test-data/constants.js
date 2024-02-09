export default {
  TRADING_STATUS: {
    LEAD: 'lead',
    DEPOSITOR: 'depositor',
    TRADER: 'trader',
  },
  KYC_STATUS: {
    UNKNOWN: 'unknown',
    NOT_VERIFIED: 'not_verified',
    VERIFIED: 'verified_manual',
  },
  MODE: {
    REAL: 'live',
    DEMO: 'demo',
  },
  DOCUMENT: {
    PASSPORT: 'passport',
    PROOF_OF_RESIDENCE: 'proof_of_residence',
    WORLD_CHECK: 'world_check',
  },
  DOCUMENT_STATUS: {
    NEW: 'new',
    APPROVED: 'approved',
    EXPIRED: 'expired',
    DECLINED: 'declined',
  },
  //TODO remove timeout after NG-2188 task will be resolve
  TIMEOUT: {
    WAIT_BALANCE: 90000,
    WAIT_10S: 10000,
    WAIT_1S: 1000,
    WAIT_500MS: 500,
    WAIT_70s: 70000,
  },
  TRADING_SYMBOL: {
    AUDUSD: {
      ID: 'AUDUSD',
      VOLUME: 100,
    },
    AMAZON: {
      ID: 'AMAZON',
      VOLUME: 10,
    },
    BTCUSD: {
      ID: 'BTCUSD',
      VOLUME: 0.01,
    },
    DASHUSD: {
      ID: 'DASHUSD',
      VOLUME: 1,
    },
  },
  BARS_INTERVAL: {
    '1M': '1m',
  },
  ORDER_TYPE: {
    SELL_STOP: 'sell_stop',
    BUY_STOP: 'buy_stop',
    SELL: 'sell',
    BUY: 'buy',
  },
  ORDER_STATUS: {
    OPEN: 'open',
    CLOSED: 'closed',
    CANCELLED: 'cancelled',
  },
  CURRENCY: {
    USD: 'USD',
    EUR: 'EUR',
  },
  HEADER: {
    NAME: 'x-ng-autotests-run',
    VALUE: '5d1lt0e8ypgrpz0',
  },
};
