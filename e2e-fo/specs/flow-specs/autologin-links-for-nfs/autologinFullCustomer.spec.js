import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import config from '../../../../config';

describe('C18624 Autologin links for NFS', function () {
  let customerAutoLoginToken;
  let resAutoLoginByToken;
  let customerBody;
  const { nfsToken } = config.default;

  let customer = customerData.getCustomerLead();
  let autoLoginData = customerData.getCustomerAutoLogin();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer With Token', async function () {
    const res = await customersHelper.createCustomerWithToken(agent, nfsToken, customer);
    customerAutoLoginToken = res.body.customer.auto_login_token;

    expect(res.statusCode).to.equal(200);
  });

  it('Autologin Full Customer', async function () {
    resAutoLoginByToken = await customersHelper.autoLoginCustomer(agent, autoLoginData, {
      token: customerAutoLoginToken,
    });
    customerBody = resAutoLoginByToken.body.customer;

    expect(resAutoLoginByToken.statusCode).to.equal(200);
    expect(customerBody).to.exist;
    expect(customerBody.email).to.equal(customer.email);
  });
});
