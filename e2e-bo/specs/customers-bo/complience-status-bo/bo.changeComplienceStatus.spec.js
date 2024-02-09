import { expect } from 'chai';
import customerData from '../../../../test-data/ng/customer.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import agent from '../../../../test-utils/helpers/agent.helper';
import { brand, env } from '../../../../config';

describe('C19563 Sales/Compliance status & Marketing - Change Compliance Status', function () {
  let customer = customerData.getCustomerLead();
  let cid;
  const superAdminBO = boUserData.getAdminBoDataForLogin(12, process.env.BRAND);
  let customerProd = customerData.getCustomerForLoginOnProd(18, brand);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  if (env === 'prod') {
    it('Login with prod customer', async function () {
      const res = await customersHelper.loginCustomer(agent, customerProd);
      cid = res.body.customer.cid;
      expect(res.statusCode).to.equal(200);
    });
  } else {
    it('Create customer depositor', async function () {
      const res = await customersHelper.waitTillCustomerCreated(agent, customer);
      cid = res.cid;
      await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
    });
  }

  it('Update customer data -> "Compliance status"', async function () {
    const res = await boCustomerHelper.updateCustomerData(agent, cid, { compliance_status: 'call_back' });

    expect(res.statusCode).to.equal(200);
  });

  it('Check that compliance status updated successfuly', async function () {
    const res = await boCustomerHelper.getCustomer(agent, cid);

    expect(res.statusCode).to.equal(200);
    expect(res.body.customer.compliance_status).to.equal('call_back');
  });
});
