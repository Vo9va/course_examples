import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import { brand, env } from '../../../../config';

describe('C22442 Customers service | Update Customer', function () {
  let customerLead = customerData.getCustomerLead();
  let customerProd = customerData.getCustomerForLoginOnProd(13, brand);
  let customerFirstName = customerData.getRandomName(12);

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  if (env === 'prod') {
    it('Login with prod customer', async function () {
      const res = await customersHelper.loginCustomer(agent, customerProd);

      expect(res.statusCode).to.equal(200);
    });
  } else {
    it('Create Customer Lead', async function () {
      await customersHelper.waitTillCustomerCreated(agent, customerLead);
    });
  }

  it('Update Customer', async function () {
    const res = await customersHelper.updateCustomer(agent, {
      first_name: customerFirstName,
    });

    const customerBody = res.body.customer;

    expect(res.statusCode).to.equal(200);
    expect(customerBody.first_name).to.equal(customerFirstName);
  });
});
