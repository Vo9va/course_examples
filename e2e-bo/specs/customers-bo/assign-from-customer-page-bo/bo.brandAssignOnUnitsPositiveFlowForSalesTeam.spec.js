import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import config, { brand, env } from '../../../../config';

describe('C25455 Assign from customer page - positive flow (Brand - Assign on Units) for Sales team', function () {
  let cid;
  const { teamId } = config.default;
  let customer = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 7 : 3, process.env.BRAND);
  let customerProd = customerData.getCustomerForLoginOnProd(16, brand);

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

  it('Assign customer in sales team', async function () {
    let resAssign = await boCustomerHelper.assignCustomerSales(agent, [cid], { team: teamId });

    expect(resAssign.statusCode).to.equal(200);

    const resCustomer = await boCustomerHelper.getCustomer(agent, cid);

    expect(resCustomer.status).to.equal(200);
    expect(resCustomer.body.customer.assignment.team_id).to.equal(teamId);
  });
});
