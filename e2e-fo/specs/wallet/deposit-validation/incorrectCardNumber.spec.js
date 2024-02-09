import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import customerData from '../../../../test-data/ng/customer.data';
import errors from '../../../../test-data/ng/error.messages';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';

describe('C18661 Wallet service | Deposit validation | Incorrect card number', function () {
  const customer = customerData.getCustomerDepositor();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer Depositor', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customer);
  });

  it('Customer cannot create a deposit with incorrect card number', async function () {
    const res = await walletHelper.createDeposit(agent, { card_number: 9999001037490014 });

    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.equal(errors.DEPOSIT_VALIDATION.cardNumber);
    expect(res.body.details.property).to.equal('card_number');
  });
});
