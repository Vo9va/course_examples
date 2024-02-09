import reportPortalHelper from '../reportPortal.helper';
import proxy from '../proxy.helper';
import config from '../../../config';

export default {
  /** Popular symbols */
  async getPopularSymbols(agent) {
    return await agent
      .get(`${config.default.apiURL}/history/popular-symbols`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`historyHelper.getPopularSymbols res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`historyHelper.getPopularSymbols status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`historyHelper.getPopularSymbols err: ${JSON.stringify(err)}`);
      });
  },

  /** Sentiments */
  async getSentiments(agent) {
    return await agent
      .get(`${config.default.apiURL}/history/sentiments`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`historyHelper.getSentiments res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`historyHelper.getSentiments status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`historyHelper.getSentiments err: ${JSON.stringify(err)}`);
      });
  },

  /** Bars */
  async getBars(agent, symbol, barsInterval) {
    return await agent
      .get(`${config.default.apiURL}/history/bars?symbol=${symbol}&interval=${barsInterval}&count=10`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`historyHelper.getBars res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`historyHelper.getBars status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`historyHelper.getBars err: ${JSON.stringify(err)}`);
      });
  },

  /** Top movers */
  async getTopMovers(agent, brand) {
    return await agent
      .get(`${config.default.apiURL}/history/top-movers?brand_id=${brand}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`historyHelper.getTopMovers res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`historyHelper.getTopMovers status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`historyHelper.getTopMovers err: ${JSON.stringify(err)}`);
      });
  },

  /** Trading symbols */
  async getTrendingSymbols(agent) {
    return await agent
      .get(`${config.default.apiURL}/history/trending-symbols`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`historyHelper.getTrendingSymbols res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`historyHelper.getTrendingSymbols status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`historyHelper.getTrendingSymbols err: ${JSON.stringify(err)}`);
      });
  },
};
