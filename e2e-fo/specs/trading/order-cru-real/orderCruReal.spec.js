import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import constants from '../../../../test-data/constants';
import customerData from '../../../../test-data/ng/customer.data';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import orderHelper from '../../../../test-utils/helpers/helpers-fo/order.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import walletData from '../../../../test-data/ng/common.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import config, { brand } from '../../../../config';
import { getQuotesInfo } from '../../../../test-utils/helpers/socket.helper';

describe('Trading service | Order CRU in Real mode', function () {
  let orderId;
  let orderBody;
  const { secureCode } = config.default;
  const adminBO = boUserData.getAdminBoDataForLogin(6, process.env.BRAND);
  const orderType = constants.ORDER_TYPE.SELL_STOP;
  const symbol = constants.TRADING_SYMBOL.AMAZON;
  let customerDepositor = customerData.getCustomerDepositor();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer with status - trader', async function () {
    await preconditions.createVerifiedTrader(agent, customerDepositor, adminBO);

    if (brand === 'InvestFW') {
      const resRisk = await customersHelper.acceptRiskCustomer(agent);

      expect(resRisk.statusCode).to.equal(200);
    }
  });

  it('Wait for customer trading account create and set customer trading account', async function () {
    let realAccount = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
    let resAccount = await tradingHelper.setCustomerTradingAccount(agent, { account_id: realAccount.id });

    expect(resAccount.statusCode).to.equal(200);
  });

  it('Create deposit', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await preconditions.createAndConfirmDeposit(agent, secureCode);
    await tradingHelper.waitForTradingBalanceChange(agent, constants.MODE.REAL, walletData.deposit.amount);
  });

  it('Get symbol quotes Via BO manager and Get order body', async function () {
    const resSymbolQuotes = await getQuotesInfo(symbol.ID);
    orderBody = await orderHelper.getOrderBody(agent, orderType, symbol, resSymbolQuotes);
  });

  it('C18620 Create order', async function () {
    const res = await tradingHelper.createOrder(agent, orderBody);

    expect(res.statusCode).to.equal(200);
  });

  it('Read order', async function () {
    this.timeout(constants.TIMEOUT.WAIT_70s);

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

  it('C19645 Delete order', async function () {
    const res = await tradingHelper.deleteOrder(agent, orderId);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.equal(true);
  });

  it('Read order after cancel', async function () {
    this.timeout(constants.TIMEOUT.WAIT_70s);

    try {
      const ordersRes = await tradingHelper.waitForOrderStatusChange(
        agent,
        constants.ORDER_STATUS.CANCELLED,
        orderType,
        0
      );

      expect(ordersRes.statusCode).to.equal(200);
      expect(ordersRes.body.orders[0]).to.include({
        status_id: constants.ORDER_STATUS.CANCELLED,
      });
    } catch (e) {
      throw new Error(`Read order after cancel error: ${e}`);
    }
  });
});
