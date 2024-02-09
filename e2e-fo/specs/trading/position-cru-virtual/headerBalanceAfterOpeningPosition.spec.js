import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import orderHelper from '../../../../test-utils/helpers/helpers-fo/order.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import { getQuotesInfo } from '../../../../test-utils/helpers/socket.helper';
import { brand, env } from '../../../../config';

describe('C18601 Trading in Virtual Mode - header balance after opening Position', function () {
  let positionId;
  let accountId;
  let profit;
  let invested;
  let freeMargin;
  let balance;
  let equity;
  let marginLevel;
  let currentValue;
  const orderType = constants.ORDER_TYPE.SELL;
  const symbol = constants.TRADING_SYMBOL.DASHUSD;
  const customer = customerData.getCustomerLead();
  let customerProd = customerData.getCustomerForLoginOnProd(7, brand);

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

  it('Switch to Demo mode', async function () {
    const demoAccount = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.DEMO);
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

      profit = Number((currentValue - invested).toFixed(2));
      expect(updateRes.body.positions[0].profit).to.equal(profit);

      freeMargin = balance - invested + profit;

      equity = freeMargin + invested;

      marginLevel = (equity / invested) * 100;
    } catch (e) {
      throw new Error(`Read position error ${e}`);
    }
  });

  it('Check header balance after opening Position', async function () {
    const account = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.DEMO);

    expect(account.balance).to.equal(balance);
    expect(await tradingHelper.isValueInRange(freeMargin, account.free_margin)).to.be.true;
    expect(await tradingHelper.isValueInRange(equity, account.equity)).to.be.true;
    expect(await tradingHelper.isValueInRange(marginLevel, account.margin_level)).to.be.true;
  });

  it('Close Position', async function () {
    const closeRes = await tradingHelper.closePosition(agent, positionId);

    expect(closeRes.statusCode).to.equal(200);
    expect(closeRes.body.success).to.equal(true);
  });

  it('Read position', async function () {
    const statusRes = await tradingHelper.waitForPositionStatusChangeById(
      agent,
      constants.ORDER_STATUS.CLOSED,
      positionId
    );

    expect(statusRes.statusCode).to.equal(200);
    expect(statusRes.body.positions[0]).to.include({
      status: constants.ORDER_STATUS.CLOSED,
    });
  });
});
