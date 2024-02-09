import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import common from '../../../../test-data/ng/common.data';
import config, { env } from '../../../../config';

describe('C25657 Marked as "Returned" - when the customer was already a draft', function () {
  let cid;
  let dateCreated;
  const { nfsToken, campaignId } = config.default;
  let customerDraft = customerData.getCustomerDraft();
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 12 : 6, process.env.BRAND);
  const marketingParameters = common.marketingParametersAfterFirstRegistration;
  const updateMarketingParameters = common.marketingParametersAfterSecondRegistration;

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create draft customer with marketing parameters', async function () {
    const resDraftCustomer = await customersHelper.createCustomerWithToken(agent, nfsToken, {
      ...customerDraft,
      marketing_info: marketingParameters,
      campaign_id: campaignId,
    });
    cid = resDraftCustomer.body.customer.cid;
    dateCreated = resDraftCustomer.body.customer.created_at;

    expect(resDraftCustomer.statusCode).to.equal(200);
    expect(resDraftCustomer.body.customer.status_id).to.equal('draft');

    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Get customer info after registration', async function () {
    let res = await boCustomerHelper.getCustomer(agent, cid);

    expect(res.body.customer.campaign_id).to.equal(Number(campaignId));
    expect(marketingParameters.url).to.equal(res.body.customer.landing_page.url);
  });

  it('Re-registration customer', async function () {
    let customerDraftDuplicate = { ...customerDraft, marketing_info: updateMarketingParameters };
    let resDraftCustomerDuplicate = await customersHelper.createCustomerWithToken(
      agent,
      nfsToken,
      customerDraftDuplicate
    );
    const newDateCreated = resDraftCustomerDuplicate.body.customer.created_at;

    expect(resDraftCustomerDuplicate.statusCode).to.equal(200);
    expect(resDraftCustomerDuplicate.body.customer.status_id).to.equal('draft');
    expect(dateCreated).not.to.equal(newDateCreated);

    await boCustomerHelper.waitForCustomerReturningStatusChanged(agent, cid, 'without_ftd');
  });

  it('Get customer info after re-registration', async function () {
    let res = await boCustomerHelper.getCustomer(agent, cid);

    expect(res.statusCode).to.equal(200);
    expect(res.body.customer.returning_status).to.equal('without_ftd');
    expect(res.body.customer.campaign_id).to.equal(Number(campaignId));
    expect(res.body.customer.landing_page.url).to.equal(updateMarketingParameters.url);
    expect(res.body.customer.marketing_info.AdID).to.equal(updateMarketingParameters.AdID);
    expect(res.body.customer.marketing_info.subc).to.equal(updateMarketingParameters.subc);
    expect(res.body.customer.marketing_info.asset).to.equal(updateMarketingParameters.asset);
  });
});
