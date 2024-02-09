import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import { brand, env } from '../../../../config';

describe('C19562 Sales/Compliance status & Marketing - Change Sales status', function () {
  let customer = customerData.getCustomerLead();
  let cid;
  const superAdminBO = boUserData.getAdminBoDataForLogin(12, process.env.BRAND);
  let customerProd = customerData.getCustomerForLoginOnProd(15, brand);
  let newSalesStatusId;
  let testSalesStatusId;

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

  it('Get sales statuses', async function () {
    const res = await boCustomerHelper.getSalesStatuses(agent);

    newSalesStatusId = await boCustomerHelper.searchIdSalesStatus(res.body.sales_statuses, 'New');
    testSalesStatusId = await boCustomerHelper.searchIdSalesStatus(res.body.sales_statuses, 'Test');

    expect(res.statusCode).to.equal(200);
  });

  it('Update customer data -> "Sales status"', async function () {
    const res = await boCustomerHelper.updateCustomerSalesStatus(agent, cid, { sales_status_id: newSalesStatusId });

    expect(res.statusCode).to.equal(200);
  });

  it('Check that sales status updated successfuly', async function () {
    const res = await boCustomerHelper.getCustomer(agent, cid);

    expect(res.statusCode).to.equal(200);
    expect(res.body.customer.sales_status_id).to.equal(newSalesStatusId);
  });

  it('Revert Update customer data -> "Sales status"', async function () {
    const res = await boCustomerHelper.updateCustomerSalesStatus(agent, cid, { sales_status_id: testSalesStatusId });

    expect(res.statusCode).to.equal(200);
  });

  it('Check that sales status updated successfuly', async function () {
    const res = await boCustomerHelper.getCustomer(agent, cid);

    expect(res.statusCode).to.equal(200);
    expect(res.body.customer.sales_status_id).to.equal(testSalesStatusId);
  });
});
