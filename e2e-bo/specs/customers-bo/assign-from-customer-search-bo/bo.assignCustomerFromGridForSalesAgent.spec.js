import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import config from '../../../../config';

describe('C19498 Assign from customer search - assignment customers from grid', function () {
  let cid;
  const { uids, teamId } = config.default;
  let customer = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(3, process.env.BRAND);
  const assignedAgent = boUserData.getAdminBoDataForLogin(23, process.env.BRAND, 'Sales_Agent', uids.salesAgent);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    const res = await customersHelper.waitTillCustomerCreated(agent, customer);
    cid = res.cid;
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Make assign with filters', async function () {
    let uid = assignedAgent.uid;
    let resAssignToAgent = await boCustomerHelper.assignCustomerWithFilters(agent, {
      uid,
      filters: {
        cid: cid,
        full_name: customer.first_name + ' ' + customer.last_name,
      },
    });

    expect(resAssignToAgent.statusCode).to.equal(200);
  });

  it('Check customer assigned information', async function () {
    const resCustomer = await boCustomerHelper.waitForCustomerAssignmentUidChange(agent, cid);

    expect(resCustomer.status).to.equal(200);
    expect(resCustomer.body.customer.assignment.uid).to.equal(assignedAgent.uid);
    expect(resCustomer.body.customer.assignment.owner.name).to.equal(assignedAgent.name);
    expect(resCustomer.body.customer.assignment.team_id).to.equal(teamId);
  });
});
