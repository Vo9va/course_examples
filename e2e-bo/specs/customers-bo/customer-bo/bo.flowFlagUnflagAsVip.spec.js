import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import { brand, env } from '../../../../config';

describe('C19559 Customer Flow (Quicktions) - Flag/Unflag as VIP', function () {
  let cid;
  let customerLead = customerData.getCustomerLead();
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 11 : 5, process.env.BRAND);
  let customerProd = customerData.getCustomerForLoginOnProd(23, brand);

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

  it('Flag customer as VIP and wait for status change', async function () {
    const res = await boCustomerHelper.setCustomerIsVip(agent, cid, { is_vip: true });

    expect(res.status).to.equal(200);

    await boCustomerHelper.waitForCustomerIsVipStatusChange(agent, cid, true);
  });

  it('Unflag customer as VIP and wait for status change', async function () {
    const res = await boCustomerHelper.setCustomerIsVip(agent, cid, { is_vip: false });

    expect(res.status).to.equal(200);

    await boCustomerHelper.waitForCustomerIsVipStatusChange(agent, cid, false);
  });
});
