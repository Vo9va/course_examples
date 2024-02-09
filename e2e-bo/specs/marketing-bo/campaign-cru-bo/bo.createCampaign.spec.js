import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boMarketingHelper from '../../../../test-utils/helpers/helpers-bo/bo.marketing.helper';
import boCommonData from '../../../../test-data/bo/bo.common.data';

describe('C8810 CRUD Campaign - create Campaign', function () {
  let campaignId;
  let campaignName;
  let resCampaignUpdate;
  let campaignData = boCommonData.getCampaignData();
  const superAdminBO = boUserData.getAdminBoDataForLogin(13, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
  });

  it('Create Campaign - unique name', async function () {
    let resCreateCampaign = await boMarketingHelper.createCampaign(agent, campaignData);
    campaignName = resCreateCampaign.body.name;
    campaignId = resCreateCampaign.body.id;

    expect(resCreateCampaign.statusCode).to.equal(200);
    expect(resCreateCampaign.body.status).to.equal('active');
  });

  it('Get Campaign with unique name by id', async function () {
    let res = await boMarketingHelper.getCampaignById(agent, campaignId);

    expect(res.statusCode).to.equal(200);
    expect(res.body.name).to.equal(campaignName);
    expect(res.body.id).to.equal(campaignId);
  });

  it('Check active campaigns list', async function () {
    let resCampaignsList = await boMarketingHelper.getCampaignsList(agent, 'active');

    expect(resCampaignsList.statusCode).to.equal(200);
    expect(resCampaignsList.body.rows[0].id).to.equal(campaignId);
    expect(resCampaignsList.body.rows[0].name).to.equal(campaignName);
  });

  it('Create Campaign - not unique name', async function () {
    let resNotUniqueName = await boMarketingHelper.createCampaign(agent, campaignData, { name: campaignName });

    expect(resNotUniqueName.statusCode).to.equal(400);
    expect(resNotUniqueName.body.message).to.contain('name must be unique');
  });

  it('Archive Campaign', async function () {
    resCampaignUpdate = await boMarketingHelper.updateCampaignById(agent, campaignId, {
      status: 'archived',
      name: campaignName,
      brand_id: process.env.BRAND.toUpperCase(),
    });

    expect(resCampaignUpdate.statusCode).to.equal(200);
  });
});
