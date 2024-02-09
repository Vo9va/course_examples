import fs from 'fs';
import path from 'path';
import request from 'request';
import customerData from '../../../test-data/ng/customer.data';
import reportPortalHelper from '../../helpers/reportPortal.helper';
import proxy from '../proxy.helper';
import config from '../../../config';
import sleep from '../sleep.helper';
import constants from '../../../test-data/constants';
import { expect } from 'chai';

export default {
  /** Current customer */
  async createCustomer(agent, customer, params = {}) {
    const request = { ...customer, ...params };
    return await agent
      .post(`${config.default.apiURL}/customers`)
      .proxy(proxy)
      .send(request)
      .set(constants.HEADER.NAME, constants.HEADER.VALUE)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.createCustomer res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`customersHelper.createCustomer status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.createCustomer err: ${JSON.stringify(err)}`);
      });
  },

  async waitTillCustomerCreated(agent, customer, params = {}) {
    let res;
    for (let i = 1; i <= 5; i++) {
      res = await this.createCustomer(agent, customer, params);
      if (res.status !== 200) {
        if (res.status === 400) {
          expect(res.body.message).to.contain('PRIMARY must be unique');
          break;
        } else {
          await reportPortalHelper.logInfo(`...wait for customer created for ${i * 500} milliseconds`);
          await sleep(constants.TIMEOUT.WAIT_500MS);
        }
      } else break;
    }

    // throws an error if the client is not created
    if (res.status !== 200 && res.status !== 400) {
      throw new Error(`apiHelper.waitCustomerCreated: customer doesn't created`);
    }
    return this.getCurrentCustomer(agent);
  },

  async createCustomerWithToken(agent, token, customer, params = {}) {
    const request = { ...customer, ...params };
    return await agent
      .post(`${config.default.apiURL}/customers`)
      .proxy(proxy)
      .set(token)
      .set(constants.HEADER.NAME, constants.HEADER.VALUE)
      .send(request)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.createCustomerWithToken res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `customersHelper.createCustomerWithToken status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.createCustomerWithToken err: ${JSON.stringify(err)}`);
      });
  },

  async loginCustomer(agent, customer, params = {}) {
    const request = { ...customer, ...params };
    return agent
      .post(`${config.default.apiURL}/auth/login`)
      .proxy(proxy)
      .set(constants.HEADER.NAME, constants.HEADER.VALUE)
      .send(request)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.loginCustomer res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`customersHelper.loginCustomer status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.loginCustomer err: ${JSON.stringify(err)}`);
      });
  },

  async autoLoginCustomer(agent, autoLoginData, paramsForAutoLogin = {}) {
    const request = { ...autoLoginData, ...paramsForAutoLogin };
    return await agent
      .post(`${config.default.apiURL}/auth/autologin`)
      .proxy(proxy)
      .send(request)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.autoLoginCustomer res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`customersHelper.autoLoginCustomer status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.autoLoginCustomer err: ${JSON.stringify(err)}`);
      });
  },

  async logoutCustomer(agent) {
    return await agent
      .post(`${config.default.apiURL}/auth/logout`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.logoutCustomer res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`customersHelper.logoutCustomer status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.logoutCustomer err: ${JSON.stringify(err)}`);
      });
  },

  async getCurrentCustomer(agent) {
    return await agent
      .get(`${config.default.apiURL}/customers/me`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.getCurrentCustomer res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`customersHelper.getCurrentCustomer status code error: ${JSON.stringify(res)}`);
        return res.body.customer;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.getCurrentCustomer err: ${JSON.stringify(err)}`);
      });
  },

  async waitForCustomerTradingAccountIdCreated(agent) {
    let account;

    for (let i = 1; i <= 10; i++) {
      account = await this.getCurrentCustomer(agent);
      if (account.trading_account_id === null) {
        await reportPortalHelper.logInfo(`...wait for customer trading account not null for ${i * 500} milliseconds`);
        await sleep(constants.TIMEOUT.WAIT_500MS);
      } else break;
    }
    // throw an error if customer trading account is null
    if (account.trading_account_id === null) {
      throw new Error(`tradingHelper.waitForCustomerTradingAccountIdCreated: customer trading account is null`);
    }
    return account;
  },

  async updateCustomer(agent, updateData) {
    return await agent
      .put(`${config.default.apiURL}/customers`)
      .proxy(proxy)
      .send(updateData)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.updateCustomer res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`customersHelper.updateCustomer status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.updateCustomer err: ${JSON.stringify(err)}`);
      });
  },

  async closeCustomerAccount(agent) {
    return await agent
      .put(`${config.default.apiURL}/customers/account/init-closing`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.closeCustomerAccount res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `customersHelper.closeCustomerAccount status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.closeCustomerAccount err: ${JSON.stringify(err)}`);
      });
  },

  /** Customer onboarding */
  async getOnboardingQuestions(agent) {
    return await agent
      .get(`${config.default.apiURL}/customers/onboarding/questions`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.getOnboardingQuestions res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `customersHelper.getOnboardingQuestions status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.getOnboardingQuestions err: ${JSON.stringify(err)}`);
      });
  },

  async putOnboardingAnswers(agent) {
    return await agent
      .put(`${config.default.apiURL}/customers/onboarding/answers`)
      .proxy(proxy)
      .send(customerData.customerQuestionnaire)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.putOnboardingAnswers res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `customersHelper.putOnboardingAnswers status code error: ${JSON.stringify(res)}`
            );
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.putOnboardingAnswers err: ${JSON.stringify(err)}`);
      });
  },

  async acceptRiskCustomer(agent) {
    return await agent
      .post(`${config.default.apiURL}/customers/onboarding/accept_risk`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.acceptRiskCustomer res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`customersHelper.acceptRiskCustomer status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.acceptRiskCustomer err: ${JSON.stringify(err)}`);
      });
  },

  /** Customer password */
  async updatePassword(agent, passwords) {
    return await agent
      .put(`${config.default.apiURL}/customers/update-password`)
      .proxy(proxy)
      .send(passwords)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.updatePassword res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`customersHelper.updatePassword status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.updatePassword err: ${JSON.stringify(err)}`);
      });
  },

  async setupPassword(agent, token, setupPassword, paramsForSetupPassword = {}) {
    const request = { ...setupPassword, ...paramsForSetupPassword };
    return await agent
      .post(`${config.default.apiURL}/customers/setup-password`)
      .proxy(proxy)
      .set(token)
      .send(request)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.setupPassword res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`customersHelper.setupPassword status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.setupPassword err: ${JSON.stringify(err)}`);
      });
  },

  /** Customer documents */
  /** Documents upload from Site */
  // 1 step
  async getDocumentUploadParams(agent, documentType) {
    return await agent
      .get(`${config.default.apiURL}/customers/upload-url/${documentType}?content_type=image/png`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.getDocumentUploadParams res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(
              `customersHelper.getDocumentUploadParams status code error: ${JSON.stringify(res)}`
            );
        return res.body;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.getDocumentUploadParams err: ${JSON.stringify(err)}`);
      });
  },

  // 2 step
  async sendDocumentToS3(agent, uploadParams) {
    const formData = {};

    Object.keys(uploadParams.fields).forEach((key) => {
      formData[key] = uploadParams.fields[key];
    });

    const imagePath = path.join(__dirname, '../../..', 'test-data/images/document.jpg');
    formData['file'] = fs.createReadStream(imagePath);

    //TODO replace with superagent
    return new Promise((resolve, reject) => {
      request.post({ url: uploadParams.url, formData: formData }, (err) => {
        if (err) {
          reportPortalHelper.logInfo(`sendDocumentToS3 err: ${JSON.stringify(err)}`);
          return reject(err);
        }
        return resolve();
      });
    });
  },

  //  3 step
  async uploadDocumentToDB(agent, documentTypeID) {
    // 1 - get document params for upload
    let uploadParams = await this.getDocumentUploadParams(agent, documentTypeID);

    // 2 - send document to S3 server
    await this.sendDocumentToS3(agent, uploadParams);

    // 3 - save document to DB
    let date = new Date().toISOString();

    return await agent
      .post(`${config.default.apiURL}/customers/documents`)
      .proxy(proxy)
      .send({
        path: `${uploadParams.path}`,
        type_id: `${documentTypeID}`,
        date: `${date}`,
      })
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`customersHelper.uploadDocumentToDB res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`customersHelper.uploadDocumentToDB status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`customersHelper.uploadDocumentToDB err: ${JSON.stringify(err)}`);
      });
  },
};
