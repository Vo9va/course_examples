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

describe('C25591 Financial Flow - No possibility to delete the deposit made by customers if available balance < deposit amount', function () {
  let cid;
  let idTransaction;
  let withdrawalAmount;
  let withdrawalRequestId;
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

  it('Create withdrawal', async function () {
    const resWithdrawal = await walletHelper.createWithdrawal(agent, 50);

    expect(resWithdrawal.statusCode).to.equal(200);
  });

  it('Get information about withdrawal', async function () {
    const withdrawalDataRes = await boWalletHelper.getWithdrawals(agent, cid);
    withdrawalRequestId = withdrawalDataRes[0].id;
    withdrawalAmount = withdrawalDataRes[0].requested_amount;

    await walletHelper.waitForWithdrawalStatusChange(agent, 'open');
  });

  it('Approve withdrawal', async function () {
    const withdrawalApproveRes = await boWalletHelper.approveWithdrawal(
      agent,
      cid,
      withdrawalRequestId,
      withdrawalAmount
    );

    expect(withdrawalApproveRes.statusCode).to.equal(200);
  });

  it('Get withdrawal information after approved ', async function () {
    const withdrawalDataRes2 = await boWalletHelper.getWithdrawals(agent, cid);

    expect(withdrawalDataRes2[0].status).to.equal('approved');
  });

  it('Wait for balance changed after withdrawal', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    const resAccountBefore = await boCustomerHelper.waitForBalanceChange(
      agent,
      cid,
      constants.MODE.REAL,
      walletData.deposit.amount - 50
    );

    expect(resAccountBefore.balance).to.equal(walletData.deposit.amount - 50);
  });

  it('Wait for get transactions length change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    const resTransaction = await boWalletHelper.waitForGetTransactionsLength(agent, cid, 3);
    idTransaction = resTransaction.body.rows[3].id;

    expect(resTransaction.statusCode).to.equal(200);
    expect(resTransaction.body.rows[3].transaction_subtype_id).to.equal(1);
    expect(resTransaction.body.rows[3].initiator).to.equal('customer');
  });

  it('Delete transaction', async function () {
    const resDelete = await boWalletHelper.deleteTransaction(agent, cid, { id: idTransaction });

    expect(resDelete.status).to.equal(400);
    expect(resDelete.body.message).to.equal('Insufficient funds on the available balance');
  });
});
