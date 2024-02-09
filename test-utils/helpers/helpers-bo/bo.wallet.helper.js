import config from '../../../config';
import constants from '../../../test-data/constants';
import proxy from '../proxy.helper';
import walletData from '../../../test-data/ng/common.data';
import walletDataBO from '../../../test-data/bo/bo.wallet.data';
import sleep from '../sleep.helper';
import reportPortalHelper from '../reportPortal.helper';

export default {
  /** Withdrawals update methods from BO */
  async getWithdrawals(agent, cid) {
    return await agent
      .get(`${config.default.boApiURL}/wallet/${cid}/withdrawals`)
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`boWalletHelper.getWithdrawals res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boWalletHelper.getWithdrawals status code error: ${JSON.stringify(res)}`);
        return res.body.withdrawal_requests;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.getWithdrawals error: ${err}`);
      });
  },

  async approveWithdrawal(agent, cid, withdrawalId, amount) {
    let data = { 4: [{ additional_amount: amount, transactions: [] }], note: 'test', reason_id: null };
    return await agent
      .put(`${config.default.boApiURL}/wallet/${cid}/withdrawals/${withdrawalId}/approve`)
      .send(data)
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`boWalletHelper.approveWithdrawal res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boWalletHelper.approveWithdrawal status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.approveWithdrawal error: ${err}`);
      });
  },

  async approveWithdrawalViaAnyMethodWithFee(agent, cid, withdrawalId, method) {
    return await agent
      .put(`${config.default.boApiURL}/wallet/${cid}/withdrawals/${withdrawalId}/approve`)
      .send(method)
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(
              `boWalletHelper.approveWithdrawalViaBTCMethodWithFee res: ${JSON.stringify(res.body)}`
            )
          : reportPortalHelper.logInfo(
              `boWalletHelper.approveWithdrawalViaBTCMethodWithFee status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.approveWithdrawalViaBTCMethodWithFee error: ${err}`);
      });
  },

  async declineWithdrawal(agent, cid, withdrawalId) {
    return await agent
      .put(`${config.default.boApiURL}/wallet/${cid}/withdrawals/${withdrawalId}`)
      .send(walletData.withdrawalDecline)
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`boWalletHelper.declineWithdrawal res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boWalletHelper.declineWithdrawal status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.declineWithdrawal error: ${err}`);
      });
  },

  async deleteWithdrawal(agent, cid, params = {}) {
    return await agent
      .post(`${config.default.boApiURL}/wallet/${cid}/withdrawals/delete`)
      .proxy(proxy)
      .send({ ...walletData.transactionDelete, ...params })
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`boWalletHelper.deleteWithdrawal res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boWalletHelper.deleteWithdrawal status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.deleteWithdrawal error: ${err}`);
      });
  },

  async waitForWithdrawalDataChange(agent, cid) {
    let res;
    for (let i = 1; i <= 50; i++) {
      res = await this.getWithdrawals(agent, cid);
      if (res[0] === undefined) {
        await reportPortalHelper.logInfo(`...wait for withdrawal data change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the withdrawal data hasn't changed
    if (res[0] === undefined) {
      throw new Error(`boWalletHelper.waitForWithdrawalDataChange: withdrawal data hasn't changed`);
    }
    return res;
  },

  async waitForWithdrawalMtIdChange(agent, cid) {
    let res;
    for (let i = 1; i <= 60; i++) {
      res = await this.getWithdrawals(agent, cid);
      if (res[0].mt_id === null) {
        await reportPortalHelper.logInfo(`...wait for withdrawal 'mt_id' change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else return res;
    }
    // throw an error if the withdrawal 'mt_id' hasn't changed
    if (res[0].mt_id === null) {
      throw new Error(`boWalletHelper.waitForWithdrawalMtIdChange: withdrawal 'mt_id' hasn't changed`);
    }
    return res;
  },

  async getWithdrawalsByCid(agent, cid) {
    return agent
      .get(`${config.default.boApiURL}/bo/${cid}/withdrawal-requests?is_test=true`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`walletHelper.getWithdrawalsByCid res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`walletHelper.getWithdrawalsByCid status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`walletHelper.getWithdrawalsByCid err: ${JSON.stringify(err)}`);
      });
  },

  /** Deposit from BO */
  async createDeposit(agent, cid, params = {}) {
    return await agent
      .post(`${config.default.boApiURL}/wallet/${cid}/deposit`)
      .proxy(proxy)
      .send({ ...walletData.deposit, ...params })
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`boWalletHelper.createDeposit res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boWalletHelper.createDeposit status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.createDeposit error: ${err}`);
      });
  },

  async confirmDeposit(agent, url, secureCode) {
    return await agent
      .post(`${url}&secure_code=${secureCode}`)
      .proxy(proxy)
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`boWalletHelper.confirmDeposit res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boWalletHelper.confirmDeposit status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.confirmDeposit error: ${err}`);
      });
  },

  /** Transactions BO */
  async deleteTransaction(agent, cid, params = {}) {
    return await agent
      .post(`${config.default.boApiURL}/wallet/${cid}/transactions/delete`)
      .proxy(proxy)
      .send({ ...walletData.transactionDelete, ...params })
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`boWalletHelper.deleteTransaction res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boWalletHelper.deleteTransaction status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.deleteTransaction error: ${err}`);
      });
  },

  async getTransactions(agent, cid, url = '?is_test=true') {
    return await agent
      .get(`${config.default.boApiURL}/bo/${cid}/transactions/${url}`)
      .proxy(proxy)
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`boWalletHelper.getTransactions res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boWalletHelper.getTransactions status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.getTransactions error: ${err}`);
      });
  },

  async waitForGetTransactionsLength(agent, cid, rowsLength) {
    let res;
    let customerRowsLength;
    for (let i = 1; i <= 60; i++) {
      res = await this.getTransactions(agent, cid);
      customerRowsLength = res.body.rows.length;
      if (customerRowsLength !== rowsLength) {
        await reportPortalHelper.logInfo(`...wait for rows length change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else {
        return res;
      }
    }
    if (customerRowsLength <= rowsLength) {
      throw new Error(`boCustomerHelper.waitForGetTransactionsLength: 
      return length should be greater than "${customerRowsLength}"`);
    }
    return res;
  },

  async waitForTransactionStatusChange(agent, cid, status, idTransaction) {
    let res;
    let transactionStatus;
    for (let i = 1; i <= 20; i++) {
      res = await this.getTransactions(agent, cid);
      const rows = res.body.rows;
      transactionStatus = rows.find((row) => row.id === idTransaction).status;
      if (transactionStatus !== status) {
        await reportPortalHelper.logInfo(
          `...wait for transaction status change to '${status}' for ${i * 500} millise,conds`
        );
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else return res;
    }
    // throw an error if the transaction status hasn't changed
    if (transactionStatus !== status) {
      throw new Error(`boWalletHelper.waitForTransactionStatusChange: transaction status hasn't changed`);
    }
    return res;
  },

  async waitForTransactionsCountChange(agent, cid, url, countExpected) {
    let res;
    for (let i = 1; i <= 60; i++) {
      res = await this.getTransactions(agent, cid, url);
      if (res.body.count !== countExpected) {
        await reportPortalHelper.logInfo(`...wait for transactions count change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the transactions count hasn't changed
    if (res.body.count !== countExpected) {
      throw new Error(`boWalletHelper.waitForTransactionsCountChange: transactions count hasn't changed`);
    }
    return res;
  },

  async waitForTransactionMtIdChange(agent, cid) {
    let res;
    for (let i = 1; i <= 90; i++) {
      res = await this.getTransactions(agent, cid);
      if (res.body.count === 0 || res.body.rows[1] === undefined || res.body.rows[1].mt_id === null) {
        await reportPortalHelper.logInfo(`...wait for transaction 'mt_id' change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else return res;
    }
    // throw an error if the transaction 'mt_id' hasn't changed
    if (res.body.rows[1].mt_id === null) {
      throw new Error(`boWalletHelper.waitForTransactionMtIdChange: transaction 'mt_id' hasn't changed`);
    }
    return res;
  },

  async getOperationTransactions(agent, url = '') {
    return await agent
      .get(`${config.default.boApiURL}/bo/transactions?_sort=created_at&_order=DESC&is_test=true${url}`)
      .proxy(proxy)
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`boWalletHelper.getOperationTransactions res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `boWalletHelper.getOperationTransactions status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.getOperationTransactions error: ${err}`);
      });
  },

  /** Balance Adjustment BO */
  async createBalanceAdjustment(agent, cid, params = {}) {
    return await agent
      .post(`${config.default.boApiURL}/wallet/${cid}/transactions/deposit-adjustment`)
      .proxy(proxy)
      .send({ ...walletDataBO.balanceAdjustment, ...params })
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(
              `boWalletHelper.createBalanceAdjustment res: ${JSON.stringify(res.body)} = ${params.processor_name}`
            )
          : reportPortalHelper.logInfo(`boWalletHelper.createBalanceAdjustment status error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.createBalanceAdjustment err: ${JSON.stringify(err)}`);
      });
  },

  async createBalanceAdjustmentViaPnl(agent, cid, params = {}) {
    return await agent
      .post(`${config.default.boApiURL}/wallet/${cid}/transactions/adjustment`)
      .proxy(proxy)
      .send({ ...walletDataBO.balanceAdjustmentViaPnl, ...params })
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`boWalletHelper.createBalanceAdjustmentViaPnl res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `boWalletHelper.createBalanceAdjustmentViaPnl status error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.createBalanceAdjustmentViaPnl err: ${JSON.stringify(err)}`);
      });
  },

  async createBalanceAdjustmentDeductFundsViaChb(agent, cid, params = {}) {
    return await agent
      .post(`${config.default.boApiURL}/wallet/${cid}/transactions/chargeback`)
      .proxy(proxy)
      .send({ ...walletDataBO.balanceAdjustmentDeductFundsViaChb, ...params })
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(
              `boWalletHelper.createBalanceAdjustmentDeductFundsViaChb res: ${JSON.stringify(res.body)}`
            )
          : reportPortalHelper.logInfo(
              `boWalletHelper.createBalanceAdjustmentDeductFundsViaChb status error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(
          `boWalletHelper.createBalanceAdjustmentDeductFundsViaChb err: ${JSON.stringify(err)}`
        );
      });
  },

  /** Luv Brand BO */
  async getBanksList(agent, brandId) {
    return await agent
      .get(`${config.default.boApiURL}/luv/brand/banks_list?brand_id=${brandId}`)
      .proxy(proxy)
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`boWalletHelper.getBanksList res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boWalletHelper.getBanksList status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boWalletHelper.getBanksList error: ${err}`);
      });
  },
};
