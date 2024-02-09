import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import orderHelper from '../../../../test-utils/helpers/helpers-fo/order.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import walletData from '../../../../test-data/ng/common.data';
import constants from '../../../../test-data/constants';
import boUserData from '../../../../test-data/bo/bo.user.data';
import config, { brand } from '../../../../config';
import { getQuotesInfo } from '../../../../test-utils/helpers/socket.helper';

describe('C25520 Trading in Real Mode - edit created order(set/change SL value or TP value)', function () {
  let orderId;
  let realAccountId;
  const { secureCode } = config.default;
  const orderType = constants.ORDER_TYPE.BUY_STOP;
  const symbol = constants.TRADING_SYMBOL.BTCUSD;
  const adminBO = boUserData.getAdminBoDataForLogin(8, process.env.BRAND);
  const customerDepositor = customerData.getCustomerDepositor();
  const customerTradingAccount = customerData.getCustomerTradingAccount();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Preconditions', async function () {
    await preconditions.createVerifiedTrader(agent, customerDepositor, adminBO);
    if (brand === 'InvestFW') {
      const resRisk = await customersHelper.acceptRiskCustomer(agent);

      expect(resRisk.statusCode).to.equal(200);
    }
  });

  it('Switch to Real mode', async function () {
    let realAccount = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
    realAccountId = realAccount.id;

    let res = await tradingHelper.setCustomerTradingAccount(agent, customerTradingAccount, {
      account_id: realAccountId,
    });

    expect(res.statusCode).to.equal(200);
  });

  it('Deposit create and confirm', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await preconditions.createAndConfirmDeposit(agent, secureCode);
    await walletHelper.waitForDepositTransactionStatusChange(agent, 'approved');
  });

  it('Check balance', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    const balance = await tradingHelper.waitForTradingBalanceChange(
      agent,
      constants.MODE.REAL,
      walletData.deposit.amount
    );

    expect(balance).to.equal(walletData.deposit.amount);
  });

  it('Create Order', async function () {
    const resSymbolQuotes = await getQuotesInfo(symbol.ID);
    const orderBody = await orderHelper.getOrderBody(agent, orderType, symbol, resSymbolQuotes);
    const orderRes = await tradingHelper.createOrder(agent, orderBody);

    expect(orderRes.statusCode).to.equal(200);
  });

  it('Read order', async function () {
    this.timeout(constants.TIMEOUT.WAIT_70s);

    const res = await tradingHelper.waitForOrderStatusChange(agent, constants.ORDER_STATUS.OPEN, orderType, 0);
    orderId = res.body.orders[0].id;

    expect(res.statusCode).to.equal(200);
    expect(res.body.orders[0]).to.include({
      symbol_id: symbol.ID,
      type_id: orderType,
      status_id: constants.ORDER_STATUS.OPEN,
      volume_current: symbol.VOLUME,
    });
  });

  it('Edit Order (Add Stop Loss and Take Profit)', async function () {
    const resUpdate = await tradingHelper.updateOrder(agent, orderId, walletData.updateOrderDataBuy);

    expect(resUpdate.statusCode).to.equal(200);

    let orders = await tradingHelper.waitForOrderPriceTpChange(agent, walletData.updateOrderDataBuy.price_tp);

    expect(orders.statusCode).to.equal(200);
    expect(orders.body.orders[0]).to.include({
      price_sl: walletData.updateOrderDataBuy.price_sl,
      price_tp: walletData.updateOrderDataBuy.price_tp,
    });
  });

  it('Edit Order (Remove Stop Loss and Take Profit)', async function () {
    const resUpdate = await tradingHelper.updateOrder(agent, orderId, walletData.updateOrderDataBuy, {
      price_sl: 0,
      price_tp: 0,
    });

    expect(resUpdate.statusCode).to.equal(200);

    let orders = await tradingHelper.waitForOrderPriceTpChange(agent, 0);

    expect(orders.statusCode).to.equal(200);
    expect(orders.body.orders[0]).to.include({
      price_sl: 0,
      price_tp: 0,
    });
  });

  it('Close Order', async function () {
    const closeRes = await tradingHelper.deleteOrder(agent, orderId);

    expect(closeRes.statusCode).to.equal(200);
    expect(closeRes.body.success).to.equal(true);
  });
});
