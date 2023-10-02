const expect = require('chai').expect;
const agent = require('../agent.helper');
const customersHelper = require('../customers.helper');

let customerDataForLogin = {
  email: 'ng_e2e_api_test0.x3bnvhhr0sl@mailinator.com',
  mobile: '+4748130055',
  password: '123456Aa',
  first_name: 'Qa',
  last_name: 'API',
  brand_id: 'CAPITALIX',
  system_id: 'web',
  login_type_id: 'regular',
  country_id: 'NO',
  lang_id: 'en',
  daily_deposit_limit: 100,
  auth_method: 'regular',
  token: 'string',
  login: 'true',
  campaign_id: '53'
}

describe('Login/Logout', async function () {

  it('login customer', async function (){
    let res = await customersHelper.loginCustomer(agent, customerDataForLogin)

    expect(customerDataForLogin.email).to.equal(res.body.customer.email)
  });

  it('logout customer', async function () {
    let res = await customersHelper.logoutCustomer(agent);
    expect(res.statusCode).to.equal(200);
  });
});
//yrdyjjj
