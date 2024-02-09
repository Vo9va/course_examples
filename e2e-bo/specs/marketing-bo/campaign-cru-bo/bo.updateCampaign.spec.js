import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boMarketingHelper from '../../../../test-utils/helpers/helpers-bo/bo.marketing.helper';
import boCommonData from '../../../../test-data/bo/bo.common.data';

describe('C19507 CRUD Campaign - update Campaign', function () {
  let campaignId;
  let resCampaignUpdate;
  let nameUpdated;
  let crmNameUpdated;
  let campaignData = boCommonData.getCampaignData();
  const superAdminBO = boUserData.getAdminBoDataForLogin(13, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
  });

  it('Create Campaign', async function () {
    nameUpdated = `Updated ${campaignData.name}`;
    crmNameUpdated = `Updated ${campaignData.crm_name}`;

    let resCreateCampaign = await boMarketingHelper.createCampaign(agent, campaignData);
    campaignId = resCreateCampaign.body.id;

    expect(resCreateCampaign.statusCode).to.equal(200);
  });

  it('Update Campaign', async function () {
    resCampaignUpdate = await boMarketingHelper.updateCampaignById(agent, campaignId, {
      name: nameUpdated,
      crm_name: crmNameUpdated,
      brand_id: process.env.BRAND.toUpperCase(),
    });

    expect(resCampaignUpdate.statusCode).to.equal(200);
    expect(resCampaignUpdate.body.id).to.equal(campaignId);
    expect(resCampaignUpdate.body.name).to.equal(nameUpdated);
    expect(resCampaignUpdate.body.crm_name).to.equal(crmNameUpdated);
  });

  it('Archive Campaign', async function () {
    resCampaignUpdate = await boMarketingHelper.updateCampaignById(agent, campaignId, {
      status: 'archived',
      name: nameUpdated,
      brand_id: process.env.BRAND.toUpperCase(),
    });

    expect(resCampaignUpdate.statusCode).to.equal(200);
  });
});
