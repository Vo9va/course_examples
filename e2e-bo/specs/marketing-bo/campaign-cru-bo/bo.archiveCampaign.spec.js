import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boMarketingHelper from '../../../../test-utils/helpers/helpers-bo/bo.marketing.helper';
import boCommonData from '../../../../test-data/bo/bo.common.data';

describe('C19508 CRUD Campaign - archive Campaign', function () {
  let campaignId;
  let resCampaignUpdate;
  let resCreateCampaign;
  let campaignData = boCommonData.getCampaignData();
  const superAdminBO = boUserData.getAdminBoDataForLogin(13, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
  });

  it('Create Campaign', async function () {
    resCreateCampaign = await boMarketingHelper.createCampaign(agent, campaignData);
    campaignId = resCreateCampaign.body.id;

    expect(resCreateCampaign.statusCode).to.equal(200);
  });

  it('Archive Campaign', async function () {
    resCampaignUpdate = await boMarketingHelper.updateCampaignById(agent, campaignId, {
      status: 'archived',
      name: resCreateCampaign.body.name,
      brand_id: process.env.BRAND.toUpperCase(),
    });

    expect(resCampaignUpdate.statusCode).to.equal(200);
    expect(resCampaignUpdate.body.status).to.equal('archived');
  });

  it('Check archived campaigns list', async function () {
    let resCampaignsList = await boMarketingHelper.getCampaignsList(agent, 'archived');

    expect(resCampaignsList.statusCode).to.equal(200);
    expect(resCampaignsList.body.rows[0].id).to.equal(campaignId);
  });
});
