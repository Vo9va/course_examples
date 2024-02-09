import proxy from '../proxy.helper';
import config from '../../../config';
import reportPortalHelper from '../reportPortal.helper';

export default {
  async createLeadsHubRule(agent, leadsHubRuleData) {
    return await agent
      .post(`${config.default.boApiURL}/bo/leadshub/rules`)
      .send(leadsHubRuleData)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boLeadsHubHelper.createLeadsHubRule res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boLeadsHubHelper.createLeadsHubRule status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boLeadsHubHelper.createLeadsHubRule err: ${JSON.stringify(err)}`);
      });
  },

  async updateLeadsHubRuleById(agent, id, leadsHubRuleDataForUpdate) {
    return await agent
      .put(`${config.default.boApiURL}/bo/leadshub/rules/${id}`)
      .send(leadsHubRuleDataForUpdate)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boLeadsHubHelper.updateLeadsHubRuleById res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boLeadsHubHelper.updateLeadsHubRuleById status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boLeadsHubHelper.updateLeadsHubRuleById err: ${JSON.stringify(err)}`);
      });
  },

  async getLeadsHubRuleById(agent, id) {
    return await agent
      .get(`${config.default.boApiURL}/bo/leadshub/rules/${id}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boLeadsHubHelper.getLeadsHubRuleById res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boLeadsHubHelper.getLeadsHubRuleById status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boLeadsHubHelper.getLeadsHubRuleById err: ${JSON.stringify(err)}`);
      });
  },

  async getLeadsHubRuleList(agent) {
    return await agent
      .get(`${config.default.boApiURL}/bo/leadshub/rules?_sort=created_at&_order=DESC&_page=1&_limit=10`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boLeadsHubHelper.getLeadsHubRuleList res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boLeadsHubHelper.getLeadsHubRuleList status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boLeadsHubHelper.getLeadsHubRuleList err: ${JSON.stringify(err)}`);
      });
  },

  async deleteLeadsHubRuleById(agent, id) {
    return await agent
      .delete(`${config.default.boApiURL}/bo/leadshub/rules/${id}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boLeadsHubHelper.deleteLeadsHubRuleById res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boLeadsHubHelper.deleteLeadsHubRuleById status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boLeadsHubHelper.deleteLeadsHubRuleById err: ${JSON.stringify(err)}`);
      });
  },
};
