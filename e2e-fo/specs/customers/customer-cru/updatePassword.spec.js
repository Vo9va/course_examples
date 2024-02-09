import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import errors from '../../../../test-data/ng/error.messages';
import { brand, env } from '../../../../config';

describe('Customers service | Customer update password', function () {
  let customer = customerData.getCustomerLead();
  const passwords = {
    password: customerData.customerLead.password,
    new_password: '123456NewPass@',
  };
  let customerProd = customerData.getCustomerForLoginOnProd(10, brand);

  after(async function () {
    if (env === 'prod') {
      const res = await customersHelper.loginCustomer(agent, customerProd, {
        password: passwords.new_password,
      });
      expect(res.statusCode).to.equal(200);

      const res1 = await customersHelper.updatePassword(agent, {
        password: passwords.new_password,
        new_password: passwords.password,
      });
      expect(res1.statusCode).to.equal(200);
    }
    await customersHelper.logoutCustomer(agent);
  });

  if (env === 'prod') {
    it('Login with prod customer', async function () {
      const res = await customersHelper.loginCustomer(agent, customerProd);

      expect(res.statusCode).to.equal(200);
    });
  } else {
    it('Create Customer Lead', async function () {
      await customersHelper.waitTillCustomerCreated(agent, customer);
    });
  }

  it('C18760 Customer update password', async function () {
    const res = await customersHelper.updatePassword(agent, passwords);

    expect(res.statusCode).to.equal(200);
  });

  it('C17803 Customer login with new password', async function () {
    await preconditions.logoutCustomer(agent);
    const res = await customersHelper.loginCustomer(agent, env === 'prod' ? customerProd : customer, {
      password: passwords.new_password,
    });

    expect(res.statusCode).to.equal(200);
  });

  it('C17809 Customer logout', async function () {
    const res = await customersHelper.logoutCustomer(agent);

    expect(res.statusCode).to.equal(200);
  });

  it('C18761 Customer try to login with old password', async function () {
    const { password } = passwords;
    const res = await customersHelper.loginCustomer(agent, env === 'prod' ? customerProd : customer, { password });

    expect(res.body.statusCode).to.equal(403);
    expect(res.body.message).to.equal(errors.CUSTOMER_VALIDATION.emailIncorrect);
  });
});
