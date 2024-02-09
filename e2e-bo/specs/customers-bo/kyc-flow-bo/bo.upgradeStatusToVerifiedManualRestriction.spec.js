import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import customerDataBO from '../../../../test-data/bo/bo.customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import constants from '../../../../test-data/constants';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import errors from '../../../../test-data/ng/error.messages';
import { env } from '../../../../config';

describe('C19569 KYC Flow ( Edit details& KYC ) - upgrade the status to "KYC Verified - Manual" via Compliance Statuses', function () {
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

  it('Upgrade the status to "KYC Verified - Manual" via Compliance Statuses', async function () {
    const resUpdate = await boCustomerHelper.updateCustomerComplianceStatus(agent, cid, {
      ...customerDataBO.customerComplianceStatusUpdate,
      kyc_status_id: constants.KYC_STATUS.VERIFIED,
    });

    expect(resUpdate.statusCode).to.equal(400);
    expect(resUpdate.body.message).to.equal(errors.CUSTOMER_VALIDATION.invalidKycStatus);
  });

  it('Check that customer has kyc status "Unknown"', async function () {
    const customerBody = await customersHelper.getCurrentCustomer(agent);

    expect(customerBody.kyc_status_id).to.equal(constants.KYC_STATUS.UNKNOWN);
  });
});
