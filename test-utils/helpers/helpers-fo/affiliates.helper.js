import reportPortalHelper from '../../helpers/reportPortal.helper';
import proxy from '../proxy.helper';
import config from '../../../config';
import sleep from '../sleep.helper';
import constants from '../../../test-data/constants';

export default {
  async getAffiliatesCustomerData(agent, token, cid) {
    return await agent
      .get(`${config.default.apiURL}/affiliates/registrations?cid=${cid}`)
      .proxy(proxy)
      .set(token)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`affiliatesHelper.getAffiliatesCustomerData res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `affiliatesHelper.getAffiliatesCustomerData status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`affiliatesHelper.getAffiliatesCustomerData err: ${JSON.stringify(err)}`);
      });
  },

  async waitForAffiliatesCustomerData(agent, token, cid) {
    let res;
    for (let i = 1; i <= 10; i++) {
      res = await this.getAffiliatesCustomerData(agent, token, cid);
      if (res.body === undefined || res.body.length === 0) {
        await reportPortalHelper.logInfo(`...wait for affiliates customer data not empty for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }

    // throw an error if affiliates customer data is empty
    if (res.body === undefined || res.body.length === 0) {
      throw new Error(`affiliatesHelper.waitForAffiliatesCustomerData: affiliates customer data is empty`);
    }
    return res;
  },

  async getAffiliatesTransactionsData(agent, token, filters) {
    return agent
      .get(`${config.default.apiURL}/affiliates/transactions${filters}`)
      .proxy(proxy)
      .set(token)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(
              `affiliatesHelper.getAffiliatesTransactionsData res: ${JSON.stringify(res.body)}`
            )
          : reportPortalHelper.logInfo(
              `affiliatesHelper.getAffiliatesTransactionsData status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`affiliatesHelper.getAffiliatesTransactionsData err: ${JSON.stringify(err)}`);
      });
  },

  async getAffiliatesRegistrationsData(agent, token, filters) {
    return agent
      .get(`${config.default.apiURL}/affiliates/registrations${filters}`)
      .proxy(proxy)
      .set(token)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(
              `affiliatesHelper.getAffiliatesRegistrationsData res: ${JSON.stringify(res.body)}`
            )
          : reportPortalHelper.logInfo(
              `affiliatesHelper.getAffiliatesRegistrationsData status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`affiliatesHelper.getAffiliatesRegistrationsData err: ${JSON.stringify(err)}`);
      });
  },
};
