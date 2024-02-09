import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';

describe('C17829 Customers service | Customer "depositor" after Personal info', function () {
  let customerLead = customerData.getCustomerLead();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer', async function () {
    const customerBody = await customersHelper.waitTillCustomerCreated(agent, customerLead);

    expect(customerBody.kyc_status_id).to.equal(constants.KYC_STATUS.UNKNOWN);
  });

  it('Customer Onboarding flow - > depositor after Personal info', async function () {
    const updatePersonalInfo = await customersHelper.updateCustomer(agent, customerData.getCustomerCurrencyUpdate());

    expect(updatePersonalInfo.statusCode).to.equal(200);
    expect(updatePersonalInfo.body.customer.kyc_status_id).to.equal(constants.KYC_STATUS.UNKNOWN);
    expect(updatePersonalInfo.body.customer.trading_status_id).to.equal(constants.TRADING_STATUS.DEPOSITOR);
  });
});
