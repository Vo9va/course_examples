import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import config, { env } from '../../../../config';

describe('C25451 Assign from customer page - positive flow (Brand - Assign on Agent) for Sales team', function () {
  let cid;
  const { uids, deskId, departmentId, teamId } = config.default;
  let customer = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 7 : 3, process.env.BRAND);
  const assignedAgent = boUserData.getAdminBoDataForLogin(23, process.env.BRAND, 'Sales_Agent', uids.salesAgent);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    let res = await customersHelper.waitTillCustomerCreated(agent, customer);
    cid = res.cid;
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Assign in sales team', async function () {
    let uid = assignedAgent.uid;
    let resAssign = await boCustomerHelper.assignCustomerSales(agent, [cid], { uid });

    expect(resAssign.statusCode).to.equal(200);
  });

  it('Wait that customer Assignment uid change', async function () {
    const resCustomer = await boCustomerHelper.waitForCustomerAssignmentUidChange(agent, cid);

    expect(resCustomer.status).to.equal(200);
    expect(resCustomer.body.customer.assignment.uid).to.equal(assignedAgent.uid);
  });

  it('Check customer assigned information', async function () {
    const resCustomer = await boCustomerHelper.getCustomer(agent, cid);

    expect(resCustomer.status).to.equal(200);
    expect(resCustomer.body.customer.assignment.owner.name).to.equal(assignedAgent.name);
    expect(resCustomer.body.customer.assignment.desk_id).to.equal(deskId);
    expect(resCustomer.body.customer.assignment.department_id).to.equal(departmentId);
    expect(resCustomer.body.customer.assignment.team_id).to.equal(teamId);
  });
});
