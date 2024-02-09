import { expect } from 'chai';
import customerData from '../../../../test-data/ng/customer.data';
import agent from '../../../../test-utils/helpers/agent.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import config, { brand, env } from '../../../../config';

describe('C19500 Assign from customer search - reassign from Agent to Unit for Sales team', function () {
  let cid;
  const { uids, teamId } = config.default;
  let customer = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 7 : 3, process.env.BRAND);
  const assignedAgent = boUserData.getAdminBoDataForLogin(23, process.env.BRAND, 'Sales_Agent', uids.salesAgent);
  let customerProd = customerData.getCustomerForLoginOnProd(17, brand);

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

  it('Assign to sales agent ', async function () {
    let uid = assignedAgent.uid;
    let resAssignToAgent = await boCustomerHelper.assignCustomerSales(agent, [cid], { uid });

    expect(resAssignToAgent.statusCode).to.equal(200);

    const resCustomer = await boCustomerHelper.waitForCustomerAssignmentUidChange(agent, cid);

    expect(resCustomer.status).to.equal(200);
    expect(resCustomer.body.customer.assignment.uid).to.equal(assignedAgent.uid);
    expect(resCustomer.body.customer.assignment.owner.name).to.equal(assignedAgent.name);
    expect(resCustomer.body.customer.assignment.team_id).to.equal(teamId);
  });

  it('Reassign from Agent to Unit', async function () {
    let resAssignToUnit = await boCustomerHelper.assignCustomerSales(agent, [cid], { team: teamId });

    expect(resAssignToUnit.statusCode).to.equal(200);

    const resCustomerAfterReassign = await boCustomerHelper.getCustomer(agent, cid);

    expect(resCustomerAfterReassign.status).to.equal(200);
    expect(resCustomerAfterReassign.body.customer.assignment.team_id).to.equal(teamId);
    expect(resCustomerAfterReassign.body.customer.assignment.owner).to.equal(null);
  });
});
