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

describe('C19543 Financial Flow - Balance adjustment -> Add funds (PNL)', function () {
  let cid;
  let transactions;
  let customer = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(8, process.env.BRAND);
  let balanceAdjustmentAmount = walletDataBO.balanceAdjustment.amount;
  let balanceAdjustmentViaPnlAmount = walletDataBO.balanceAdjustmentViaPnl.amount;

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

  it('Preconditions: activate trading account via balance adjustment', async function () {
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

  it('Create Balance Adjustment -> PNL', async function () {
    const resBalanceAdjustmentViaPnl = await boWalletHelper.createBalanceAdjustmentViaPnl(agent, cid);

    expect(resBalanceAdjustmentViaPnl.status).to.equal(200);

    const resBalanceChange = await walletHelper.waitForBalanceChange(
      agent,
      constants.MODE.REAL,
      balanceAdjustmentAmount + balanceAdjustmentViaPnlAmount
    );

    expect(resBalanceChange.balance).to.equal(balanceAdjustmentAmount + balanceAdjustmentViaPnlAmount);
    expect(resBalanceChange.free_margin).to.equal(balanceAdjustmentAmount + balanceAdjustmentViaPnlAmount);
  });

  it('Wait for transactions length is 4', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    let resCustomerTransactions = await boWalletHelper.waitForGetTransactionsLength(agent, cid, 4);
    transactions = resCustomerTransactions.body.rows;

    expect(resCustomerTransactions.status).to.equal(200);
    expect(transactions).to.have.lengthOf(4);
  });

  it('Check customer transactions for "Balance Adjustment -> PNL"', async function () {
    let idTransactionForAdjustmentViaPnl = transactions.find(
      (row) => row.transaction_type_id === 3 && row.transaction_subtype_id === 8 && row.payment_method_id === 1
    ).id;
    let transactionStatusForAdjustmentViaPnl = transactions.find(
      (row) => row.id === idTransactionForAdjustmentViaPnl
    ).status;
    let transactionAmountForAdjustmentViaPnl = transactions.find(
      (row) => row.id === idTransactionForAdjustmentViaPnl
    ).customer_amount;

    expect(transactionStatusForAdjustmentViaPnl).to.equal('approved');
    expect(transactionAmountForAdjustmentViaPnl).to.equal(balanceAdjustmentViaPnlAmount);

    let idTransactionForAdjustmentViaPnlWithParentId = transactions.find(
      (row) => row.parent_transaction_id === idTransactionForAdjustmentViaPnl
    ).id;
    let transactionStatusForParentTransaction = transactions.find(
      (row) => row.id === idTransactionForAdjustmentViaPnlWithParentId
    ).status;

    expect(transactionStatusForParentTransaction).to.equal('approved');
  });
});
