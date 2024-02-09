import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import boTradingHelper from '../../../../test-utils/helpers/helpers-bo/bo.trading.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import orderHelper from '../../../../test-utils/helpers/helpers-fo/order.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import { getQuotesInfo } from '../../../../test-utils/helpers/socket.helper';

describe('C25616 Closing Account for Customer with Open Positions/Pending Order in Virtual mode', function () {
  let cid;
  let resSymbolQuotes;
  let customerLead = customerData.getCustomerLead();
  const orderTypeSell = constants.ORDER_TYPE.SELL;
  const orderTypeBuyStop = constants.ORDER_TYPE.BUY_STOP;
  const bitcoinSymbol = constants.TRADING_SYMBOL.BTCUSD;
  const adminBO = boUserData.getAdminBoDataForLogin(1, process.env.BRAND);

  after(async function () {
    await customersHelper.logoutCustomer(agent);
    await boUserHelper.loginBoAdmin(agent, adminBO);
    await boTradingHelper.closePositions(agent, [cid]);
    await boUserHelper.logoutBoAdmin(agent);
  });

  it('Create Customer', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customerLead);
  });

  it('Check Demo mode is selected', async function () {
    const demoAccount = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.DEMO);
    const customerBody = await customersHelper.waitForCustomerTradingAccountIdCreated(agent);
    let demoAccountId = customerBody.trading_account_id;
    cid = customerBody.cid;

    expect(demoAccount.id).to.equal(demoAccountId);
  });

  it('Check balance', async function () {
    await walletHelper.waitForBalanceChange(agent, constants.MODE.DEMO, 100000);
    let balance = await tradingHelper.getCustomerTradingBalance(agent, constants.MODE.DEMO);

    expect(balance).to.equal(100000);
  });

  it('Create position', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    resSymbolQuotes = await getQuotesInfo(bitcoinSymbol.ID);
    const orderBodySell = await orderHelper.getOrderBody(agent, orderTypeSell, bitcoinSymbol, resSymbolQuotes);
    const orderResSell = await tradingHelper.createOrder(agent, orderBodySell);

    expect(orderResSell.statusCode).to.equal(200);

    const statusRes = await tradingHelper.waitForPositionStatusChange(agent, constants.ORDER_STATUS.OPEN);

    expect(statusRes.statusCode).to.equal(200);
  });

  it('Create Pending order', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    const orderBodyBuyStop = await orderHelper.getOrderBody(agent, orderTypeBuyStop, bitcoinSymbol, resSymbolQuotes);
    const orderResBuyStop = await tradingHelper.createOrder(agent, orderBodyBuyStop);

    expect(orderResBuyStop.statusCode).to.equal(200);

    const resStatus = await tradingHelper.waitForOrderStatusChange(
      agent,
      constants.ORDER_STATUS.OPEN,
      orderTypeBuyStop,
      1
    );

    expect(resStatus.statusCode).to.equal(200);
  });

  it('Close Customer account', async function () {
    const resCloseAccount = await customersHelper.closeCustomerAccount(agent);

    expect(resCloseAccount.statusCode).to.equal(200);

    const resCustomer = await customersHelper.getCurrentCustomer(agent);

    expect(resCustomer.status_id).to.equal('closing_in_progress');
  });

  it('Check Pending Order closes', async function () {
    const resStatusCancelled = await tradingHelper.waitForOrderStatusChange(
      agent,
      constants.ORDER_STATUS.CANCELLED,
      orderTypeBuyStop,
      1
    );

    expect(resStatusCancelled.statusCode).to.equal(200);
  });

  it('Check Position closes', async function () {
    const resStatusClosed = await tradingHelper.waitForPositionStatusChange(agent, constants.ORDER_STATUS.CLOSED);

    expect(resStatusClosed.statusCode).to.equal(200);
  });
});
