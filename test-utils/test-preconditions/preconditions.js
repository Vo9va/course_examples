import { expect } from 'chai';
import constants from '../../test-data/constants';
import customersHelper from '../helpers/helpers-fo/customers.helper';
import walletHelper from '../helpers/helpers-fo/wallet.helper';
import tradingHelper from '../helpers/helpers-fo/trading.helper';
import boUserHelper from '../helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../helpers/helpers-bo/bo.customer.helper';
import reportPortalHelper from '../helpers/reportPortal.helper';

export default {
  /** Customer */
  async putOnboardingAnswers(agent) {
    try {
      const res = await customersHelper.putOnboardingAnswers(agent);
      expect(res.statusCode).to.equal(200);
    } catch (e) {
      throw new Error(`preconditions.putOnboardingAnswers error: ${e}`);
    }
  },

  async uploadCustomerDocuments(agent) {
    try {
      const resPassport = await customersHelper.uploadDocumentToDB(agent, constants.DOCUMENT.PASSPORT);
      expect(resPassport.statusCode).to.equal(200);

      const resPOR = await customersHelper.uploadDocumentToDB(agent, constants.DOCUMENT.PROOF_OF_RESIDENCE);

      expect(resPOR.statusCode).to.equal(200);
    } catch (e) {
      throw new Error(`preconditions.uploadCustomerDocuments error: ${e}`);
    }
  },

  async logoutCustomer(agent) {
    try {
      const res = await customersHelper.logoutCustomer(agent);
      expect(res.statusCode).to.equal(200);
    } catch (e) {
      throw new Error(`preconditions.logoutCustomer error: ${e}`);
    }
  },

  /** Wallet */
  async createDeposit(agent, params = {}) {
    try {
      const depositRes = await walletHelper.createDeposit(agent, params);
      expect(depositRes.statusCode).to.equal(200);
      expect(depositRes.body.proceedRequestParams).to.have.property('url');
      return depositRes;
    } catch (e) {
      throw new Error(`preconditions.createDeposit error: ${e}`);
    }
  },

  async confirmDeposit(agent, depositResponse, secureCode) {
    try {
      const confirmUrl = depositResponse.body.proceedRequestParams.url;
      const confirmRes = await walletHelper.confirmDeposit(agent, confirmUrl, secureCode);
      expect(confirmRes.statusCode).to.equal(200);

      await walletHelper.waitForDepositTransactionStatusChange(agent, 'approved');
    } catch (e) {
      throw new Error(`preconditions.confirmDeposit error: ${e}`);
    }
  },

  async waitForBalanceIsTransferredToAccount(agent, mode, depositAmount) {
    try {
      await tradingHelper.waitForTradingBalanceChange(agent, mode, depositAmount);

      const res = await tradingHelper.getCustomerTradingBalance(agent, mode);
      expect(res).to.equal(depositAmount);
    } catch (e) {
      throw new Error(`preconditions.waitForBalanceIsTransferredToAccount error: ${e}`);
    }
  },

  async createWithdrawal(agent, withdrawalAmount) {
    try {
      const res = await walletHelper.createWithdrawal(agent, withdrawalAmount);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property('success');
    } catch (e) {
      throw new Error(`preconditions.createWithdrawal error: ${e}`);
    }
  },

  /** Back office */
  async approveCustomerDocumentsViaBO(agent, adminBO) {
    try {
      const res = await boUserHelper.loginBoAdmin(agent, adminBO);
      expect(res.status).to.equal(200);

      await boCustomerHelper.approveCustomerDocuments(agent);
    } catch (e) {
      throw new Error(`preconditions.approveCustomerDocumentsViaBO error: ${e}`);
    }
  },

  /** General flow methods */
  async createVerifiedTrader(agent, customer, adminBO) {
    try {
      await customersHelper.waitTillCustomerCreated(agent, customer);
      await this.putOnboardingAnswers(agent);
      await this.uploadCustomerDocuments(agent);
      await this.approveCustomerDocumentsViaBO(agent, adminBO);
    } catch (err) {
      await reportPortalHelper.logInfo(`preconditions.createVerifiedTrader error: ${err}`);
    }
  },

  async createAndConfirmDeposit(agent, secureCode) {
    const depositRes = await this.createDeposit(agent);
    await this.confirmDeposit(agent, depositRes, secureCode);
  },
};
