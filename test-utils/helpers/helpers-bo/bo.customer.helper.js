import proxy from '../proxy.helper';
import { expect } from 'chai';
import sleep from '../sleep.helper';
import path from 'path';
import fs from 'fs';
import request from 'request';
import config from '../../../config';
import constants from '../../../test-data/constants';
import reportPortalHelper from '../reportPortal.helper';
import customerHelper from '../helpers-fo/customers.helper';
import customerDataBO from '../../../test-data/bo/bo.customer.data';

export default {
  /** Customers from BO */
  async searchCustomer(agent, email) {
    return agent
      .get(`${config.default.boApiURL}/bo/customers/quick_search/${email}`)
      .proxy(proxy)
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.searchCustomer user uid: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boCustomerHelper.searchCustomer status error: ${JSON.stringify(res)}`);
        return res.body;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.searchCustomer error: ${JSON.stringify(err)}`);
      });
  },

  async getCustomer(agent, cid, url = '') {
    return await agent
      .get(`${config.default.boApiURL}/bo/customers/${cid}${url}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.getCustomer res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boCustomerHelper.getCustomer status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.getCustomer err: ${JSON.stringify(err)}`);
      });
  },

  async waitForCustomerCampaignIdChanged(agent, cid, expectCampaignId) {
    let res;
    let customerCampaignId;
    for (let i = 1; i <= 10; i++) {
      res = await this.getCustomer(agent, cid);
      customerCampaignId = res.body.customer.campaign_id;
      if (customerCampaignId !== expectCampaignId) {
        await reportPortalHelper.logInfo(`...wait for customer campaign_id change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else {
        return res;
      }
    }
    if (customerCampaignId !== expectCampaignId) {
      throw new Error(
        `boCustomerHelper.waitForCustomerCampaignIdChanged: campaign id hasn't changed to ${expectCampaignId}`
      );
    }
    return res;
  },

  async waitForCustomerReturningStatusChanged(agent, cid, expectReturningStatus) {
    let res;
    let customerStatus;
    for (let i = 1; i <= 10; i++) {
      res = await this.getCustomer(agent, cid);
      customerStatus = res.body.customer.returning_status;
      if (customerStatus !== expectReturningStatus) {
        await reportPortalHelper.logInfo(`...wait for customer returning_status change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else {
        return res;
      }
    }
    if (customerStatus !== expectReturningStatus) {
      throw new Error(
        `boCustomerHelper.waitForCustomerCampaignIdChanged: returning Status hasn't changed to ${expectReturningStatus}`
      );
    }
    return res;
  },

  async waitForCustomerLandingPageUrlChange(agent, cid, expectUrl) {
    let res;
    for (let i = 1; i <= 10; i++) {
      res = await this.getCustomer(agent, cid);
      if (res.body.customer === undefined || res.body.customer.landing_page.url !== expectUrl) {
        await reportPortalHelper.logInfo(`...wait for customer 'landing_page.url' changed for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the customer 'landing_page.url' hasn't changed
    if (res.body.customer.landing_page.url !== expectUrl) {
      throw new Error(
        `boCustomersHelper.waitForCustomerLandingPageUrlChange: customer 'landing_page.url' hasn't changed`
      );
    }
    return res;
  },

  async waitForCustomerIsTestStatusChange(agent, cid, status) {
    let res;
    for (let i = 1; i <= 9; i++) {
      res = await this.getCustomer(agent, cid);
      if (res.body.customer.is_test !== status) {
        await reportPortalHelper.logInfo(`...wait for customer 'is_test' changed for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the 'is_test' status hasn't changed
    if (res.body.customer.is_test !== status) {
      throw new Error(`boCustomersHelper.waitForCustomerIsTestStatusChange: customer 'is_test' status hasn't changed`);
    }
    return res;
  },

  async waitForCustomerIsVipStatusChange(agent, cid, status) {
    let res;

    for (let i = 1; i <= 9; i++) {
      res = await this.getCustomer(agent, cid);
      if (res.body.customer.is_vip !== status) {
        await reportPortalHelper.logInfo(`...wait for customer 'is_vip' changed for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    if (res.body.customer.is_vip !== status) {
      throw new Error(`boCustomersHelper.waitForCustomerIsVipStatusChange: customer 'is_vip' status hasn't changed`);
    }
    return res;
  },

  async waitForCustomerStatusIdChange(agent, cid, status) {
    let res;
    for (let i = 1; i <= 9; i++) {
      res = await this.getCustomer(agent, cid);
      if (res.body.customer.status_id !== status) {
        await reportPortalHelper.logInfo(`...wait for customer 'status_id' changed for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the 'status_id' hasn't changed
    if (res.body.customer.status_id !== status) {
      throw new Error(`boCustomersHelper.waitForCustomerStatusIdChange: customer 'status_id' hasn't changed`);
    }
    return res;
  },

  async waitForCustomerCreateInBO(agent, cid) {
    let res;
    for (let i = 1; i <= 20; i++) {
      res = await this.getCustomer(agent, cid);
      if (res.body.customer === undefined) {
        await reportPortalHelper.logInfo(`...wait for customer create for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the customer hasn't created
    if (res.body.customer === undefined) {
      throw new Error(`boCustomerHelper.waitForCustomerCreateInBO: customer hasn't created`);
    }
    return res;
  },

  async waitForCustomerReturningStatus(agent, cid) {
    let res;
    let returningStatus;
    for (let i = 1; i <= 20; i++) {
      res = await this.getCustomer(agent, cid);
      returningStatus = res.body.customer.returning_status;
      if (returningStatus === null) {
        await reportPortalHelper.logInfo(`...wait for customer 'returning_status' change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else {
        return res;
      }
    }
    if (returningStatus === null) {
      throw new Error(`boCustomerHelper.waitForCustomerReturningStatus: 
      returning returningStatus ${returningStatus}`);
    }
    return res;
  },

  async waitForCustomerAssignmentUidChange(agent, cid) {
    let res;
    for (let i = 1; i <= 50; i++) {
      res = await this.getCustomer(agent, cid);
      if (res.body.customer === undefined || res.body.customer.assignment.uid === null) {
        await reportPortalHelper.logInfo(`...wait for customer assignment uid changed for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the customer assignment uid hasn't changed
    if (res.body.customer.assignment.uid === null) {
      throw new Error(`boCustomerHelper.waitForCustomerAssignmentUidChange: customer assignment uid hasn't changed`);
    }
    return res;
  },

  async updateCustomer(agent, cid, updateData) {
    return agent
      .put(`${config.default.boApiURL}/customers/${cid}`)
      .proxy(proxy)
      .send(updateData)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.updateCustomer res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boCustomerHelper.updateCustomer status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.updateCustomer err: ${JSON.stringify(err)}`);
      });
  },

  async updateCustomerData(agent, cid, updateData) {
    return await agent
      .put(`${config.default.boApiURL}/bo/customers/${cid}`)
      .proxy(proxy)
      .send(updateData)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.updateCustomerData res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boCustomerHelper.updateCustomerData status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.updateCustomerData err: ${JSON.stringify(err)}`);
      });
  },

  async updateCustomerComplianceStatus(agent, cid, updateData) {
    return await agent
      .put(`${config.default.boApiURL}/customers/${cid}/statuses/compliance`)
      .proxy(proxy)
      .send(updateData)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(
              `boCustomerHelper.updateCustomerComplianceStatus res: ${JSON.stringify(res.body)}`
            )
          : reportPortalHelper.logInfo(
              `boCustomerHelper.updateCustomerComplianceStatus status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.updateCustomerComplianceStatus err: ${JSON.stringify(err)}`);
      });
  },

  async activateDraftCustomer(agent, activateData, cid) {
    return await agent
      .post(`${config.default.boApiURL}/customers/${cid}/activate`)
      .proxy(proxy)
      .send(activateData)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.activateDraftCustomer res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `boCustomerHelper.activateDraftCustomer status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.activateDraftCustomer err: ${JSON.stringify(err)}`);
      });
  },

  async setCustomerIsTest(agent, cid, data) {
    return await agent
      .put(`${config.default.boApiURL}/customers/test/${cid}`)
      .proxy(proxy)
      .send(data)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.setCustomerIsTest res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boCustomerHelper.setCustomerIsTest status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.setCustomerIsTest err: ${JSON.stringify(err)}`);
      });
  },

  async setCustomerIsVip(agent, cid, data) {
    return agent
      .post(`${config.default.boApiURL}/bo/customers/${cid}/mark-as-vip`)
      .proxy(proxy)
      .send(data)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.setCustomerIsVip res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boCustomerHelper.setCustomerIsVip status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.setCustomerIsVip err: ${JSON.stringify(err)}`);
      });
  },

  /** Customer documents from BO */
  async getCustomerDocuments(agent, cid, status = constants.DOCUMENT_STATUS.NEW) {
    return await agent
      .get(`${config.default.boApiURL}/customers/${cid}/documents`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.getCustomerDocuments res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `boCustomersHelper.getCustomerDocuments status code error: ${JSON.stringify(res)}`
            );
        let docs = res.body.documents;
        if (status === '') {
          return docs;
        } else {
          return docs.filter((obj) => {
            return obj['status'] === status;
          });
        }
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.getCustomerDocuments err: ${JSON.stringify(err)}`);
      });
  },

  async approveCustomerDocument(agent, customerCid, documentsId, body) {
    return await agent
      .put(`${config.default.boApiURL}/customers/${customerCid}/documents/${documentsId}`)
      .proxy(proxy)
      .send(body)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.approveCustomerDocuments res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boCustomersHelper.approveCustomerDocuments status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.approveCustomerDocuments err: ${JSON.stringify(err)}`);
      });
  },

  async declineCustomerDocument(agent, customerCid, documentsId, body) {
    return agent
      .put(`${config.default.boApiURL}/customers/${customerCid}/documents/${documentsId}`)
      .proxy(proxy)
      .send(body)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.declineCustomerDocuments res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boCustomersHelper.declineCustomerDocuments status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.declineCustomerDocuments err: ${JSON.stringify(err)}`);
      });
  },

  async approveCustomerDocuments(agent) {
    try {
      let customer = await customerHelper.getCurrentCustomer(agent);
      let documents = await this.getCustomerDocuments(agent, customer.cid);

      for (let i = 0; i < documents.length; i++) {
        let id = documents[i].id;
        let body = {
          status: constants.DOCUMENT_STATUS.APPROVED,
          note: 'test',
        };

        let res = await this.approveCustomerDocument(agent, customer.cid, id, body);

        expect(res.status).to.equal(200);
        expect(res.body.document.status).to.equal(constants.DOCUMENT_STATUS.APPROVED);
      }
    } catch (err) {
      await reportPortalHelper.logInfo(`approveCustomerDocuments err: ${JSON.stringify(err)}`);
    }
  },

  async declineCustomerDocuments(agent) {
    let customer = await customerHelper.getCurrentCustomer(agent);
    let documents = await this.getCustomerDocuments(agent, customer.cid, constants.DOCUMENT_STATUS.APPROVED);

    for (let i = 0; i < documents.length; i++) {
      let id = documents[i].id;
      let body = {
        status: constants.DOCUMENT_STATUS.DECLINED,
        decline_reason_id: 'bw_copy',
      };

      let res = await this.declineCustomerDocument(agent, customer.cid, id, body);

      expect(res.status).to.equal(200);
      expect(res.body.document.status).to.equal(constants.DOCUMENT_STATUS.DECLINED);
    }
  },

  /** Documents upload from BO */
  // 1 step
  async getDocumentUploadParams(agent, documentType, cid) {
    return await agent
      .get(`${config.default.boApiURL}/customers/${cid}/upload-url/${documentType}?content_type=image/png`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.getDocumentUploadParams res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `boCustomersHelper.getDocumentUploadParams status code error: ${JSON.stringify(res)}`
            );
        return res.body;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.getDocumentUploadParams err: ${JSON.stringify(err)}`);
      });
  },

  // 2 step
  async sendDocumentToS3(agent, uploadParams) {
    const formData = {};

    Object.keys(uploadParams.fields).forEach((key) => {
      formData[key] = uploadParams.fields[key];
    });

    const imagePath = path.join(__dirname, '../../../', 'test-data/images/document.jpg');
    formData['file'] = fs.createReadStream(imagePath);

    //TODO replace with superagent
    return new Promise((resolve, reject) => {
      request.post({ url: uploadParams.url, formData: formData }, (err) => {
        if (err) {
          reportPortalHelper.logInfo(`sendDocumentToS3 BO err: ${JSON.stringify(err)}`);
          return reject(err);
        }
        return resolve();
      });
    });
  },

  //  3 step
  async uploadDocumentToDBFromBO(agent, documentTypeID, cid, status = 'approved') {
    // 1 - get document params for upload
    let uploadParams = await this.getDocumentUploadParams(agent, documentTypeID, cid);

    // 2 - send document to S3 server
    await this.sendDocumentToS3(agent, uploadParams);

    // 3 - save document to DB
    let date = new Date().toISOString();

    return await agent
      .post(`${config.default.boApiURL}/customers/${cid}/documents`)
      .proxy(proxy)
      .send({
        path: `${uploadParams.path}`,
        type_id: `${documentTypeID}`,
        date: `${date}`,
        status: `${status}`,
      })
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.uploadDocumentToDB res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boCustomersHelper.uploadDocumentToDB status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.uploadDocumentToDB err: ${JSON.stringify(err)}`);
      });
  },

  async getQuestionnaireDownloadUrl(agent, cid, path) {
    return await agent
      .get(`${config.default.boApiURL}/customers/${cid}/download-url/${path}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.getQuestionnaireDownloadUrl res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `boCustomerHelper.getQuestionnaireDownloadUrl status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.getQuestionnaireDownloadUrl err: ${JSON.stringify(err)}`);
      });
  },

  async getQuestionnaireBO(agent, url) {
    return await agent
      .get(`${url}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.getQuestionnaire res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boCustomerHelper.getQuestionnaire status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.getQuestionnaire err: ${JSON.stringify(err)}`);
      });
  },

  /** Accounts BO */
  getCustomerTradingAccount(agent, cid, mode) {
    const mapFrontModeToBackend = {
      [constants.MODE.REAL]: 'live',
      [constants.MODE.DEMO]: 'demo',
    };
    return agent
      .get(`${config.default.boApiURL}/bo/accounts?cid=${cid}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.getCustomerTradingAccount res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `boCustomerHelper.getCustomerTradingAccount status code error: ${JSON.stringify(res)}`
            );
        const accounts = res.body.rows;
        return accounts.find((account) => account.mode === mapFrontModeToBackend[mode]);
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.getCustomerTradingAccount err: ${JSON.stringify(err)}`);
      });
  },

  async waitForBalanceChange(agent, cid, mode, amount) {
    let res;
    for (let i = 1; i <= 60; i++) {
      res = await this.getCustomerTradingAccount(agent, cid, mode);
      if (res === undefined || res.balance !== amount) {
        await reportPortalHelper.logInfo(`...wait for customer balance change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the balance hasn't changed
    if (res === undefined || res.balance !== amount) {
      throw new Error(`boCustomersHelper.waitForBalanceChange: balance hasn't changed`);
    }
    return res;
  },

  /** Communications BO */
  async sendResetPasswordMagicLink(agent, cid) {
    return agent
      .post(`${config.default.boApiURL}/customers/${cid}/reset-password-init`)
      .proxy(proxy)
      .send(customerDataBO.customerResetPasswordMagicLink)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.sendResetPasswordMagicLink res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boCustomersHelper.sendResetPasswordMagicLink status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.sendResetPasswordMagicLink err: ${JSON.stringify(err)}`);
      });
  },

  async sendMagicLink(agent, cid, params = {}) {
    return await agent
      .post(`${config.default.boApiURL}/communications/magic-link/${cid}`)
      .proxy(proxy)
      .send({ ...customerDataBO.customerSetupPasswordMagicLink, ...params })
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.sendMagicLink res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boCustomersHelper.sendMagicLink status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.sendMagicLink err: ${JSON.stringify(err)}`);
        return err;
      });
  },

  async sendTelegramMessage(agent, messageBody) {
    return await agent
      .post(`${config.default.boApiURL}/chats/send-messages`)
      .proxy(proxy)
      .send(messageBody)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.sendTelegramMessage res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boCustomersHelper.sendTelegramMessage status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.sendTelegramMessage err: ${JSON.stringify(err)}`);
      });
  },

  async sendBulkMessage(agent, messageBody) {
    return await agent
      .post(`${config.default.boApiURL}/bo/chat/message/bulk`)
      .proxy(proxy)
      .send(messageBody)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.sendBulkMessage res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boCustomersHelper.sendBulkMessage status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.sendBulkMessage err: ${JSON.stringify(err)}`);
      });
  },

  async getCustomerCommunications(agent, cid) {
    return await agent
      .get(`${config.default.boApiURL}/bo/customers/${cid}/communications?_sort=sent_at&_order=DESC&_page=1&_limit=10`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.getCustomerCommunications res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boCustomersHelper.getCustomerCommunications status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.getCustomerCommunications err: ${JSON.stringify(err)}`);
      });
  },

  async waitForGetCustomerCommunications(agent, cid) {
    let res;
    let rowsCount;
    for (let i = 1; i <= 10; i++) {
      res = await this.getCustomerCommunications(agent, cid);
      rowsCount = res.body.count;
      if (rowsCount < 1) {
        await reportPortalHelper.logInfo(`...wait for customer count change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else {
        break;
      }
    }
    if (rowsCount < 1) {
      throw new Error(`boCustomerHelper.waitForGetCustomerCommunications: 
      returning rowsCount < 1: "${rowsCount}"`);
    }
    return res;
  },

  async waitForLastCommunicationMessageIdNotEqualsTo(agent, cid, id) {
    let res;
    for (let i = 1; i <= 10; i++) {
      res = await this.getCustomerCommunications(agent, cid);
      if (res.body.rows[0].message_id === id) {
        await reportPortalHelper.logInfo(
          `...wait for a last communications message id will changed for ${i * 500} milliseconds`
        );
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if the last communications message id hasn't changed
    if (res.body.rows[0].message_id === id) {
      throw new Error(
        `boCustomersHelper.waitForLastCommunicationMessageIdNotEqualsTo: last communications message id hasn't changed`
      );
    }
    return res;
  },

  /** Assign BO */
  async assignCustomerCompliance(agent, cids, params = {}) {
    return await agent
      .post(`${config.default.boApiURL}/bo/customers/assign/compliance`)
      .proxy(proxy)
      .send({ cids, ...params })
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.assignCustomerCompliance res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boCustomersHelper.assignCustomerCompliance status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.assignCustomerCompliance err: ${JSON.stringify(err)}`);
      });
  },

  async assignCustomerSales(agent, cids, params = {}) {
    return await agent
      .post(`${config.default.boApiURL}/bo/customers/assign`)
      .proxy(proxy)
      .send({ cids, ...params })
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.assignCustomerSales res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boCustomersHelper.assignCustomerSales status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.assignCustomerSales err: ${JSON.stringify(err)}`);
      });
  },

  async assignCustomerWithFilters(agent, filtersData) {
    return await agent
      .post(`${config.default.boApiURL}/bo/customers/assign`)
      .proxy(proxy)
      .send(filtersData)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.assignCustomerWithFilters res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boCustomersHelper.assignCustomerWithFilters status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.assignCustomerWithFilters err: ${JSON.stringify(err)}`);
      });
  },

  /** Customer search */
  async getCustomerSearchInfoByCid(agent, cid) {
    return await agent
      .get(
        `${config.default.boApiURL}/bo/customers?extra_attr=last_interaction_date,&_sort=created_at&_order=DESC&cid=${cid}&is_test=true&_page=1&_limit=10`
      )
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomersHelper.getCustomerSearchInfoByCid res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(
              `boCustomersHelper.getCustomerSearchInfoByCid status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomersHelper.getCustomerSearchInfoByCid err: ${JSON.stringify(err)}`);
      });
  },

  async waitForGetCustomerSearchInfoByCid(agent, cid) {
    let res;
    let customerCount;
    for (let i = 1; i <= 10; i++) {
      res = await this.getCustomerSearchInfoByCid(agent, cid);
      customerCount = res.body.count;
      if (customerCount !== 1) {
        await reportPortalHelper.logInfo(`...wait for customer count change for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else {
        break;
      }
    }
    if (customerCount !== 1) {
      throw new Error(`boCustomerHelper.waitForGetCustomerCommunications: 
      returning customerCount hasn't changed to 1`);
    }
    return res;
  },

  async syncCustomerLiveTradingAccountWithMT(agent, body) {
    return await agent
      .post(`${config.default.boApiURL}/trading/sync/account`)
      .proxy(proxy)
      .send(body)
      .then((res) => {
        res.statusCode === 200
          ? console.log(`boCustomersHelper.syncCustomerLiveTradingAccount res: ${JSON.stringify(res)}`)
          : console.log(`boCustomersHelper.syncCustomerLiveTradingAccount status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        console.log(`boCustomersHelper.syncCustomerLiveTradingAccount err: ${JSON.stringify(err)}`);
      });
  },

  async customerSearch(agent, searchData, params = {}) {
    return agent
      .post(`${config.default.boApiURL}/bo/customers/search`)
      .send({ ...searchData, ...params })
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.customerSearch res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boCustomerHelper.customerSearch status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.customerSearch error: ${err}`);
      });
  },

  async getSalesStatuses(agent) {
    return agent
      .get(`${config.default.boApiURL}/bo/customers/sales-statuses`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.getSalesStatuses res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boCustomerHelper.getSalesStatuses status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.getSalesStatuses err: ${JSON.stringify(err)}`);
      });
  },

  async updateCustomerSalesStatus(agent, cid, updateData) {
    return await agent
      .put(`${config.default.boApiURL}/bo/customers/${cid}/statuses`)
      .proxy(proxy)
      .send(updateData)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boCustomerHelper.updateCustomerSalesStatus res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `boCustomerHelper.updateCustomerSalesStatus status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boCustomerHelper.updateCustomerSalesStatus err: ${JSON.stringify(err)}`);
      });
  },

  async searchIdSalesStatus(response, status) {
    let id;

    response.forEach((data) => {
      if (data.name === status) {
        id = data.id;
      }
    });

    return id;
  },
};
