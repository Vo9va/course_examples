import proxy from '../proxy.helper';
import config from '../../../config';
import reportPortalHelper from '../reportPortal.helper';
import sleep from '../sleep.helper';
import constants from '../../../test-data/constants';

export default {
  //** It's general Api call for closing positions */
  async closePositions(agent, cidsArray) {
    return await agent
      .put(`${config.default.boApiURL}/bo/positions/closeTest`)
      .proxy(proxy)
      .send({ cids: cidsArray })
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`bo.tradingHelper.closePositions res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`bo.tradingHelper.closePositions status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`bo.tradingHelper.closePositions err: ${JSON.stringify(err)}`);
      });
  },

  async getOrdersBO(agent, cid, accountId) {
    return await agent
      .get(`${config.default.boApiURL}/trading/bo/orders/${cid}?account_id=${accountId}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`bo.tradingHelper.getOrdersBO res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`bo.tradingHelper.getOrdersBO status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`bo.tradingHelper.getOrdersBO err: ${JSON.stringify(err)}`);
      });
  },

  async waitForOrderBOStatusChange(agent, cid, accountId, status) {
    let res;

    for (let i = 1; i <= 60; i++) {
      res = await this.getOrdersBO(agent, cid, accountId);
      if (res.body.rows[0].status_id !== status) {
        await reportPortalHelper.logInfo(`...wait for order status change to '${status}' for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if 'orderStatus' hasn't changed
    if (res.body.rows[0].status_id !== status) {
      throw new Error(`bo.tradingHelper.waitForOrderBOStatusChange: order status hasn't changed`);
    }
    return res;
  },
};
