import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import config from '../../../../config';

describe('C18793 Wallet service | Withdrawal validation | More that 1 "open" withdrawal request', function () {
  const depositAmount = 500;
  const withdrawalAmount = 50;
  const { secureCode } = config.default;
  const customer = customerData.getCustomerDepositor();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer Depositor', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customer);
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
    await preconditions.createWithdrawal(agent, withdrawalAmount);
  });

  it('Create second withdrawal request', async function () {
    const res = await walletHelper.createWithdrawal(agent, withdrawalAmount);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('success');
  });
});
