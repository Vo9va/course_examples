import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boCommonData from '../../../../test-data/bo/bo.common.data';
import moment from 'moment';
import { brand, env } from '../../../../config';

describe('C19634 Customer Search', function () {
  let customer = customerData.getCustomerLead();
  let cid;
  const superAdminBO = boUserData.getAdminBoDataForLogin(12, process.env.BRAND);
  let customerProd = customerData.getCustomerForLoginOnProd(27, brand);
  let affiliateId = '234234';
  let searchData;

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
      searchData = boCommonData.getCustomerSearchBody(cid);
      expect(res.statusCode).to.equal(200);
    });
  } else {
    it('Create customer depositor', async function () {
      const res = await customersHelper.waitTillCustomerCreated(agent, customer, { affiliate_id: affiliateId });
      cid = res.cid;
      await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
      searchData = boCommonData.getCustomerSearchBody(cid);
    });
  }

  it('Search by CID', async function () {
    const res = await boCustomerHelper.customerSearch(agent, searchData);

    expect(res.statusCode).to.equal(200);
    expect(res.body.rows[0].cid).to.equal(cid);
  });

  it('Update customer data -> "Compliance status"', async function () {
    const res = await boCustomerHelper.updateCustomerData(agent, cid, { compliance_status: 'call_back' });

    expect(res.statusCode).to.equal(200);
  });

  it('Search by CID and Compliance Date', async function () {
    const res = await boCustomerHelper.customerSearch(agent, searchData, { compliance_date_raw_value: 'TODAY' });

    expect(res.statusCode).to.equal(200);
    expect(res.body.rows[0].compliance_date).to.contain(moment().format('YYYY-MM-DD'));
  });

  it('Search by CID and Affiliate ID', async function () {
    const res = await boCustomerHelper.customerSearch(agent, searchData, { affiliate_id: [affiliateId] });

    expect(res.statusCode).to.equal(200);
    expect(res.body.rows[0].cid).to.equal(cid);
  });
});
