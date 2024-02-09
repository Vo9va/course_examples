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

describe('C18619 Trading in Real Mode - header balance after opening Position', function () {
  let positionId;
  let realAccountId;
  let profit;
  let invested;
  let freeMargin;
  let balance;
  let equity;
  let marginLevel;
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

  it('Deposit create and confirm', async function () {
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

      freeMargin = balance - invested + profit;

      equity = freeMargin + invested;

      marginLevel = (equity / invested) * 100;
    } catch (e) {
      throw new Error(`Read position error ${e}`);
    }
  });

  it('Header balance after opening Position', async function () {
    const account = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);

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
});
