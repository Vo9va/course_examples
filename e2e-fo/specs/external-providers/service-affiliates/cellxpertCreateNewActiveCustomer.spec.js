import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import affiliatesHelper from '../../../../test-utils/helpers/helpers-fo/affiliates.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import config, { env, brand } from '../../../../config';

describe('C19776 Cellxpert: Create a new active customer', function () {
  let cid;
  const { cellxpertToken } = config.default;
  let customer = customerData.getCustomerLead();
  let superAdminBO =
    env === 'prod'
      ? boUserData.getAdminBoDataForLogin(1, process.env.BRAND)
      : boUserData.getAdminBoDataForLogin(16, process.env.BRAND);

  before(async function () {
    const excludedBrands = ['NRDX', 'TradeEU', 'WC1'];
    if (excludedBrands.includes(brand)) this.skip();
  });

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer with Cellxpert token and check response structure', async function () {
    const res = await customersHelper.createCustomerWithToken(agent, cellxpertToken, customer, {
      affiliate_id: 'test_affiliate_id',
    });
    cid = res.body.customer.cid;

    expect(res.statusCode).to.equal(200);
    expect(res.body.customer.email).to.equal(customer.email);
    expect(res.body.customer.brand_id).to.equal(customer.brand_id);
    expect(res.body.customer.country_id).to.equal(customer.country_id);
    expect(res.body.customer.status_id).to.equal('active');
    expect(res.body.customer.trading_status_id).to.equal('lead');
    expect(res.body.customer.regulation).to.exist;
    expect(res.body.customer.created_at).to.exist;
  });

  it('Check "affiliates.customers" table data', async function () {
    const resAffiliates = await affiliatesHelper.waitForAffiliatesCustomerData(agent, cellxpertToken, cid);

    expect(resAffiliates.statusCode).to.equal(200);
    expect(resAffiliates.body[0].status).to.equal('active');
    expect(resAffiliates.body[0].brand_id).to.equal(customer.brand_id);
    expect(resAffiliates.body[0].affiliate_id).to.equal('test_affiliate_id');
  });

  it('Check "customers.customers" table data', async function () {
    await customersHelper.loginCustomer(agent, customer);
    const resCustomer = await customersHelper.getCurrentCustomer(agent);

    expect(resCustomer.status_id).to.equal('active');
    expect(resCustomer.brand_id).to.equal(customer.brand_id);
  });

  it('Check "back_office.customers" table data', async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
    const resCustomerBo = await boCustomerHelper.getCustomer(agent, cid, '?extra_attr=registration_source');

    expect(resCustomerBo.statusCode).to.equal(200);
    // TODO change to 'cellxpert' after fixed TL-12397
    expect(resCustomerBo.body.customer.registration_source).to.equal('cellexpert');
  });
});
