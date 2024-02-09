import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import { brand } from '../../../../config';

describe('C18775 Customers service | Customer put onboarding answers', function () {
  let customerDepositor = customerData.getCustomerDepositor();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customerDepositor);
  });

  it('Customer put onboarding answers', async function () {
    const resQuestions = await customersHelper.getOnboardingQuestions(agent);

    expect(resQuestions.statusCode).to.equal(200);

    const res = await customersHelper.putOnboardingAnswers(agent);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('questions');

    if (brand === 'InvestFW') {
      const resRisk = await customersHelper.acceptRiskCustomer(agent);

      expect(resRisk.statusCode).to.equal(200);
    }
  });

  it('Customer trading status change to "trader"', async function () {
    const customerBody = await customersHelper.getCurrentCustomer(agent);

    expect(customerBody.kyc_status_id).to.equal(constants.KYC_STATUS.UNKNOWN);
    expect(customerBody.trading_status_id).to.equal(constants.TRADING_STATUS.TRADER);
  });
});
