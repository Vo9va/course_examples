import { expect } from 'chai';
import agent from '../../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../../test-data/ng/customer.data';
import constants from '../../../../../test-data/constants';
import tradingHelper from '../../../../../test-utils/helpers/helpers-fo/trading.helper';
import boUserHelper from '../../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boUserData from '../../../../../test-data/bo/bo.user.data';
import boCustomerHelper from '../../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import config, { brand, env } from '../../../../../config';

describe('C18788 Check group id Live account after currency updating NOT test', function () {
  let cid;
  let tradingAccount;
  let currency;
  let groupId;
  let updateCurrency;
  let customerAutoLoginToken;
  let resAutoLoginByToken;
  const { tradingGroups, nfsToken } = config.default;
  let superAdminBO = boUserData.getAdminBoDataForLogin(3, process.env.BRAND);
  let autoLoginData = customerData.getCustomerAutoLogin();
  let email = customerData.getRandomEmailNotTest();
  let customer = customerData.getCustomerLead({ email: email });

  before(async function () {
    env === 'prod' && this.skip();
    brand === 'TradeEU' && this.skip(); // TODO only EUR currency for TradeEU
  });

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer with token', async function () {
    const res = await customersHelper.createCustomerWithToken(agent, nfsToken, customer);
    cid = res.body.customer.cid;
    customerAutoLoginToken = res.body.customer.auto_login_token;

    expect(res.statusCode).to.equal(200);
  });

  it('Auto login customer', async function () {
    resAutoLoginByToken = await customersHelper.autoLoginCustomer(agent, autoLoginData, {
      token: customerAutoLoginToken,
    });

    expect(resAutoLoginByToken.statusCode).to.equal(200);
  });

  it('Check currency Demo account NOT test', async function () {
    tradingAccount = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.DEMO);
    currency = tradingAccount.currency_id;

    brand === 'NRDX' || brand === 'WC1'
      ? expect(currency).to.equal(constants.CURRENCY.USD)
      : expect(currency).to.equal(constants.CURRENCY.EUR);
  });

  it('Check group id Live account NOT test', async function () {
    tradingAccount = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
    groupId = tradingAccount.group_id;

    brand === 'Capitalix' || brand === 'NRDX' || brand === 'WC1'
      ? expect(groupId).to.equal(tradingGroups.REAL_LIVE_USD)
      : expect(groupId).to.equal(tradingGroups.REAL_LIVE_EUR);
  });

  it('Update customer currency NOT test', async function () {
    brand === 'Capitalix' || brand === 'NRDX' || brand === 'WC1'
      ? (updateCurrency = await customersHelper.updateCustomer(agent, customerData.getCustomerCurrencyUpdate()))
      : (updateCurrency = await customersHelper.updateCustomer(
          agent,
          customerData.getCustomerCurrencyUpdate({ currency_id: 'USD' })
        ));
    currency = updateCurrency.body.customer.currency_id;

    expect(updateCurrency.statusCode).to.equal(200);
    brand === 'Capitalix' || brand === 'NRDX' || brand === 'WC1'
      ? expect(currency).to.equal(constants.CURRENCY.EUR)
      : expect(currency).to.equal(constants.CURRENCY.USD);
  });

  it('Check group id Live account after currency updating NOT test', async function () {
    brand === 'Capitalix' || brand === 'NRDX' || brand === 'WC1'
      ? await tradingHelper.waitForCustomerTradingAccountChange(agent, constants.MODE.REAL, tradingGroups.REAL_LIVE_EUR)
      : await tradingHelper.waitForCustomerTradingAccountChange(
          agent,
          constants.MODE.REAL,
          tradingGroups.REAL_LIVE_USD
        );
    tradingAccount = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
    groupId = tradingAccount.group_id;

    brand === 'Capitalix' || brand === 'NRDX' || brand === 'WC1'
      ? expect(groupId).to.equal(tradingGroups.REAL_LIVE_EUR)
      : expect(groupId).to.equal(tradingGroups.REAL_LIVE_USD);
  });

  it('Post-condition', async function () {
    const resBO = await boUserHelper.loginBoAdmin(agent, superAdminBO);

    expect(resBO.status).to.equal(200);

    const res = await boCustomerHelper.setCustomerIsTest(agent, cid, { is_test: true });

    expect(res.status).to.equal(200);
  });
});
