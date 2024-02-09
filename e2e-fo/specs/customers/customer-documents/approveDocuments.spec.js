import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import { env, brand } from '../../../../config';

describe('C17832 Customers service | Customer "verified_manual" after documents approving', function () {
  let cid;
  let customerDepositor = customerData.getCustomerDepositor();
  const adminBO =
    env === 'prod'
      ? boUserData.getAdminBoDataForLogin(1, process.env.BRAND)
      : boUserData.getAdminBoDataForLogin(2, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, adminBO);
  });

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer', async function () {
    const res = await customersHelper.waitTillCustomerCreated(agent, customerDepositor);
    cid = res.cid;
  });

  it('Complete questionnaire', async function () {
    await preconditions.putOnboardingAnswers(agent);
    if (brand === 'InvestFW') {
      const resRisk = await customersHelper.acceptRiskCustomer(agent);

      expect(resRisk.statusCode).to.equal(200);
    }
  });

  it('Upload documents"', async function () {
    const resPassport = await customersHelper.uploadDocumentToDB(agent, constants.DOCUMENT.PASSPORT);

    expect(resPassport.statusCode).to.equal(200);

    const resProof = await customersHelper.uploadDocumentToDB(agent, constants.DOCUMENT.PROOF_OF_RESIDENCE);

    expect(resProof.statusCode).to.equal(200);

    if (brand === 'WC1') {
      const worldCheck = await boCustomerHelper.uploadDocumentToDBFromBO(agent, constants.DOCUMENT.WORLD_CHECK, cid);

      expect(worldCheck.statusCode).to.equal(200);
    }
  });

  it('Wait for Customer created in BO"', async function () {
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Customer Onboarding flow - > verified_manual after documents approving', async function () {
    await boCustomerHelper.approveCustomerDocuments(agent);
    const customerBody = await customersHelper.getCurrentCustomer(agent);

    expect(customerBody.kyc_status_id).to.equal(constants.KYC_STATUS.VERIFIED);
    expect(customerBody.trading_status_id).to.equal(constants.TRADING_STATUS.TRADER);
  });
});
