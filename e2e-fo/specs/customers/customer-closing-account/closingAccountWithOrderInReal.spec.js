import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import constants from '../../../../test-data/constants';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import walletData from '../../../../test-data/ng/common.data';
import orderHelper from '../../../../test-utils/helpers/helpers-fo/order.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boWalletHelper from '../../../../test-utils/helpers/helpers-bo/bo.wallet.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import boTradingHelper from '../../../../test-utils/helpers/helpers-bo/bo.trading.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import config, { brand } from '../../../../config';
import { getQuotesInfo } from '../../../../test-utils/helpers/socket.helper';

describe('C25618 Closing Account for Customer with Pending Order in Real mode', function () {
  let cid;
  const { secureCode } = config.default;
  let customerDepositor = customerData.getCustomerDepositor();
  let realAccountId;
  const customerTradingAccount = customerData.getCustomerTradingAccount();
  const orderTypeSellStop = constants.ORDER_TYPE.SELL_STOP;
  const amazonSymbol = constants.TRADING_SYMBOL.AMAZON;
  const adminBO = boUserData.getAdminBoDataForLogin(1, process.env.BRAND);

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer', async function () {
    const resCustomerDepositor = await customersHelper.waitTillCustomerCreated(agent, customerDepositor);
    cid = resCustomerDepositor.cid;
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
    realAccountId = realAccount.id;
    let resAccount = await tradingHelper.setCustomerTradingAccount(agent, customerTradingAccount, {
      account_id: realAccountId,
    });

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

  it('Create Pending order', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    const resSymbolQuotes = await getQuotesInfo(amazonSymbol.ID);
    const orderBodySellStop = await orderHelper.getOrderBody(agent, orderTypeSellStop, amazonSymbol, resSymbolQuotes);
    const resOrderSellStop = await tradingHelper.createOrder(agent, orderBodySellStop);

    expect(resOrderSellStop.statusCode).to.equal(200);

    const resStatus = await tradingHelper.waitForOrderStatusChange(
      agent,
      constants.ORDER_STATUS.OPEN,
      orderTypeSellStop,
      0
    );

    expect(resStatus.statusCode).to.equal(200);
  });

  it('Close Customer account', async function () {
    const resCloseAccount = await customersHelper.closeCustomerAccount(agent);

    expect(resCloseAccount.statusCode).to.equal(200);

    await boUserHelper.loginBoAdmin(agent, adminBO);
    const resCustomerBo = await boCustomerHelper.getCustomer(agent, cid);

    expect(resCustomerBo.body.customer.status_id).to.equal('closing_in_progress');
  });

  it('Check Pending Order closes', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    const resStatusCancelled = await boTradingHelper.waitForOrderBOStatusChange(
      agent,
      cid,
      realAccountId,
      constants.ORDER_STATUS.CANCELLED
    );

    expect(resStatusCancelled.statusCode).to.equal(200);
  });

  it('Check Withdrawal creates', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    const resWithdrawal = await boWalletHelper.waitForWithdrawalDataChange(agent, cid);
    let withdrawalAmount = resWithdrawal[0].requested_amount;

    expect(withdrawalAmount).to.equal(walletData.deposit.amount);
  });
});
