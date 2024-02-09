import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import { brand, env } from '../../../../config';

describe('C23002 Customers service | Read Customer', function () {
  let customerLead = customerData.getCustomerLead();
  let customerProd = customerData.getCustomerForLoginOnProd(8, brand);

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  if (env === 'prod') {
    it('Login with prod customer', async function () {
      const res = await customersHelper.loginCustomer(agent, customerProd);

      expect(res.statusCode).to.equal(200);
    });
  } else {
    it('Create Customer Lead', async function () {
      await customersHelper.waitTillCustomerCreated(agent, customerLead);
    });
  }

  it('Read Customer', async function () {
    const customerBody = await customersHelper.getCurrentCustomer(agent);

    expect(customerBody.kyc_status_id).to.equal(constants.KYC_STATUS.UNKNOWN);
    expect(customerBody.trading_status_id).to.equal(constants.TRADING_STATUS.LEAD);
  });
});
