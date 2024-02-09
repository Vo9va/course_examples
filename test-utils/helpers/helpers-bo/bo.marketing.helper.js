import proxy from '../proxy.helper';
import config from '../../../config';
import reportPortalHelper from '../reportPortal.helper';

export default {
  async createCampaign(agent, campaignData, params = {}) {
    return await agent
      .post(`${config.default.boApiURL}/bo/campaigns`)
      .send({ ...campaignData, ...params })
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boMarketingHelper.createCampaign res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boMarketingHelper.createCampaign status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boMarketingHelper.createCampaign err: ${JSON.stringify(err)}`);
      });
  },

  async getCampaignsList(agent, status) {
    return await agent
      .get(`${config.default.boApiURL}/bo/campaigns?_sort=created_at&_order=DESC&status=${status}&_page=1&_limit=10`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boMarketingHelper.getCampaignsList res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boMarketingHelper.getCampaignsList status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boMarketingHelper.getCampaignsList err: ${JSON.stringify(err)}`);
      });
  },

  async updateCampaignById(agent, id, campaignDataForUpdate) {
    return await agent
      .put(`${config.default.boApiURL}/bo/campaigns/${id}`)
      .send(campaignDataForUpdate)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boMarketingHelper.updateCampaignById res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boMarketingHelper.updateCampaignById status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boMarketingHelper.updateCampaignById err: ${JSON.stringify(err)}`);
      });
  },

  async getCampaignById(agent, id) {
    return agent
      .get(`${config.default.boApiURL}/bo/campaigns/${id}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boMarketingHelper.getCampaignById res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boMarketingHelper.getCampaignById status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boMarketingHelper.getCampaignById err: ${JSON.stringify(err)}`);
      });
  },
};
