export const env = process.env.ENV || 'dev';
export const brand = process.env.BRAND || 'Capitalix';
export const product = process.env.PRODUCT || 'FO';

let config;

if (product === 'BO') {
  if (brand === 'Capitalix') {
    config = require('./e2e-bo/configs/capitalix/bo.capitalix.' + env);
  } else if (brand === 'InvestFW') {
    config = require('./e2e-bo/configs/investFW/bo.investFW.' + env);
  } else if (brand === 'TradeEU') {
    config = require('./e2e-bo/configs/tradeEU/bo.tradeEU.' + env);
  } else if (brand === 'NRDX') {
    config = require('./e2e-bo/configs/nrdx/bo.nrdx.' + env);
  } else if (brand === 'WC1') {
    config = require('./e2e-bo/configs/wc1/bo.wc1.' + env);
  }
}

if (product === 'GG') {
  config = require('./page-speed-specs/configs/gg.' + env);
}

if (product === 'FO') {
  if (brand === 'Capitalix') {
    config = require('./e2e-fo/configs/capitalix/capitalix.' + env);
  } else if (brand === 'InvestFW') {
    config = require('./e2e-fo/configs/investFW/investFW.' + env);
  } else if (brand === 'TradeEU') {
    config = require('./e2e-fo/configs/tradeEU/tradeEU.' + env);
  } else if (brand === 'NRDX') {
    config = require('./e2e-fo/configs/nrdx/nrdx.' + env);
  } else if (brand === 'WC1') {
    config = require('./e2e-fo/configs/wc1/wc1.' + env);
  }
}

if (product === 'SYNC_ACCOUNT') {
  config = require('./manual-scripts/configs/sync-account/' + env);
}

if (product === 'EXPORT_XML') {
  config = require('./testrail/configForExportXML');
}

if (product === 'SETUP_BRAND') {
  config = require('./manual-scripts/configs/setup-brand/' + env);
}

config.TR_UPDATE = process.env.TR_UPDATE;
config.REPORT = process.env.REPORT;

export default config;
