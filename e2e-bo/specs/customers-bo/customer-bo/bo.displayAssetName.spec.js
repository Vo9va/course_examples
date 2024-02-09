import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import config, { env } from '../../../../config';

describe('C25503 User&Marketing - Display asset name', function () {
  let cid;
  const { nfsToken } = config.default;
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 11 : 5, process.env.BRAND);
  let customerLead = customerData.getCustomerLead({ marketing_info: { asset: 'AMAZON' } });

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer lead with asset', async function () {
    const resLeadCustomer = await customersHelper.createCustomerWithToken(agent, nfsToken, customerLead);
    cid = resLeadCustomer.body.customer.cid;

    expect(resLeadCustomer.statusCode).to.equal(200);
    expect(resLeadCustomer.body.customer.status_id).to.equal('active');

    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Check that customer customer has asset', async function () {
    const resCustomer = await boCustomerHelper.getCustomer(agent, cid);

    expect(resCustomer.status).to.equal(200);
    expect(resCustomer.body.customer.marketing_info.asset).to.equal('AMAZON');
  });
});
