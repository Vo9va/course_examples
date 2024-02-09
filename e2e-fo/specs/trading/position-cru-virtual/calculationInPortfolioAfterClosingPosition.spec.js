import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import orderHelper from '../../../../test-utils/helpers/helpers-fo/order.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import { getQuotesInfo } from '../../../../test-utils/helpers/socket.helper';
import { brand, env } from '../../../../config';
import reportPortalHelper from '../../../../test-utils/helpers/reportPortal.helper';

describe('C18609 Trading in Virtual Mode - calculation in portfolio after closing Position', function () {
  let positionId;
  let accountId;
  let profit;
  let invested;
  let balance;
  let currentValue;
  let units;
  let volume;
  let contractSize;
  let priceOpen;
  let profitPercentClosed;
  let priceClosed;
  let currency;
  let symbolQuotesConvert;
  let profitClosedPortfolioEUR;
  let profitClosedPortfolioUSD;
  const orderType = constants.ORDER_TYPE.SELL;
  const symbol = constants.TRADING_SYMBOL.DASHUSD;
  const customer = customerData.getCustomerLead();
  let customerProd = customerData.getCustomerForLoginOnProd(2, brand);

  after(async function () {
    /** Close position */
    const closedRes = await tradingHelper.closePosition(agent, positionId);
    if (closedRes.body.message === 'Position is already closed') {
      await reportPortalHelper.logInfo('Position was closed in test');
    } else {
      await reportPortalHelper.logInfo(`Response message: ${closedRes.body.message}`); // in case if statusCode doesn't equal 200 and message doesn't 'Position is already closed'
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
    currency = demoAccount.currency_id;
    await reportPortalHelper.logInfo(`currency: ${currency}`); // TODO remove after investigation

    const customerBody = await customersHelper.getCurrentCustomer(agent);
    accountId = customerBody.trading_account_id;

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

  it('Create position', async function () {
    const symbolQuotes = await getQuotesInfo(symbol.ID);
    const orderBody = await orderHelper.getOrderBody(agent, orderType, symbol, symbolQuotes);
    const orderRes = await tradingHelper.createOrder(agent, orderBody);

    expect(orderRes.statusCode).to.equal(200);
  });

  it('Read position', async function () {
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

    profit = Number((currentValue - invested).toFixed(2));
    expect(updateRes.body.positions[0].profit).to.equal(profit);

    units = volume * contractSize;
  });

  it('Close Position', async function () {
    const closedRes = await tradingHelper.closePosition(agent, positionId);

    expect(closedRes.statusCode).to.equal(200);
    expect(closedRes.body.success).to.equal(true);

    symbolQuotesConvert = await getQuotesInfo('EURUSD');
  });

  it('Read position', async function () {
    try {
      const statusRes = await tradingHelper.waitForPositionStatusChangeById(
        agent,
        constants.ORDER_STATUS.CLOSED,
        positionId
      );
      priceClosed = statusRes.body.positions[0].price_closed;

      expect(statusRes.statusCode).to.equal(200);
      expect(statusRes.body.positions[0]).to.include({
        status: constants.ORDER_STATUS.CLOSED,
      });
    } catch (e) {
      throw new Error(`Read position error ${e}`);
    }
  });

  it('Convert USD to EUR', async function () {
    let openedLeveraged = units * priceOpen;
    let closedLeveraged = units * priceClosed;

    profitClosedPortfolioUSD = (openedLeveraged - closedLeveraged).toFixed(2);
    await reportPortalHelper.logInfo(`profitClosedPortfolioUSD: ${profitClosedPortfolioUSD}`); // TODO remove after investigation

    profitClosedPortfolioEUR = ((openedLeveraged - closedLeveraged) / symbolQuotesConvert.bid).toFixed(2);
    await reportPortalHelper.logInfo(`profitClosedPortfolioEUR: ${profitClosedPortfolioEUR}`); // TODO remove after investigation

    profitPercentClosed = (
      ((currency === 'USD' ? profitClosedPortfolioUSD : profitClosedPortfolioEUR) / invested) *
      100
    ).toFixed(2);
  });

  it('Calculation in portfolio after closing Position', async function () {
    const positions = await tradingHelper.getPositions(agent);

    expect(positions.statusCode).to.equal(200);
    expect(parseFloat(positions.body.positions[0].profit)).to.be.closeTo(
      currency === 'USD' ? parseFloat(profitClosedPortfolioUSD) : parseFloat(profitClosedPortfolioEUR),
      0.011
    );
    expect(positions.body.positions[0].profit_percent.toFixed(2)).to.equal(profitPercentClosed);
  });
});
