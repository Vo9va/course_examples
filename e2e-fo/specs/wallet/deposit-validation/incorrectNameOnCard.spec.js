import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import customerData from '../../../../test-data/ng/customer.data';
import errors from '../../../../test-data/ng/error.messages';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';

describe('C19648 Wallet service | Deposit validation | Incorrect name on card', function () {
  const customer = customerData.getCustomerDepositor();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customer);
  });

  it('Customer cannot create a deposit with incorrect name on card ', async function () {
    const res = await walletHelper.createDeposit(agent, { name_on_card: '123456' });

    expect(res.statusCode).to.equal(400);
    expect(res.body.details.message).to.equal(errors.DEPOSIT_VALIDATION.cardName);
  });
});
