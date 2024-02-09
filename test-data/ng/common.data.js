export default {
  deposit: {
    amount: 300,
    card_number: '4012001037490014',
    cvv: '123',
    name_on_card: 'QA Auto API',
    dod_accepted: true,
    expire_year: 2024,
    expire_month: 12,
  },

  withdrawalDecline: {
    decline_reason_id: 'funds_not_available',
    note: 'test',
    status: 'declined',
  },

  updatePositionDataSell: {
    price_sl: 100000,
    price_tp: 0.01,
  },

  updatePositionDataBuy: {
    price_sl: 0.01,
    price_tp: 100000,
  },

  updateOrderDataBuy: {
    price: 90000,
    price_sl: 0.01,
    price_tp: 100000,
    type_id: 'buy_stop',
  },

  transactionDelete: {
    id: 290040,
    note: 'test delete transaction',
  },

  marketingParametersAfterFirstRegistration: {
    url: 'http://dev.mtxcapital.com/url_nfs_e2e_ui_612461/',
    AdID: '0d9e8fd0-ce58-11e9-b2bb-7d949d328a05',
    subc: 'wfbphbodp1kj57h02sp2ff9u',
    asset: 'Tesla',
  },

  marketingParametersAfterSecondRegistration: {
    url: 'http://dev.mtxcapital.com/url_nfs_e2e_ui_3453333/',
    AdID: '0d9e8fd0-ce58-11e9-b2bb-11111111111',
    subc: 'wfbphb1111111111111',
    asset: 'Audi',
  },
};
