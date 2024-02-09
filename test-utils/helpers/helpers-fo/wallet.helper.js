import walletData from '../../../test-data/ng/common.data';
import constants from '../../../test-data/constants';
import reportPortalHelper from '../reportPortal.helper';
import proxy from '../proxy.helper';
import tradingHelper from '../../helpers/helpers-fo/trading.helper';
import sleep from '../sleep.helper';
import config from '../../../config';

export default {
  /** Deposit */
  async createDeposit(agent, params = {}) {
    return await agent
      .post(`${config.default.apiURL}/wallet/deposit`)
      .proxy(proxy)
      .send({ ...walletData.deposit, ...params })
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`walletHelper.createDeposit res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`walletHelper.createDeposit status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`walletHelper.createDeposit err: ${JSON.stringify(err)}`);
      });
  },

  async confirmDeposit(agent, url, secureCode) {
    return await agent
      .post(`${url}&secure_code=${secureCode}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`walletHelper.confirmDeposit res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`walletHelper.confirmDeposit status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`walletHelper.confirmDeposit err: ${JSON.stringify(err)}`);
      });
  },

  /** Withdrawal */
  async createWithdrawal(agent, amount) {
    return await agent
      .post(`${config.default.apiURL}/wallet/withdrawals`)
      .proxy(proxy)
      .send({ amount: amount })
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`walletHelper.createWithdrawal res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`walletHelper.createWithdrawal status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`walletHelper.createWithdrawal err: ${JSON.stringify(err)}`);
      });
  },

  async getWithdrawals(agent) {
    return await agent
      .get(`${config.default.apiURL}/wallet/withdrawals`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`walletHelper.getWithdrawals res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`walletHelper.getWithdrawals status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`walletHelper.getWithdrawals err: ${JSON.stringify(err)}`);
      });
  },

  async updateWithdrawal(agent, withdrawalID) {
    return await agent
      .put(`${config.default.apiURL}/wallet/withdrawals/${withdrawalID}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`walletHelper.updateWithdrawal res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`walletHelper.updateWithdrawal status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`walletHelper.updateWithdrawal err: ${JSON.stringify(err)}`);
      });
  },

  async waitForWithdrawalStatusChange(agent, status) {
    let res;
    for (let i = 1; i <= 5; i++) {
      res = await this.getWithdrawals(agent);
      if (res.body.withdrawal_requests[0] === undefined || res.body.withdrawal_requests[0].status !== status) {
        await reportPortalHelper.logInfo(
          `...wait for withdrawal status change to '${status}' for ${i * 500} milliseconds`
        );
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the withdrawal status hasn't changed
    if (res.body.withdrawal_requests[0] === undefined || res.body.withdrawal_requests[0].status !== status) {
      throw new Error(`walletHelper.waitForWithdrawalStatusChange: withdrawal status hasn't changed to '${status}'`);
    }
    return res;
  },

  /** Transactions */
  async getTransactions(agent) {
    return await agent
      .get(`${config.default.apiURL}/wallet/transactions`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`walletHelper.getTransactions res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`walletHelper.getTransactions status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`walletHelper.getTransactions err: ${JSON.stringify(err)}`);
      });
  },

  async waitForDepositTransactionStatusChange(agent, status) {
    let res;
    for (let i = 1; i <= 5; i++) {
      res = await this.getTransactions(agent);
      if (res.body.transactions[0].status !== status) {
        await reportPortalHelper.logInfo(
          `...wait for transaction status change to '${status}' for ${i * 500} milliseconds`
        );
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the transaction status hasn't changed
    if (res.body.transactions[0].status !== status) {
      throw new Error(
        `walletHelper.waitForDepositTransactionStatusChange: transaction status hasn't changed to '${status}'`
      );
    }
    return res;
  },

  /** Balance */
  async getBalance(agent) {
    return await agent
      .get(`${config.default.apiURL}/wallet/balance`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`walletHelper.getBalance res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`walletHelper.getBalance status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`walletHelper.getBalance err: ${JSON.stringify(err)}`);
      });
  },

  async waitForBalanceChange(agent, mode, amount) {
    let res;

    for (let i = 1; i <= 120; i++) {
      res = await tradingHelper.waitForCustomerTradingAccountCreate(agent, mode);
      if (res.balance !== amount) {
        await reportPortalHelper.logInfo(`...wait for customer balance change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the balance hasn't changed
    if (res.balance !== amount) {
      throw new Error(`walletHelper.waitForBalanceChange: balance hasn't changed`);
    }
    return res;
  },
};
