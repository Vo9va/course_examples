import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import config, { brand } from '../../../../config';

describe('C18787 Customer Currency and trading groups - Test account', function () {
  let customer;
  let tradingAccount;
  let currency;
  let groupId;
  let updateCurrency;
  let customerAutoLoginToken;
  let resAutoLoginByToken;
  let resCreateCustomerWithToken;
  const { tradingGroups, nfsToken } = config.default;
  let autoLoginData = customerData.getCustomerAutoLogin();

  before(async function () {
    brand === 'TradeEU' && this.skip(); // TODO only EUR currency for TradeEU
    brand === 'Capitalix'
      ? (customer = customerData.getCustomerLead({ ip: '189.216.180.220' }))
      : (customer = customerData.getCustomerLead({ ip: '103.224.23.255' }));
  });

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer with token', async function () {
    resCreateCustomerWithToken = await customersHelper.createCustomerWithToken(agent, nfsToken, customer);
    customerAutoLoginToken = resCreateCustomerWithToken.body.customer.auto_login_token;

    expect(resCreateCustomerWithToken.statusCode).to.equal(200);
  });

  it('Precondition', async function () {
    resAutoLoginByToken = await customersHelper.autoLoginCustomer(agent, autoLoginData, {
      token: customerAutoLoginToken,
    });

    expect(resAutoLoginByToken.statusCode).to.equal(200);

    tradingAccount = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.DEMO);
    currency = tradingAccount.currency_id;

    expect(currency).to.equal(constants.CURRENCY.USD);
  });

  it('Check group id Live account', async function () {
    tradingAccount = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
    groupId = tradingAccount.group_id;

    brand === 'Capitalix' || brand === 'NRDX' || brand === 'WC1'
      ? expect(groupId).to.equal(tradingGroups.TEST_LIVE_USD)
      : expect(groupId).to.equal(tradingGroups.TEST_LIVE_EUR);
  });

  it('Update customer currency', async function () {
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

  it('Check group id Live account after currency updating', async function () {
    brand === 'Capitalix' || brand === 'NRDX' || brand === 'WC1'
      ? await tradingHelper.waitForCustomerTradingAccountChange(agent, constants.MODE.REAL, tradingGroups.TEST_LIVE_EUR)
      : await tradingHelper.waitForCustomerTradingAccountChange(
          agent,
          constants.MODE.REAL,
          tradingGroups.TEST_LIVE_USD
        );
    tradingAccount = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
    groupId = tradingAccount.group_id;

    brand === 'Capitalix' || brand === 'NRDX' || brand === 'WC1'
      ? expect(groupId).to.equal(tradingGroups.TEST_LIVE_EUR)
      : expect(groupId).to.equal(tradingGroups.TEST_LIVE_USD);
  });
});
