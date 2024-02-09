import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import errors from '../../../../test-data/ng/error.messages';

describe('Customers service | Customer login validation', function () {
  let customer = customerData.getCustomerLead();

  it('C18469 Customer login with invalid email', async function () {
    const res = await customersHelper.loginCustomer(agent, customer, { email: 'mail@@net.net' });

    expect(res.statusCode).to.equal(403);
    expect(res.body.message).to.equal(errors.CUSTOMER_VALIDATION.emailIncorrect);
  });

  it('C18467 Customer login with empty email', async function () {
    const res = await customersHelper.loginCustomer(agent, customer, { email: '' });

    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.equal(errors.CUSTOMER_VALIDATION.emailEmpty);
  });

  it('C18468 Customer login with empty password', async function () {
    const res = await customersHelper.loginCustomer(agent, customer, { password: '' });

    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.equal(errors.CUSTOMER_VALIDATION.passwordEmpty);
  });
});
