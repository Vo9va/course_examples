import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import walletData from '../../../../test-data/ng/common.data';
import config from '../../../../config';

describe('C22444 Wallet service | Withdrawal read', function () {
  let customer = customerData.getCustomerDepositor();
  const { secureCode } = config.default;

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer Depositor', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customer);
    await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
  });

  it('Create And Confirm Deposit', async function () {
    await preconditions.createAndConfirmDeposit(agent, secureCode);
  });

  it('Wait For Trading Balance Change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await tradingHelper.waitForTradingBalanceChange(agent, constants.MODE.REAL, walletData.deposit.amount);
  });

  it('Wait until the balance is transferred to the account', async function () {
    const res = await tradingHelper.getCustomerTradingBalance(agent, constants.MODE.REAL);

    expect(res).to.equal(walletData.deposit.amount);
  });
});
