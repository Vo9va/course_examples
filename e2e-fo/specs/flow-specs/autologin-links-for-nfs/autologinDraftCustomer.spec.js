import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import config from '../../../../config';

describe('C18631 Autologin links for NFS', function () {
  let customerBody;
  let passwordSetupCode;
  let resAutoLoginByToken;
  let customerAutoLoginToken;
  const { nfsToken } = config.default;
  let customer = customerData.getCustomerDraft();
  let autoLoginData = customerData.getCustomerAutoLogin();
  let setupPassword = customerData.getCustomerSetupPassword();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer with token', async function () {
    const resDraftCustomer = await customersHelper.createCustomerWithToken(agent, nfsToken, customer);
    passwordSetupCode = resDraftCustomer.body.customer.password_setup_code;

    expect(resDraftCustomer.statusCode).to.equal(200);
  });

  it('Setup password', async function () {
    const resSetupPassword = await customersHelper.setupPassword(agent, nfsToken, setupPassword, {
      email: customer.email,
      code: passwordSetupCode,
    });
    customerAutoLoginToken = resSetupPassword.body.auto_login_token;

    expect(resSetupPassword.statusCode).to.equal(200);
  });

  it('Autologin draft customer', async function () {
    resAutoLoginByToken = await customersHelper.autoLoginCustomer(agent, autoLoginData, {
      token: customerAutoLoginToken,
    });
    customerBody = resAutoLoginByToken.body.customer;

    expect(resAutoLoginByToken.statusCode).to.equal(200);
    expect(customerBody).to.exist;
    expect(customerBody.email).to.equal(customer.email);
  });
});
