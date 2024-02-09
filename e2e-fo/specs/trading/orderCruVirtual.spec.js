import { expect } from 'chai';
import agent from '../../../test-utils/helpers/agent.helper';
import orderHelper from '../../../test-utils/helpers/helpers-fo/order.helper';
import tradingHelper from '../../../test-utils/helpers/helpers-fo/trading.helper';
import customerData from '../../../test-data/ng/customer.data';
import constants from '../../../test-data/constants';
import customersHelper from '../../../test-utils/helpers/helpers-fo/customers.helper';
import { brand, env } from '../../../config';
import { getQuotesInfo } from '../../../test-utils/helpers/socket.helper';

describe('Trading service | Order CRU in Virtual mode', function () {
  let orderBody;
  let orderId;
  const orderType = constants.ORDER_TYPE.BUY_STOP;
  const symbol = brand === 'TradeEU' ? constants.TRADING_SYMBOL.BTCUSD : constants.TRADING_SYMBOL.AMAZON;
  let customer = customerData.getCustomerLead();
  let customerProd = customerData.getCustomerForLoginOnProd(1, brand);

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  if (env === 'prod') {
    it('Login with prod customer', async function () {
      const res = await customersHelper.loginCustomer(agent, customerProd);

      expect(res.statusCode).to.equal(200);
    });
  } else {
    it('Create customer lead', async function () {
      await customersHelper.waitTillCustomerCreated(agent, customer);
      await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.DEMO);
    });
  }

  it('Get symbol quotes via BO manager and get order body', async function () {
    const symbolQuotes = await getQuotesInfo(symbol.ID);
    orderBody = await orderHelper.getOrderBody(agent, orderType, symbol, symbolQuotes);
  });

  it('C18591 Create order', async function () {
    const res = await tradingHelper.createOrder(agent, orderBody);

    expect(res.statusCode).to.equal(200);
  });

  it('Read order', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    try {
      const res = await tradingHelper.waitForOrderStatusChange(agent, constants.ORDER_STATUS.OPEN, orderType, 0);
      orderId = res.body.orders[0].id;

      expect(res.statusCode).to.equal(200);
      expect(res.body.orders[0]).to.include({
        symbol_id: symbol.ID,
        type_id: orderType,
        status_id: constants.ORDER_STATUS.OPEN,
        volume_current: symbol.VOLUME,
      });
    } catch (e) {
      throw new Error(`Read order error: ${e}`);
    }
  });

  it('C18608 Delete order', async function () {
    const res = await tradingHelper.deleteOrder(agent, orderId);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.equal(true);
  });

  it('Read order after cancel', async function () {
    try {
      const ordersRes = await tradingHelper.waitForOrderStatusChangeById(
        agent,
        constants.ORDER_STATUS.CANCELLED,
        orderId
      );

      expect(ordersRes.statusCode).to.equal(200);
    } catch (e) {
      throw new Error(`Read order after cancel error: ${e}`);
    }
  });
});
