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

describe('C22949 Financial Flow - Delete Withdrawal requests', function () {
  let cid;
  let rows;
  let withdrawalAmount;
  let withdrawalRequestId;
  let idTransactionForWithdrawal;
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
    const depositRes = await boWalletHelper.createDeposit(agent, cid);
    const confirmUrl = depositRes.body.proceedRequestParams.url;

    expect(depositRes.statusCode).to.equal(200);
    expect(depositRes.body.proceedRequestParams).to.have.property('url');

    const confirmRes = await boWalletHelper.confirmDeposit(agent, confirmUrl, secureCode);

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

  it('Wait for withdrawal status change', async function () {
    let withdrawalDataRes = await walletHelper.waitForWithdrawalStatusChange(agent, 'open');

    withdrawalRequestId = withdrawalDataRes.body.withdrawal_requests[0].id;
    withdrawalAmount = withdrawalDataRes.body.withdrawal_requests[0].requested_amount;
  });

  it('Get withdrawals by CID', async function () {
    const res = await boWalletHelper.getWithdrawalsByCid(agent, cid);

    expect(res.statusCode).to.equal(200);
    expect(res.body.rows[0].requested_amount).to.equal(50);
  });

  it('Approve withdrawal', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    const withdrawalApproveRes = await boWalletHelper.approveWithdrawal(
      agent,
      cid,
      withdrawalRequestId,
      withdrawalAmount
    );

    expect(withdrawalApproveRes.statusCode).to.equal(200);

    const withdrawalDataRes2 = await boWalletHelper.waitForWithdrawalMtIdChange(agent, cid);

    expect(withdrawalDataRes2[0].status).to.equal('approved');
  });

  it('Wait for balance change after withdrawal', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await boCustomerHelper.waitForBalanceChange(agent, cid, constants.MODE.REAL, walletData.deposit.amount - 50);
  });

  it('Delete withdrawal', async function () {
    const resDelete = await boWalletHelper.deleteWithdrawal(agent, cid, { id: withdrawalRequestId });

    expect(resDelete.status).to.equal(200);
  });

  it('Wait for get transaction length change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    let res = await boWalletHelper.waitForGetTransactionsLength(agent, cid, 5);
    rows = res.body.rows;
    idTransactionForWithdrawal = rows.find(
      (row) =>
        row.withdrawal_request_id === withdrawalRequestId &&
        row.transaction_type_id === 2 &&
        row.transaction_subtype_id === 4
    ).id;
  });

  it('Check that transaction status change to deleted', async function () {
    await boWalletHelper.waitForTransactionStatusChange(agent, cid, 'deleted', idTransactionForWithdrawal);
    const resTransactionDeleted = await boWalletHelper.getTransactions(agent, cid);
    rows = resTransactionDeleted.body.rows;
    let transactionStatus = rows.find((row) => row.id === idTransactionForWithdrawal).status;
    let transactionWithdrawalRequestId = rows.find(
      (row) => row.id === idTransactionForWithdrawal
    ).withdrawal_request_id;

    expect(transactionWithdrawalRequestId).to.equal(withdrawalRequestId);
    expect(transactionStatus).to.equal('deleted');
  });

  it('Wait for balance change after delete transaction', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await boCustomerHelper.waitForBalanceChange(agent, cid, constants.MODE.REAL, walletData.deposit.amount);
  });

  it('Check that customer has new balance after delete transaction', async function () {
    const resAccount = await boCustomerHelper.getCustomerTradingAccount(agent, cid, constants.MODE.REAL);

    expect(resAccount.balance).to.equal(walletData.deposit.amount);
  });
});
