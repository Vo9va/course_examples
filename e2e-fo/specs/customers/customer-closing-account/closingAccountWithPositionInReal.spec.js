import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import constants from '../../../../test-data/constants';
import boTradingHelper from '../../../../test-utils/helpers/helpers-bo/bo.trading.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import walletData from '../../../../test-data/ng/common.data';
import orderHelper from '../../../../test-utils/helpers/helpers-fo/order.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import config, { brand } from '../../../../config';
import { getQuotesInfo } from '../../../../test-utils/helpers/socket.helper';

describe('C25617 Closing Account for Customer with Open Positions in Real mode', function () {
  let cid;
  const { secureCode } = config.default;
  let customerTradingAccount = customerData.getCustomerTradingAccount();
  let customerDepositor = customerData.getCustomerDepositor();
  const orderTypeBuy = constants.ORDER_TYPE.BUY;
  const bitcoinSymbol = constants.TRADING_SYMBOL.BTCUSD;
  const adminBO = boUserData.getAdminBoDataForLogin(1, process.env.BRAND);

  after(async function () {
    await customersHelper.logoutCustomer(agent);
    await boUserHelper.loginBoAdmin(agent, adminBO);
    await boTradingHelper.closePositions(agent, [cid]);
    await boUserHelper.logoutBoAdmin(agent);
  });

  it('Create Customer', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customerDepositor);
  });

  it('Complete questionnaire', async function () {
    const res = await customersHelper.putOnboardingAnswers(agent);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('questions');

    if (brand === 'InvestFW') {
      const resRisk = await customersHelper.acceptRiskCustomer(agent);

      expect(resRisk.statusCode).to.equal(200);
    }
  });

  it('Switch to Real mode', async function () {
    let realAccount = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
    let realAccountId = realAccount.id;
    let resAccount = await tradingHelper.setCustomerTradingAccount(agent, customerTradingAccount, {
      account_id: realAccountId,
    });
    cid = resAccount.body.customer.cid;

    expect(resAccount.statusCode).to.equal(200);
  });

  it('Deposit create and confirm', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await preconditions.createAndConfirmDeposit(agent, secureCode);
    await walletHelper.waitForDepositTransactionStatusChange(agent, 'approved');
    await walletHelper.waitForBalanceChange(agent, constants.MODE.REAL, walletData.deposit.amount);
  });

  it('Check balance', async function () {
    let balance = await tradingHelper.getCustomerTradingBalance(agent, constants.MODE.REAL);

    expect(balance).to.equal(walletData.deposit.amount);
  });

  it('Create Position', async function () {
    const resSymbolQuotes = await getQuotesInfo(bitcoinSymbol.ID);
    const orderBodyBuy = await orderHelper.getOrderBody(agent, orderTypeBuy, bitcoinSymbol, resSymbolQuotes);
    const orderResBuy = await tradingHelper.createOrder(agent, orderBodyBuy);

    expect(orderResBuy.statusCode).to.equal(200);

    const statusRes = await tradingHelper.waitForPositionStatusChange(agent, constants.ORDER_STATUS.OPEN);

    expect(statusRes.statusCode).to.equal(200);
  });

  it('Close Customer account', async function () {
    const resCloseAccount = await customersHelper.closeCustomerAccount(agent);

    expect(resCloseAccount.statusCode).to.equal(403);
    expect(resCloseAccount.body.message).to.equal('Customer has open positions');
  });
});
