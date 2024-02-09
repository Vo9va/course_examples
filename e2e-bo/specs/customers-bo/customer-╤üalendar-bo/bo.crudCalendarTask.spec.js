import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCalendarHelper from '../../../../test-utils/helpers/helpers-bo/bo.calendar.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import { brand, env } from '../../../../config';

describe('CRUD user Calendar Tasks', function () {
  let cid;
  let resTaskCreation;
  let customerLead = customerData.getCustomerLead();
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 13 : 4, process.env.BRAND);
  let customerProd = customerData.getCustomerForLoginOnProd(24, brand);

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
      const res = await customersHelper.waitTillCustomerCreated(agent, customerLead);
      cid = res.cid;
      await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
    });
  }

  it('C24822 User Calendar - Create Task', async function () {
    resTaskCreation = await boCalendarHelper.createCustomerCalendarEvent(agent, cid, { cid: cid });

    expect(resTaskCreation.statusCode).to.equal(200);
    expect(resTaskCreation.body.task.status).to.equal('active');
  });

  it('C25328 User Calendar - View task', async function () {
    let resTaskView = await boCalendarHelper.getCustomerCalendarEventsByRange(agent);

    expect(resTaskView.statusCode).to.equal(200);
    expect(resTaskView.body.count).not.equal(0);
  });

  it('C25326 User Calendar - Canceled Task', async function () {
    const resTaskClosure = await boCalendarHelper.updateTaskStatusToCanceled(agent, cid, resTaskCreation.body);

    expect(resTaskClosure.body.task.status).to.equal('canceled');
  });
});
