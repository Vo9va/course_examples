import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boWalletHelper from '../../../../test-utils/helpers/helpers-bo/bo.wallet.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import constants from '../../../../test-data/constants';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import config from '../../../../config';

describe('Wallet service | Withdrawal validation | Approve/Decline withdrawal requests', function () {
  let cid;
  let withdrawalId;
  const { secureCode } = config.default;
  let withdrawalAmount = 50;
  const depositAmount = 500;
  const superAdminBO = boUserData.getAdminBoDataForLogin(9, process.env.BRAND);
  const customer = customerData.getCustomerDepositor();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer Depositor', async function () {
    const customerRes = await customersHelper.waitTillCustomerCreated(agent, customer);
    cid = customerRes.cid;
  });

  it('Wait For Customer Trading Account Create', async function () {
    await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
  });

  it('Create Deposit and confirm Deposit', async function () {
    const depositRes = await preconditions.createDeposit(agent, { amount: depositAmount });
    await preconditions.confirmDeposit(agent, depositRes, secureCode);
  });

  it('Wait For Balance Is Transferred To Account', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await preconditions.waitForBalanceIsTransferredToAccount(agent, constants.MODE.REAL, depositAmount);
  });

  it('Create first withdrawal request', async function () {
    const res = await walletHelper.createWithdrawal(agent, withdrawalAmount);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('success');
  });

  it('Create second withdrawal request', async function () {
    const res = await walletHelper.createWithdrawal(agent, withdrawalAmount);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('success');
  });

  it('Login Bo Admin', async function () {
    let res = await boUserHelper.loginBoAdmin(agent, superAdminBO);

    expect(res.status).to.equal(200);
  });

  it('Wait For Withdrawal Status Change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
    await walletHelper.waitForWithdrawalStatusChange(agent, 'open');
    let dataRes = await boWalletHelper.getWithdrawals(agent, cid);
    withdrawalId = dataRes[0].id;
    withdrawalAmount = dataRes[0].requested_amount;
  });

  it('C18790 Approved Withdrawal check Capitalix', async function () {
    await boWalletHelper.approveWithdrawal(agent, cid, withdrawalId, withdrawalAmount);
    let dataRes1 = await boWalletHelper.getWithdrawals(agent, cid);
    withdrawalId = dataRes1[1].id;

    expect(dataRes1[1].status).to.equal('open');
  });

  it('C18795 Decline withdrawal request via NGBO', async function () {
    await boWalletHelper.declineWithdrawal(agent, cid, withdrawalId);

    let dataRes3 = await boWalletHelper.getWithdrawals(agent, cid);

    expect(dataRes3[1].status).to.equal('declined');
  });
});
