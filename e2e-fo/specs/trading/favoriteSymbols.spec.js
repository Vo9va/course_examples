import { expect } from 'chai';
import agent from '../../../test-utils/helpers/agent.helper';
import customerData from '../../../test-data/ng/customer.data';
import constants from '../../../test-data/constants';
import tradingHelper from '../../../test-utils/helpers/helpers-fo/trading.helper';
import customersHelper from '../../../test-utils/helpers/helpers-fo/customers.helper';
import { brand, env } from '../../../config';

describe('Trading Service | Favorite symbols', function () {
  let defaultFavoriteSymbolCount = brand === 'WC1' ? 11 : 0;
  const symbolId =
    brand === 'TradeEU' || brand === 'WC1' ? constants.TRADING_SYMBOL.BTCUSD.ID : constants.TRADING_SYMBOL.AMAZON.ID;
  let customer = customerData.getCustomerLead();
  let customerProd = customerData.getCustomerForLoginOnProd(12, brand);

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

  it('C18692 Get default favorites symbols', async function () {
    const res = await tradingHelper.getFavoriteSymbols(agent);
    const favoriteSymbols = res.body.symbols;

    expect(res.statusCode).to.equal(200);
    expect(favoriteSymbols).to.exist;
    expect(favoriteSymbols.length).to.equal(defaultFavoriteSymbolCount);
  });

  it('C18461 Add favorites symbols', async function () {
    const symbolBody = await tradingHelper.addSymbolToFavorite(agent, symbolId);
    const addedSymbol = symbolBody.body;

    expect(symbolBody.statusCode).to.equal(200);
    expect(addedSymbol).to.exist;
    expect(addedSymbol.id).to.equal(symbolId);

    const favoritesRes = await tradingHelper.getFavoriteSymbols(agent);
    const favoriteCount = favoritesRes.body.symbols.length;

    expect(favoriteCount).to.equal(defaultFavoriteSymbolCount + 1);
  });

  it('C18559 Removed favorites symbols', async function () {
    const removedRes = await tradingHelper.removeSymbolFromFavorites(agent, symbolId);
    expect(removedRes.statusCode).to.equal(200);

    const favoritesRes = await tradingHelper.getFavoriteSymbols(agent);
    const favoriteSymbols = favoritesRes.body.symbols;

    for (let i = 0; i < favoriteSymbols.length; i++) {
      expect(favoriteSymbols[i].id).to.not.equal(symbolId);
    }
  });
});
