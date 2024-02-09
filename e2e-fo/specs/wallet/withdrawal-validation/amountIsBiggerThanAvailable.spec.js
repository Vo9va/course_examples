import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import config from '../../../../config';

describe('C22305 Wallet service | Withdrawal validation | Amount is bigger than "available"', function () {
  const depositAmount = 500;
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

  it('Customer cannot create withdrawal when amount is bigger than "available"', async function () {
    const res = await walletHelper.createWithdrawal(agent, 501);

    expect(res.statusCode).to.equal(400);
    expect(res.body.details.code).to.equal('invalid_amount');
    expect(res.body.details.message).to.equal('Withdrawal amount greater than available balance');
  });
});
