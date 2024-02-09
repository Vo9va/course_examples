import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import customerData from '../../../../test-data/ng/customer.data';
import errors from '../../../../test-data/ng/error.messages';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import constants from '../../../../test-data/constants';
import { brand } from '../../../../config';

describe('C18665 Wallet service | Deposit validation | Not verified Customer cannot create a deposit more than 1M', function () {
  const customer = customerData.getCustomerDepositor();

  before(async function () {
    brand !== 'Capitalix' && this.skip();
  });

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customer);
    await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
  });

  it('Not verified Customer cannot create a deposit more than 1M', async function () {
    const res = await walletHelper.createDeposit(agent, { amount: 1001000 });

    expect(res.statusCode).to.equal(400);
    expect(res.body.details.message).to.equal(errors.DEPOSIT_VALIDATION.amountThreshold);
  });
});
