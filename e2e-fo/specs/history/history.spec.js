import { expect } from 'chai';
import agent from '../../../test-utils/helpers/agent.helper';
import historyHelper from '../../../test-utils/helpers/helpers-fo/history.helper';
import customerData from '../../../test-data/ng/customer.data';
import constants from '../../../test-data/constants';
import customersHelper from '../../../test-utils/helpers/helpers-fo/customers.helper';
import { brand, env } from '../../../config';

describe('History service', function () {
  let customer = customerData.getCustomerLead();
  let customerProd = customerData.getCustomerForLoginOnProd(11, brand);

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
      await customersHelper.waitTillCustomerCreated(agent, customer);
    });
  }

  it('C18695 Popular symbols GET', async function () {
    const res = await historyHelper.getPopularSymbols(agent);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('symbols');
  });

  it('C24021 Sentiments GET', async function () {
    const res = await historyHelper.getSentiments(agent);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('sentiments');
  });

  it('C18464 Bars GET', async function () {
    const res = await historyHelper.getBars(agent, constants.TRADING_SYMBOL.AUDUSD.ID, constants.BARS_INTERVAL['1M']);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('bars');
  });

  it('C18701 Top movers GET', async function () {
    const res = await historyHelper.getTopMovers(agent, brand.toUpperCase());

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('symbols');
  });

  it('C24024 Trending symbols GET', async function () {
    const res = await historyHelper.getTrendingSymbols(agent);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('symbols');
    expect(res.body.symbols).to.have.property('buy');
    expect(res.body.symbols).to.have.property('sell');
  });
});
