import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import boWalletHelper from '../../../../test-utils/helpers/helpers-bo/bo.wallet.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import constants from '../../../../test-data/constants';
import walletDataBO from '../../../../test-data/bo/bo.wallet.data';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';

describe('C24738 Financial Flow - Balance adjustment - Add Funds (Credit/Debit Card + PSP)', function () {
  let cid;
  let creditCardPaymentMethodId = 3;
  let customer = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(8, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    const res = await customersHelper.waitTillCustomerCreated(agent, customer);
    cid = res.cid;
    await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Create Balance Adjustment -> Credit/Debit Card without External ID validation', async function () {
    const resBalanceAdjustmentValidation = await boWalletHelper.createBalanceAdjustment(agent, cid, {
      payment_method_id: creditCardPaymentMethodId,
    });

    expect(resBalanceAdjustmentValidation.status).to.equal(400);
    expect(resBalanceAdjustmentValidation.body.details.message).to.equal('Required transaction id field is missing');
  });

  it('Create Balance Adjustment -> Credit/Debit Card with External ID', async function () {
    const resBalanceAdjustment = await boWalletHelper.createBalanceAdjustment(agent, cid, {
      payment_method_id: creditCardPaymentMethodId,
      transaction_id: '1',
    });

    expect(resBalanceAdjustment.status).to.equal(200);
  });

  it('Wait for balance change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await walletHelper.waitForBalanceChange(agent, constants.MODE.REAL, walletDataBO.balanceAdjustment.amount);
  });

  it('Wait for customer trading account create', async function () {
    let res = await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);

    expect(res.free_margin).to.equal(walletDataBO.balanceAdjustment.amount);
  });

  it('Check customer deposit amount to equal balance adjustment amount', async function () {
    const resCustomer = await boCustomerHelper.getCustomer(agent, cid);

    expect(resCustomer.status).to.equal(200);
    expect(resCustomer.body.customer.customer_lifetime_deposit).to.equal(walletDataBO.balanceAdjustment.amount);
  });
});
