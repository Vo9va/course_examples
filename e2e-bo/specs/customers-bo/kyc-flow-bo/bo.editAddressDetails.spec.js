import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import constants from '../../../../test-data/constants';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import { brand, env } from '../../../../config';

describe('C19566 KYC Flow ( Edit details & KYC ) - edit address details', function () {
  let cid;
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 14 : 7, process.env.BRAND);
  let customer = customerData.getCustomerDepositor();

  before(async function () {
    // TODO skipped for WC1 on prod due to limited permission access from broker side
    brand === 'WC1' && this.skip();
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

  it('Upload documents', async function () {
    const resPassport = await boCustomerHelper.uploadDocumentToDBFromBO(agent, constants.DOCUMENT.PASSPORT, cid);

    expect(resPassport.statusCode).to.equal(200);

    const resProof = await boCustomerHelper.uploadDocumentToDBFromBO(agent, constants.DOCUMENT.PROOF_OF_RESIDENCE, cid);

    expect(resProof.statusCode).to.equal(200);
  });

  it('Check KYS status after upload docs', async function () {
    const customerBody = await customersHelper.getCurrentCustomer(agent);

    expect(customerBody.kyc_status_id).to.equal(constants.KYC_STATUS.VERIFIED);
  });

  it('Update customer address', async function () {
    const resUpdate = await boCustomerHelper.updateCustomer(agent, cid, { address: 'new_address' });

    expect(resUpdate.statusCode).to.equal(200);
  });

  it('Check that PROOF OF RESIDENCE is expired', async function () {
    const resExpiredDocuments = await boCustomerHelper.getCustomerDocuments(
      agent,
      cid,
      constants.DOCUMENT_STATUS.EXPIRED
    );

    expect(resExpiredDocuments.length).to.equal(1);
    expect(resExpiredDocuments[0].type_id).to.equal(constants.DOCUMENT.PROOF_OF_RESIDENCE);
  });

  it('Get customer documents', async function () {
    const resApprovedDocuments = await boCustomerHelper.getCustomerDocuments(
      agent,
      cid,
      constants.DOCUMENT_STATUS.APPROVED
    );

    expect(resApprovedDocuments.length).to.equal(1);
    expect(resApprovedDocuments[0].type_id).to.equal(constants.DOCUMENT.PASSPORT);
  });

  it('Check that customer has kyc status unknown', async function () {
    const customerBody = await customersHelper.getCurrentCustomer(agent);

    expect(customerBody.kyc_status_id).to.equal(constants.KYC_STATUS.UNKNOWN);
  });
});
