import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import config from '../../../../config';

describe('C19499 Assign from customer search', function () {
  let cid;
  let cidSecondCustomer;
  let cidsArray = [];
  const { uids, teamId } = config.default;
  let customer = customerData.getCustomerDepositor();
  let secondCustomer = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(3, process.env.BRAND);
  const assignedAgent = boUserData.getAdminBoDataForLogin(23, process.env.BRAND, 'Sales_Agent', uids.salesAgent);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create first customer depositor', async function () {
    const res = await customersHelper.waitTillCustomerCreated(agent, customer);
    cid = res.cid;
  });

  it('Logout first customer', async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create second customer depositor', async function () {
    const resSecondCustomer = await customersHelper.waitTillCustomerCreated(agent, secondCustomer);
    cidSecondCustomer = resSecondCustomer.cid;
    cidsArray.push(cid, cidSecondCustomer);
  });

  it('Wait for the customers to be created', async function () {
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cidSecondCustomer);
  });

  it('Make multi assign', async function () {
    let uid = assignedAgent.uid;
    let resAssignToAgent = await boCustomerHelper.assignCustomerSales(agent, cidsArray, { uid });

    expect(resAssignToAgent.statusCode).to.equal(200);
  });

  it('Wait for customers assignments uid change', async function () {
    for (let value in cidsArray) {
      const resCustomer = await boCustomerHelper.waitForCustomerAssignmentUidChange(agent, cidsArray[value]);

      expect(resCustomer.status).to.equal(200);
      expect(resCustomer.body.customer.assignment.uid).to.equal(assignedAgent.uid);
      expect(resCustomer.body.customer.assignment.owner.name).to.equal(assignedAgent.name);
      expect(resCustomer.body.customer.assignment.team_id).to.equal(teamId);
    }
  });
});
