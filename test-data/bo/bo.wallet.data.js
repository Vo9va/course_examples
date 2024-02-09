export default {
  balanceAdjustment: {
    amount: 50,
    payment_method_id: 2,
    customer_card_type: null,
    customer_card_last4: null,
    processor_name: null,
    transaction_id: null,
    note: 'test',
  },

  balanceAdjustmentViaPnl: {
    amount: 100,
    payment_method_id: 1,
    customer_card_type: null,
    customer_card_last4: null,
    processor_name: null,
    transaction_id: null,
    note: 'testPNL',
    transaction_subtype_id: 8,
  },

  balanceAdjustmentDeductFundsViaChb: {
    amount: 30,
    note: 'testCHB',
  },

  withdrawalViaBTCMethodWithFee: {
    5: [{ additional_amount: 40, transactions: [] }],
    note: 'test',
    reason_id: null,
    fee_amount: 10,
  },

  withdrawalViaAPMMethodWithFee: {
    4: [{ additional_amount: 40, transactions: [] }],
    note: 'test',
    reason_id: null,
    fee_amount: 10,
  },
};
