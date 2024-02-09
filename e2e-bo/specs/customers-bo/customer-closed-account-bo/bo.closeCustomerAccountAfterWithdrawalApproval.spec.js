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

describe('C25597 BO Customer account closing after withdrawal manual approval', function () {
  const { secureCode } = config.default;
  let cid;
  let withdrawalRequestId;
  let withdrawalAmount;
  let customer = customerData.getCustomerDepositor();
  let customerForLogin = {
    brand_id: process.env.BRAND,
    email: 'portfolio_monitor_test@mailinator.com',
    password: '123456Aa',
    system_id: 'web',
  };
  const admin = boUserData.getAdminBoDataForLogin(9, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, admin);
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

  it('Initialization of closing customer account', async function () {
    const resCloseAccount = await customersHelper.closeCustomerAccount(agent);

    expect(resCloseAccount.statusCode).to.equal(200);
  });

  it(`Check customer's account status is 'Closing in progress'`, async function () {
    await boUserHelper.loginBoAdmin(agent, admin);
    const resCustomerBo = await boCustomerHelper.getCustomer(agent, cid);

    expect(resCustomerBo.body.customer.status_id).to.equal('closing_in_progress');
  });

  it('Get information about withdrawal', async function () {
    const withdrawalDataRes = await boWalletHelper.getWithdrawals(agent, cid);
    withdrawalRequestId = withdrawalDataRes[0].id;
    withdrawalAmount = withdrawalDataRes[0].requested_amount;
    await walletHelper.waitForWithdrawalStatusChange(agent, 'open');

    expect(withdrawalDataRes[0].initiator).to.equal('close_account_auto');

    // Need for correct work spec
    await customersHelper.loginCustomer(agent, customerForLogin);
    await customersHelper.logoutCustomer(agent);
  });

  it('Approve withdrawal from BO', async function () {
    const withdrawalApproveRes = await boWalletHelper.approveWithdrawal(
      agent,
      cid,
      withdrawalRequestId,
      withdrawalAmount
    );

    expect(withdrawalApproveRes.statusCode).to.equal(200);
  });

  it(`Check customer's account status is 'Closed'`, async function () {
    await boCustomerHelper.waitForCustomerStatusIdChange(agent, cid, 'closed');
  });
});
