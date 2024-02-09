import proxy from '../proxy.helper';
import config from '../../../config';
import reportPortalHelper from '../reportPortal.helper';

export default {
  async createBusinessUnits(agent, businessUnitData) {
    return await agent
      .post(`${config.default.boApiURL}/bo/business-units`)
      .send(businessUnitData)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boManagementHelper.createBusinessUnits res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `boManagementHelper.createBusinessUnits status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boManagementHelper.createBusinessUnits err: ${JSON.stringify(err)}`);
      });
  },

  async createMarkets(agent, marketsData) {
    return await agent
      .post(`${config.default.boApiURL}/bo/markets`)
      .send(marketsData)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boManagementHelper.createMarkets res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boManagementHelper.createMarkets status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boManagementHelper.createMarkets err: ${JSON.stringify(err)}`);
      });
  },

  async createUnits(agent, unitsData) {
    return await agent
      .post(`${config.default.boApiURL}/bo/units`)
      .send(unitsData)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boManagementHelper.createUnits res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boManagementHelper.createUnits status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boManagementHelper.createUnits err: ${JSON.stringify(err)}`);
      });
  },

  async createGroups(agent, groupsData) {
    return await agent
      .post(`${config.default.boApiURL}/bo/groups`)
      .send(groupsData)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boManagementHelper.createGroups res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boManagementHelper.createGroups status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boManagementHelper.createGroups err: ${JSON.stringify(err)}`);
      });
  },
};
