import config from '../../../config';
import constants from '../../../test-data/constants';
import proxy from '../proxy.helper';
import sleep from '../sleep.helper';
import reportPortalHelper from '../reportPortal.helper';

export default {
  /** Account */
  getCustomerTradingAccount(agent, mode) {
    const mapFrontModeToBackend = {
      [constants.MODE.REAL]: 'live',
      [constants.MODE.DEMO]: 'demo',
    };
    return agent
      .get(`${config.default.apiURL}/trading/accounts`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`tradingHelper.getCustomerTradingAccount res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `tradingHelper.getCustomerTradingAccount status code error: ${JSON.stringify(res)}`
            );
        const accounts = res.body.accounts;
        return accounts.find((account) => account.mode === mapFrontModeToBackend[mode]);
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`tradingHelper.getCustomerTradingAccount err: ${JSON.stringify(err)}`);
      });
  },

  async waitForCustomerTradingAccountChange(agent, mode, id) {
    let account;
    for (let i = 1; i <= 18; i++) {
      account = await this.getCustomerTradingAccount(agent, mode);
      if (account.group_id !== id) {
        await reportPortalHelper.logInfo(`...wait for trading account change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the 'account.group_id' hasn't changed
    if (account.group_id !== id) {
      throw new Error(`tradingHelper.waitForCustomerTradingAccountChange: account.group_id hasn't changed to '${id}'`);
    }
    return account;
  },

  async getCustomerTradingBalance(agent, mode) {
    const account = await this.getCustomerTradingAccount(agent, mode);
    await reportPortalHelper.logInfo(`getCustomerTradingBalance: ${account.balance}`);
    return account.balance;
  },

  async waitForTradingBalanceChange(agent, mode, amount) {
    let balance;

    for (let i = 1; i <= 120; i++) {
      balance = await this.getCustomerTradingBalance(agent, mode);

      if (balance !== amount) {
        await reportPortalHelper.logInfo(`...wait for trading balance change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the 'balance' hasn't changed
    if (balance !== amount) {
      throw new Error(`tradingHelper.waitForTradingBalanceChange: balance hasn't changed`);
    }

    return balance;
  },

  async setCustomerTradingAccount(agent, customerTradingAccount, params = {}) {
    const request = { ...customerTradingAccount, ...params };
    return await agent
      .put(`${config.default.apiURL}/customers/trading-account`)
      .proxy(proxy)
      .send(request)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.setCustomerTradingAccount res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `customersHelper.setCustomerTradingAccount status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.setCustomerTradingAccount err: ${JSON.stringify(err)}`);
      });
  },

  async waitForCustomerTradingAccountCreate(agent, mode) {
    let account;

    for (let i = 1; i <= 10; i++) {
      account = await this.getCustomerTradingAccount(agent, mode);
      if (account === undefined || account.length === 0) {
        await reportPortalHelper.logInfo(`...wait for customer trading account create for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if customer trading account hasn't changed
    if (account === undefined || account.length === 0) {
      throw new Error(`tradingHelper.waitForCustomerTradingAccountCreate: customer trading account hasn't changed`);
    }
    return account;
  },

  async isValueInRange(value1, value2) {
    let deviationMin = value1 * 0.95;
    let deviationMax = value1 * 1.05;
    return value2 >= deviationMin && value2 <= deviationMax;
  },

  /** Favorite Symbols */
  async getFavoriteSymbols(agent) {
    return await agent
      .get(`${config.default.apiURL}/trading/symbols/favorites`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`tradingHelper.getFavoriteSymbols res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`tradingHelper.getFavoriteSymbols status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`tradingHelper.getFavoriteSymbols err: ${JSON.stringify(err)}`);
      });
  },

  async addSymbolToFavorite(agent, symbolId) {
    return await agent
      .post(`${config.default.apiURL}/trading/symbols/favorites`)
      .proxy(proxy)
      .send({ symbol_id: `${symbolId}` })
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`tradingHelper.addSymbolToFavorite res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`tradingHelper.addSymbolToFavorite status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`tradingHelper.addSymbolToFavorite err: ${JSON.stringify(err)}`);
      });
  },

  async removeSymbolFromFavorites(agent, symbolId) {
    return await agent
      .delete(`${config.default.apiURL}/trading/symbols/favorites`)
      .proxy(proxy)
      .send({ symbol_id: `${symbolId}` })
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`tradingHelper.removeSymbolFromFavorites res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `tradingHelper.removeSymbolFromFavorites status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`tradingHelper.removeSymbolFromFavorites err: ${JSON.stringify(err)}`);
      });
  },

  /** Orders */
  async createOrder(agent, orderBody) {
    return await agent
      .post(`${config.default.apiURL}/trading/orders`)
      .proxy(proxy)
      .send(orderBody)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`tradingHelper.createOrder res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`tradingHelper.createOrder status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`tradingHelper.createOrder err: ${JSON.stringify(err)}`);
      });
  },

  async getOrders(agent) {
    return await agent
      .get(`${config.default.apiURL}/trading/orders`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`tradingHelper.getOrders res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`tradingHelper.getOrders status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`tradingHelper.getOrders err: ${JSON.stringify(err)}`);
      });
  },

  async deleteOrder(agent, orderId) {
    return await agent
      .delete(`${config.default.apiURL}/trading/orders/${orderId}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`tradingHelper.deleteOrder res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`tradingHelper.deleteOrder status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`tradingHelper.deleteOrder err: ${JSON.stringify(err)}`);
      });
  },

  async updateOrder(agent, orderId, orderBody, params = {}) {
    const request = { ...orderBody, ...params };
    return agent
      .put(`${config.default.apiURL}/trading/orders/${orderId}`)
      .proxy(proxy)
      .send(request)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`tradingHelper.updateOrder res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`tradingHelper.updateOrder status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`tradingHelper.updateOrder err: ${JSON.stringify(err)}`);
      });
  },

  async waitForOrderStatusChange(agent, status, orderType, ordersLength) {
    let res;

    for (let i = 1; i <= 70; i++) {
      res = await this.getOrders(agent);
      if (
        res.body.orders.length <= ordersLength ||
        res.body.orders.find((order) => order.type_id === orderType).status_id !== status
      ) {
        await reportPortalHelper.logInfo(`...wait for order status change to '${status}' for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if 'orderStatus' hasn't changed
    if (res.body.orders.find((order) => order.type_id === orderType).status_id !== status) {
      throw new Error(`tradingHelper.waitForOrderStatusChange: order status hasn't changed`);
    }
    return res;
  },

  async waitForOrderStatusChangeById(agent, status, orderId) {
    let res;

    for (let i = 1; i <= 70; i++) {
      res = await this.getOrders(agent);

      if (res.body.orders.find((row) => row.id === orderId && row.status_id !== status)) {
        await reportPortalHelper.logInfo(`...wait for order status change to '${status}' for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }

    // throw an error if 'orderStatus' hasn't changed
    if (res.body.orders.find((row) => row.id === orderId && row.status_id !== status)) {
      throw new Error(`tradingHelper.waitForOrderStatusChangeById: order status hasn't changed`);
    }
    return res;
  },

  async waitForOrderPriceTpChange(agent, priceTp) {
    let res;

    for (let i = 0; i <= 10; i++) {
      res = await this.getOrders(agent);

      if (res.body.orders[0].price_tp !== priceTp) {
        await reportPortalHelper.logInfo(`...wait for price_tp change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    if (res.body.orders[0].price_tp !== priceTp) {
      throw new Error(`price_tl should be changed to ${priceTp}`);
    }

    return res;
  },

  /** Positions */
  async getPositions(agent) {
    return await agent
      .get(`${config.default.apiURL}/trading/positions`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`tradingHelper.getPositions res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`tradingHelper.getPositions status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`tradingHelper.getPositions err: ${JSON.stringify(err)}`);
      });
  },

  async waitForPositionStatusChange(agent, status) {
    let res;
    for (let i = 1; i <= 20; i++) {
      res = await this.getPositions(agent);
      if (res.body.positions.length === 0 || res.body.positions[0].status !== status) {
        await reportPortalHelper.logInfo(
          `...wait for position status change to '${status}' for ${i * 500} milliseconds`
        );
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if 'status' hasn't changed
    if (res.body.positions[0].status !== status) {
      throw new Error(`tradingHelper.waitForPositionStatusChange: position status hasn't changed to '${status}'`);
    }
    return res;
  },

  async waitForPositionStatusChangeById(agent, status, positionId) {
    let res;

    for (let i = 1; i <= 70; i++) {
      res = await this.getPositions(agent);

      if (res.body.positions.find((row) => row.id === positionId && row.status !== status)) {
        await reportPortalHelper.logInfo(
          `...wait for position status change to '${status}' for ${i * 500} milliseconds`
        );
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }

    // throw an error if 'orderStatus' hasn't changed
    if (res.body.positions.find((row) => row.id === positionId && row.status !== status)) {
      throw new Error(`tradingHelper.waitForPositionStatusChangeById: position status hasn't changed`);
    }
    return res;
  },

  async waitForPositionPriceTpChange(agent, priceTp) {
    let res;

    for (let i = 0; i <= 10; i++) {
      res = await this.getPositions(agent);
      if (res.body.positions[0].price_tp !== priceTp) {
        await reportPortalHelper.logInfo(`...wait for price_tp change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    if (res.body.positions[0].price_tp !== priceTp) {
      throw new Error(`price_tl should be changed to ${priceTp}`);
    }

    return res;
  },

  async closePosition(agent, positionId) {
    return await agent
      .post(`${config.default.apiURL}/trading/positions/${positionId}/close`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`tradingHelper.closePosition res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`tradingHelper.closePosition status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`tradingHelper.closePosition err: ${JSON.stringify(err)}`);
      });
  },

  async updatePosition(agent, positionId, data) {
    return await agent
      .put(`${config.default.apiURL}/trading/positions/${positionId}`)
      .proxy(proxy)
      .send(data)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`tradingHelper.updatePosition res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`tradingHelper.updatePosition status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`tradingHelper.updatePosition err: ${JSON.stringify(err)}`);
      });
  },

  async waitForPositionUpdate(agent) {
    let res;
    for (let i = 1; i <= 10; i++) {
      res = await this.getPositions(agent);
      if (
        res.body.positions.length === 0 ||
        res.body.positions[0].invested === 0 ||
        res.body.positions[0].current_value === 0
      ) {
        await reportPortalHelper.logInfo(`...wait for position update for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if position hasn't updated
    if (res.body.positions[0].invested === 0) {
      throw new Error(`tradingHelper.waitForPositionUpdate: position hasn't updated`);
    }
    return res;
  },
};
