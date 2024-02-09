import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import constants from '../../../../test-data/constants';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';

describe('C25676 Closing Account for Customer with pending deposit', function () {
  let customerDepositor = customerData.getCustomerDepositor();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customerDepositor);
    await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
  });

  it('Create pending Deposit', async function () {
    await preconditions.createDeposit(agent);
    await walletHelper.waitForDepositTransactionStatusChange(agent, 'pending');
  });

  it('Close Customer account', async function () {
    const resCloseAccount = await customersHelper.closeCustomerAccount(agent);

    expect(resCloseAccount.statusCode).to.equal(403);
    expect(resCloseAccount.body.message).to.equal('Customer has pending deposits');
  });
});
