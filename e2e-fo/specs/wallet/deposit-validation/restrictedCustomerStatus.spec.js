import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import customerData from '../../../../test-data/ng/customer.data';
import errors from '../../../../test-data/ng/error.messages';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';

describe('C18638 Wallet service | Deposit validation | Restricted customer status', function () {
  const customer = customerData.getCustomerLead();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer lead', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customer);
  });

  it('Customer cannot create a deposit without all personal details filling', async function () {
    const res = await walletHelper.createDeposit(agent, { amount: 250 });

    expect(res.statusCode).to.equal(403);
    expect(res.body.details[1].message).to.equal(errors.DEPOSIT_VALIDATION.status);
  });
});
