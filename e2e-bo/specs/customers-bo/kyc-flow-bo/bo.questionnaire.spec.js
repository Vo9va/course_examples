import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import constants from '../../../../test-data/constants';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import { env } from '../../../../config';

describe('C19574 KYC Flow ( Add/Edit Documents ) - Questionnaire', function () {
  let cid;
  let questionnairePath;
  let downloadUrl;
  let customer = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 14 : 7, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor ', async function () {
    const res = await customersHelper.waitTillCustomerCreated(agent, customer);
    cid = res.cid;
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Complete questionnaire', async function () {
    const resQuestionnaire = await customersHelper.putOnboardingAnswers(agent);

    expect(resQuestionnaire.statusCode).to.equal(200);
  });

  it('Upload document to DB from BO', async function () {
    const resPassport = await boCustomerHelper.uploadDocumentToDBFromBO(agent, constants.DOCUMENT.PASSPORT, cid);

    expect(resPassport.statusCode).to.equal(200);
  });

  it('Get customer documents ', async function () {
    const resNewDocuments = await boCustomerHelper.getCustomerDocuments(agent, cid);

    questionnairePath = resNewDocuments[0].path;
  });

  it('Get customer questionnaire download url', async function () {
    const resQuestionnaireUrl = await boCustomerHelper.getQuestionnaireDownloadUrl(agent, cid, questionnairePath);
    downloadUrl = resQuestionnaireUrl.body.downloadUrl;

    expect(resQuestionnaireUrl.statusCode).to.equal(200);
    expect(resQuestionnaireUrl.body).to.have.property('downloadUrl');
  });

  it('C19574 Get questionnaire in BO', async function () {
    let resDownloadUrl = await boCustomerHelper.getQuestionnaireBO(agent, downloadUrl);

    expect(resDownloadUrl.statusCode).to.equal(200);
  });
});
