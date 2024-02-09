import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import common from '../../../../test-data/ng/common.data';
import customerData from '../../../../test-data/ng/customer.data';
import config, { env } from '../../../../config';

describe('C25658 Update data if the customer already has a return tag', function () {
  let cid;
  let newDateCreated;
  const { nfsToken, campaignId } = config.default;
  const customerDraft = customerData.getCustomerDraft();
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 12 : 6, process.env.BRAND);
  const marketingParameters = common.marketingParametersAfterFirstRegistration;

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('draft customer with nfs token and marketing parameters', async function () {
    const resDraftCustomer = await customersHelper.createCustomerWithToken(agent, nfsToken, {
      ...customerDraft,
      marketing_info: marketingParameters,
      campaign_id: campaignId,
    });

    expect(resDraftCustomer.statusCode).to.equal(200);
    expect(resDraftCustomer.body.customer.status_id).to.equal('draft');
  });

  it('Create draft customer with the same email but with nfs token and marketing parameters', async function () {
    const resDraftCustomerDuplicate = await customersHelper.createCustomerWithToken(agent, nfsToken, {
      ...customerDraft,
      marketing_info: marketingParameters,
    });
    cid = resDraftCustomerDuplicate.body.customer.cid;
    newDateCreated = resDraftCustomerDuplicate.body.customer.created_at;

    expect(resDraftCustomerDuplicate.statusCode).to.equal(200);
    expect(resDraftCustomerDuplicate.body.customer.status_id).to.equal('draft');
  });

  it('Wait for customer landing page url change', async function () {
    await boCustomerHelper.waitForCustomerLandingPageUrlChange(agent, cid, marketingParameters.url);
  });

  it('Get customer info after re-registration', async function () {
    let res = await boCustomerHelper.getCustomer(agent, cid);
    let dateReRegistrationCustomer = res.headers.date;

    expect(res.body.customer.returning_status).to.equal('without_ftd');
    expect(res.body.customer.campaign_id).to.equal(Number(campaignId));
    expect(res.body.customer.landing_page.url).to.equal(marketingParameters.url);
    expect(res.body.customer.marketing_info.AdID).to.equal(marketingParameters.AdID);
    expect(res.body.customer.marketing_info.subc).to.equal(marketingParameters.subc);
    expect(res.body.customer.marketing_info.asset).to.equal(marketingParameters.asset);
    expect(dateReRegistrationCustomer).not.to.equal(newDateCreated);
  });
});
