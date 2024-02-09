import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import walletData from '../../../../test-data/ng/common.data';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import constants from '../../../../test-data/constants';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import boWalletHelper from '../../../../test-utils/helpers/helpers-bo/bo.wallet.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import config from '../../../../config';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';

describe('C25589 Financial Flow - Deleting the deposit made by customers', function () {
  let cid;
  let idTransaction;
  const { secureCode } = config.default;
  let customer = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(9, process.env.BRAND);

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
    await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Create and confirm deposit', async function () {
    const depositRes = await walletHelper.createDeposit(agent);

    expect(depositRes.statusCode).to.equal(200);
    expect(depositRes.body.proceedRequestParams).to.have.property('url');

    const confirmUrl = depositRes.body.proceedRequestParams.url;
    const confirmRes = await walletHelper.confirmDeposit(agent, confirmUrl, secureCode);

    expect(confirmRes.statusCode).to.equal(200);
  });

  it('Wait for balance change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await boCustomerHelper.waitForBalanceChange(agent, cid, constants.MODE.REAL, walletData.deposit.amount);
    await walletHelper.waitForDepositTransactionStatusChange(agent, 'approved');
  });

  it('Wait for transaction MT id change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    const resTransaction = await boWalletHelper.waitForTransactionMtIdChange(agent, cid);
    idTransaction = resTransaction.body.rows[1].id;

    expect(resTransaction.statusCode).to.equal(200);
    expect(resTransaction.body.rows[1].transaction_subtype_id).to.equal(1);
    expect(resTransaction.body.rows[1].initiator).to.equal('customer');
  });

  it('Delete transaction ', async function () {
    const resDelete = await boWalletHelper.deleteTransaction(agent, cid, { id: idTransaction });

    expect(resDelete.status).to.equal(200);

    await boWalletHelper.waitForTransactionStatusChange(agent, cid, 'deleted', idTransaction);
  });

  it('Wait for get transactions length change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    const resTransactionDeleted = await boWalletHelper.waitForGetTransactionsLength(agent, cid, 0);
    let rows = resTransactionDeleted.body.rows;
    let transactionStatus = rows.find((row) => row.id === idTransaction).status;

    expect(transactionStatus).to.equal('deleted');
  });

  it('Wait for balance change after delete transaction', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await boCustomerHelper.waitForBalanceChange(agent, cid, constants.MODE.REAL, 0);
  });

  it('Check that customer has new balance after delete transaction', async function () {
    const resAccount = await boCustomerHelper.getCustomerTradingAccount(agent, cid, constants.MODE.REAL);

    expect(resAccount.balance).to.equal(0);
    expect(resAccount.free_margin).to.equal(0);
    expect(resAccount.equity).to.equal(0);
  });
});
