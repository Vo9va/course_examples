import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import customerData from '../../../../test-data/ng/customer.data';
import errors from '../../../../test-data/ng/error.messages';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';

describe('C21801 Wallet service | Deposit validation | Amount is lower that $100', function () {
  const customer = customerData.getCustomerDepositor();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customer);
  });

  it('Customer cannot create a deposit which is lower than $1', async function () {
    const res = await walletHelper.createDeposit(agent, { amount: 0.004 });

    expect(res.statusCode).to.equal(400);
    expect(res.body.details.message).to.equal(errors.DEPOSIT_VALIDATION.amountMin);
    expect(res.body.details.property).to.equal('amount');
  });
});
