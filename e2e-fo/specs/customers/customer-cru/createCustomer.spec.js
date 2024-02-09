import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';

describe('C17801 Customers service | Create Customer', function () {
  let customer = customerData.getCustomerLead();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer', async function () {
    const customerBody = await customersHelper.waitTillCustomerCreated(agent, customer);

    expect(customerBody).to.exist;
    expect(customerBody.first_name).to.equal(customer.first_name);
    expect(customerBody.last_name).to.equal(customer.last_name);
    expect(customerBody.email).to.equal(customer.email);
    expect(customerBody).to.have.property('mobile');
  });
});
