import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import orderHelper from '../../../../test-utils/helpers/helpers-fo/order.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import { getQuotesInfo } from '../../../../test-utils/helpers/socket.helper';
import reportPortalHelper from '../../../../test-utils/helpers/reportPortal.helper';
import { brand, env } from '../../../../config';

describe('Trading in Virtual Mode - calculation in portfolio after opening Position', function () {
  let positionId;
  let accountId;
  let profit;
  let invested;
  let balance;
  let profitPercent;
  let currentValue;
  let units;
  let volume;
  let contractSize;
  let priceOpen;
  let leverage;
  let currency;
  let positionInvestedEUR;
  let positionInvestedUSD;
  const orderType = constants.ORDER_TYPE.SELL;
  const symbol = constants.TRADING_SYMBOL.DASHUSD;
  const customer = customerData.getCustomerLead();
  let customerProd = customerData.getCustomerForLoginOnProd(3, brand);

  after(async function () {
    /** Close position */
    const closedRes = await tradingHelper.closePosition(agent, positionId);
    if (closedRes.body.message === 'Position is already closed') {
      await reportPortalHelper.logInfo('Position was closed in test');
    } else {
      await reportPortalHelper.logInfo(`Response message: ${closedRes.body.message}`); // in case if statusCode doesn't equal '200' and message doesn't 'Position is already closed'
      expect(closedRes.statusCode).to.equal(200);
      expect(closedRes.body.success).to.equal(true);
    }
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

  it('Switch to Demo mode', async function () {
    const demoAccount = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.DEMO);
    const customerBody = await customersHelper.getCurrentCustomer(agent);
    accountId = customerBody.trading_account_id;
    currency = demoAccount.currency_id;

    expect(demoAccount.id).to.equal(accountId);
  });

  it('Check balance', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    if (env === 'prod') {
      balance = await tradingHelper.getCustomerTradingBalance(agent, constants.MODE.DEMO);

      expect(typeof balance).to.equal('number');
    } else {
      balance = await tradingHelper.waitForTradingBalanceChange(agent, constants.MODE.DEMO, 100000);

      expect(balance).to.equal(100000);
    }
  });

  it('C18592 Create position', async function () {
    const resSymbolQuotes = await getQuotesInfo(symbol.ID);
    const orderBody = await orderHelper.getOrderBody(agent, orderType, symbol, resSymbolQuotes);
    const orderRes = await tradingHelper.createOrder(agent, orderBody);

    expect(orderRes.statusCode).to.equal(200);
  });

  it('Read position', async function () {
    try {
      const statusRes = await tradingHelper.waitForPositionStatusChange(agent, constants.ORDER_STATUS.OPEN);

      expect(statusRes.statusCode).to.equal(200);

      const updateRes = await tradingHelper.waitForPositionUpdate(agent);

      expect(updateRes.statusCode).to.equal(200);
      expect(updateRes.body.positions[0]).to.include({
        symbol_id: symbol.ID,
        action_id: orderType,
        status: constants.ORDER_STATUS.OPEN,
        volume: symbol.VOLUME,
      });

      positionId = updateRes.body.positions[0].id;
      invested = updateRes.body.positions[0].invested;
      currentValue = updateRes.body.positions[0].current_value;
      volume = updateRes.body.positions[0].volume;
      contractSize = updateRes.body.positions[0].contract_size;
      priceOpen = updateRes.body.positions[0].price_open;
      leverage = updateRes.body.positions[0].leverage;

      profit = Number((currentValue - invested).toFixed(2));
      expect(updateRes.body.positions[0].profit).to.equal(profit);

      profitPercent = ((profit / invested) * 100).toFixed(2);

      units = volume * contractSize;
    } catch (e) {
      throw new Error(`Read position error ${e}`);
    }
  });

  it('Convert USD to EUR', async function () {
    const resSymbolQuotes = await getQuotesInfo('EURUSD');
    positionInvestedUSD = (units * priceOpen) / leverage;
    positionInvestedEUR = positionInvestedUSD / resSymbolQuotes.bid;
  });

  it('C18602 Calculation in portfolio after opening Position', async function () {
    let positions = await tradingHelper.getPositions(agent);

    expect(positions.statusCode).to.equal(200);
    expect(positions.body.positions[0].profit_percent.toFixed(2)).to.equal(profitPercent);
    expect(Math.trunc(positions.body.positions[0].invested)).to.equal(
      Math.trunc(currency === 'USD' ? positionInvestedUSD : positionInvestedEUR)
    );
  });

  it('Close Position', async function () {
    const closeRes = await tradingHelper.closePosition(agent, positionId);

    expect(closeRes.statusCode).to.equal(200);
    expect(closeRes.body.success).to.equal(true);
  });
});
