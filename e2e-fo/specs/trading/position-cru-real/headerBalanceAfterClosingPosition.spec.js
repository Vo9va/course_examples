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

describe('C22364 Trading in Real Mode - header balance after closing Position', function () {
  let positionId;
  let realAccountId;
  let profit;
  let invested;
  let balance;
  let profitClosed;
  let currentValue;
  const { secureCode } = config.default;
  const orderType = constants.ORDER_TYPE.BUY;
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

  it('Create deposit and wait for balance change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await preconditions.createAndConfirmDeposit(agent, secureCode);
    await walletHelper.waitForDepositTransactionStatusChange(agent, 'approved');
    balance = await tradingHelper.waitForTradingBalanceChange(agent, constants.MODE.REAL, walletData.deposit.amount);

    expect(balance).to.equal(walletData.deposit.amount);
  });

  it('Create Position', async function () {
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
    } catch (e) {
      throw new Error(`Read position error ${e}`);
    }
  });

  it('Close Position', async function () {
    const closeRes = await tradingHelper.closePosition(agent, positionId);

    expect(closeRes.statusCode).to.equal(200);
    expect(closeRes.body.success).to.equal(true);
  });

  it('Read position', async function () {
    try {
      const statusRes = await tradingHelper.waitForPositionStatusChange(agent, constants.ORDER_STATUS.CLOSED);
      profitClosed = statusRes.body.positions[0].profit;

      expect(statusRes.statusCode).to.equal(200);
      expect(statusRes.body.positions[0]).to.include({
        status: constants.ORDER_STATUS.CLOSED,
      });
    } catch (e) {
      throw new Error(`Read position error ${e}`);
    }
  });

  it('Header balance after closing Position', async function () {
    const account = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);

    let balanceClosed = balance + profitClosed;

    expect(account.balance).to.equal(balanceClosed);
    expect(account.margin_level).to.equal(0);
    expect(await tradingHelper.isValueInRange(balance, account.free_margin)).to.be.true;
    expect(await tradingHelper.isValueInRange(balance, account.equity)).to.be.true;
  });
});
