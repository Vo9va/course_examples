import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import walletData from '../../../../test-data/ng/common.data';
import walletDataBO from '../../../../test-data/bo/bo.wallet.data';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import constants from '../../../../test-data/constants';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import boWalletHelper from '../../../../test-utils/helpers/helpers-bo/bo.wallet.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import config, { brand } from '../../../../config';

describe('C22948 Financial Flow - Withdrawal via APM payment method', function () {
  let cid;
  const { secureCode } = config.default;
  let apmPaymentMethodId = 4;
  let withdrawalRequestId;
  let withdrawalAmount;
  let withdrawalTransactionId;
  let customer = customerData.getCustomerDepositor();

  before(async function () {
    brand === 'Capitalix' && this.skip();
    const superAdminBO = boUserData.getAdminBoDataForLogin(10, process.env.BRAND);
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Created customer depositor', async function () {
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

    await walletHelper.waitForDepositTransactionStatusChange(agent, 'approved');

    await boCustomerHelper.waitForBalanceChange(agent, cid, constants.MODE.REAL, walletData.deposit.amount);
  });

  it('Create withdrawal', async function () {
    const resWithdrawal = await walletHelper.createWithdrawal(agent, 50);

    expect(resWithdrawal.statusCode).to.equal(200);

    await walletHelper.waitForWithdrawalStatusChange(agent, 'open');
  });

  it('Get customer withdrawal', async function () {
    let withdrawalDataRes = await boWalletHelper.getWithdrawals(agent, cid);
    withdrawalRequestId = withdrawalDataRes[0].id;
    withdrawalAmount = withdrawalDataRes[0].requested_amount;
  });

  it('Approve withdrawal via APM method with free', async function () {
    const withdrawalApproveRes = await boWalletHelper.approveWithdrawalViaAnyMethodWithFee(
      agent,
      cid,
      withdrawalRequestId,
      walletDataBO.withdrawalViaAPMMethodWithFee
    );

    expect(withdrawalApproveRes.statusCode).to.equal(200);

    const withdrawalDataRes = await boWalletHelper.getWithdrawals(agent, cid);

    expect(withdrawalDataRes[0].status).to.equal('approved');
  });

  it('Wait for balance change after aproved ', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await boCustomerHelper.waitForBalanceChange(agent, cid, constants.MODE.REAL, walletData.deposit.amount - 50);
  });

  it('Check that customer has new balance after approved transaction ', async function () {
    const resAccountBefore = await boCustomerHelper.getCustomerTradingAccount(agent, cid, constants.MODE.REAL);

    expect(resAccountBefore.balance).to.equal(walletData.deposit.amount - 50);
  });

  it('Wait for get transactions length change after approved withdrawal', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    let res = await boWalletHelper.waitForGetTransactionsLength(agent, cid, 4);
    let rows = res.body.rows;
    expect(res.statusCode).to.equal(200);

    withdrawalTransactionId = rows.find(
      (row) =>
        row.withdrawal_request_id === withdrawalRequestId &&
        row.transaction_type_id === 2 &&
        row.transaction_subtype_id === 4
    ).id;

    let withdrawalTransactionAmount = rows.find(
      (row) =>
        row.withdrawal_request_id === withdrawalRequestId &&
        row.transaction_type_id === 2 &&
        row.transaction_subtype_id === 4
    ).customer_amount;

    let withdrawalPaymentMethodId = rows.find(
      (row) =>
        row.withdrawal_request_id === withdrawalRequestId &&
        row.transaction_type_id === 2 &&
        row.transaction_subtype_id === 4
    ).payment_method_id;

    let withdrawalTransactionFeeAmount = rows.find(
      (row) =>
        row.withdrawal_request_id === withdrawalRequestId &&
        row.transaction_type_id === 3 &&
        row.transaction_subtype_id === 23
    ).customer_amount;

    expect(withdrawalTransactionAmount).to.equal(
      withdrawalAmount - walletDataBO.withdrawalViaAPMMethodWithFee.fee_amount
    );
    expect(withdrawalPaymentMethodId).to.equal(apmPaymentMethodId);
    expect(withdrawalTransactionFeeAmount).to.equal(walletDataBO.withdrawalViaAPMMethodWithFee.fee_amount);
  });

  it('Check transaction via filter in Operations -> Transactions', async function () {
    let resOperationTransactions = await boWalletHelper.getOperationTransactions(
      agent,
      `&id=${withdrawalTransactionId}&payment_method_id=${apmPaymentMethodId}`
    );

    expect(resOperationTransactions.statusCode).to.equal(200);
    expect(resOperationTransactions.body.count).to.equal(1);
    expect(resOperationTransactions.body.rows[0].id).to.equal(withdrawalTransactionId);
  });
});
