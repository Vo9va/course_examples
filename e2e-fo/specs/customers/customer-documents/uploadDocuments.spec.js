import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import { brand } from '../../../../config';

describe('C17831 Customers service | Customer upload documents', function () {
  let customerDepositor = customerData.getCustomerDepositor();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customerDepositor);
  });

  it('Complete questionnaire', async function () {
    await preconditions.putOnboardingAnswers(agent);
    if (brand === 'InvestFW') {
      const resRisk = await customersHelper.acceptRiskCustomer(agent);

      expect(resRisk.statusCode).to.equal(200);
    }
  });

  it('Upload documents', async function () {
    const resPassport = await customersHelper.uploadDocumentToDB(agent, constants.DOCUMENT.PASSPORT);

    expect(resPassport.statusCode).to.equal(200);
    expect(resPassport.body.document.status).to.equal(constants.DOCUMENT_STATUS.NEW);
    expect(resPassport.body.document.type_id).to.equal(constants.DOCUMENT.PASSPORT);

    const resProof = await customersHelper.uploadDocumentToDB(agent, constants.DOCUMENT.PROOF_OF_RESIDENCE);

    expect(resProof.statusCode).to.equal(200);
    expect(resProof.body.document.status).to.equal(constants.DOCUMENT_STATUS.NEW);
    expect(resProof.body.document.type_id).to.equal(constants.DOCUMENT.PROOF_OF_RESIDENCE);
  });
});
