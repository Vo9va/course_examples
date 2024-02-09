import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import constants from '../../../../test-data/constants';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import { env } from '../../../../config';

describe('C19572  KYC Flow ( Add/Edit Documents ) - reload Documents [NG+BO integration]', function () {
  let cid;
  let customer = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 14 : 7, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    const res = await customersHelper.waitTillCustomerCreated(agent, customer);
    cid = res.cid;
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Complete questionnaire', async function () {
    const resQuestionnaire = await customersHelper.putOnboardingAnswers(agent);

    expect(resQuestionnaire.statusCode).to.equal(200);
  });

  it('Upload documents to DB from BO', async function () {
    const resPassport = await boCustomerHelper.uploadDocumentToDBFromBO(agent, constants.DOCUMENT.PASSPORT, cid);

    expect(resPassport.statusCode).to.equal(200);

    const resProof = await boCustomerHelper.uploadDocumentToDBFromBO(agent, constants.DOCUMENT.PROOF_OF_RESIDENCE, cid);

    expect(resProof.statusCode).to.equal(200);
  });

  it('Reload documents from FO', async function () {
    const resPassport = await customersHelper.uploadDocumentToDB(agent, constants.DOCUMENT.PASSPORT);

    expect(resPassport.statusCode).to.equal(200);
    expect(resPassport.body.document.status).to.equal(constants.DOCUMENT_STATUS.NEW);
    expect(resPassport.body.document.type_id).to.equal(constants.DOCUMENT.PASSPORT);

    const resProof = await customersHelper.uploadDocumentToDB(agent, constants.DOCUMENT.PROOF_OF_RESIDENCE);

    expect(resProof.statusCode).to.equal(200);
    expect(resProof.body.document.status).to.equal(constants.DOCUMENT_STATUS.NEW);
    expect(resProof.body.document.type_id).to.equal(constants.DOCUMENT.PROOF_OF_RESIDENCE);
  });

  it('Reload documents to DB from BO', async function () {
    const resPassport = await boCustomerHelper.uploadDocumentToDBFromBO(agent, constants.DOCUMENT.PASSPORT, cid);

    expect(resPassport.statusCode).to.equal(200);

    const resProof = await boCustomerHelper.uploadDocumentToDBFromBO(agent, constants.DOCUMENT.PROOF_OF_RESIDENCE, cid);

    expect(resProof.statusCode).to.equal(200);
  });

  it('Check uploading history reflects all the changes', async function () {
    let resPasswordDocumentHistoryChange = await boCustomerHelper.getCustomerDocuments(agent, cid, '');
    expect(resPasswordDocumentHistoryChange.length).to.equal(7);
  });
});
