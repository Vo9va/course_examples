import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import boWalletHelper from '../../../../test-utils/helpers/helpers-bo/bo.wallet.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import constants from '../../../../test-data/constants';
import walletDataBO from '../../../../test-data/bo/bo.wallet.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';

describe('C19553 Financial Flow - Balance adjustment -> Deduct funds (CHB)', function () {
  let cid;
  let transactions;
  let customer = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(8, process.env.BRAND);
  let balanceAdjustmentAmount = walletDataBO.balanceAdjustment.amount;
  let balanceDeductionAmount = walletDataBO.balanceAdjustmentDeductFundsViaChb.amount;

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    const res = await customersHelper.waitTillCustomerCreated(agent, customer);
    cid = res.cid;
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Preconditions: add funds to account via balance adjustment', async function () {
    const resBalanceAdjustment = await boWalletHelper.createBalanceAdjustment(agent, cid);

    expect(resBalanceAdjustment.status).to.equal(200);

    const resBalanceChange = await walletHelper.waitForBalanceChange(
      agent,
      constants.MODE.REAL,
      balanceAdjustmentAmount
    );

    expect(resBalanceChange.balance).to.equal(balanceAdjustmentAmount);
    expect(resBalanceChange.free_margin).to.equal(balanceAdjustmentAmount);
  });

  it('Create Balance Adjustment -> Deduct funds (CHB)', async function () {
    const resBalanceAdjustmentDeductFundsViaChb = await boWalletHelper.createBalanceAdjustmentDeductFundsViaChb(
      agent,
      cid
    );

    expect(resBalanceAdjustmentDeductFundsViaChb.status).to.equal(200);

    const resBalanceChange = await walletHelper.waitForBalanceChange(
      agent,
      constants.MODE.REAL,
      balanceAdjustmentAmount - balanceDeductionAmount
    );

    expect(resBalanceChange.balance).to.equal(balanceAdjustmentAmount - balanceDeductionAmount);
    expect(resBalanceChange.free_margin).to.equal(balanceAdjustmentAmount - balanceDeductionAmount);
  });

  it('Wait for transactions length is 4', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    let resCustomerTransactions = await boWalletHelper.waitForGetTransactionsLength(agent, cid, 4);
    transactions = resCustomerTransactions.body.rows;

    expect(resCustomerTransactions.status).to.equal(200);
    expect(transactions).to.have.lengthOf(4);
  });

  it('Check customer transactions for "Balance Adjustment -> Deduct funds (CHB)"', async function () {
    let idTransactionForBalanceDeduction = transactions.find(
      (row) => row.transaction_type_id === 6 && row.transaction_subtype_id === 10
    ).id;
    let transactionStatusForBalanceDeduction = transactions.find(
      (row) => row.id === idTransactionForBalanceDeduction
    ).status;
    let transactionAmountForBalanceDeduction = transactions.find(
      (row) => row.id === idTransactionForBalanceDeduction
    ).customer_amount;

    expect(transactionStatusForBalanceDeduction).to.equal('approved');
    expect(transactionAmountForBalanceDeduction).to.equal(balanceDeductionAmount);

    let idTransactionForBalanceDeductionWithParentId = transactions.find(
      (row) => row.parent_transaction_id === idTransactionForBalanceDeduction
    ).id;
    let transactionStatusForParentTransaction = transactions.find(
      (row) => row.id === idTransactionForBalanceDeductionWithParentId
    ).status;

    expect(transactionStatusForParentTransaction).to.equal('approved');
  });
});
