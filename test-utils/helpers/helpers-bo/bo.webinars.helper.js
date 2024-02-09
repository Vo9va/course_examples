import proxy from '../proxy.helper';
import reportPortalHelper from '../reportPortal.helper';
import config from '../../../config';

export default {
  async createWebinar(agent, webinarData) {
    return agent
      .post(`${config.default.boApiURL}/webinars/bo`)
      .send(webinarData)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boWebinarsHelper.createWebinar res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boWebinarsHelper.createWebinar status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWebinarsHelper.createWebinar error: ${err}`);
      });
  },

  async getWebinarRooms(agent) {
    return agent
      .get(`${config.default.boApiURL}/webinars/bo/rooms`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boWebinarsHelper.getWebinarRooms res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boWebinarsHelper.getWebinarRooms status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWebinarsHelper.getWebinarRooms err: ${JSON.stringify(err)}`);
      });
  },

  async getWebinarsByDate(agent, date, brandId) {
    return agent
      .get(`${config.default.boApiURL}/webinars/bo?start_date=${date}&brand_id=${brandId}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boWebinarsHelper.getWebinarsByDate res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boWebinarsHelper.getWebinarsByDate status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWebinarsHelper.getWebinarsByDate err: ${JSON.stringify(err)}`);
      });
  },

  async getWebinarInvitation(agent, webinarId) {
    return agent
      .get(`${config.default.boApiURL}/webinars/bo/${webinarId}/invitation`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boWebinarsHelper.getWebinarInvitation res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boWebinarsHelper.getWebinarInvitation status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWebinarsHelper.getWebinarInvitation err: ${JSON.stringify(err)}`);
      });
  },

  async deleteWebinarById(agent, webinarId) {
    return agent
      .put(`${config.default.boApiURL}/webinars/${webinarId}/remove`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boWebinarsHelper.deleteWebinarById res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boWebinarsHelper.deleteWebinarById status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWebinarsHelper.deleteWebinarById error: ${err}`);
      });
  },
};
