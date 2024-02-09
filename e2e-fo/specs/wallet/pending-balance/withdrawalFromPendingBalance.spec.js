import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import config, { brand } from '../../../../config';

describe('Wallet service | Pending balance', function () {
  const availableAmount = 2000;
  const pendingAmount = 500;
  const withdrawalAmount = 100;
  const { secureCode } = config.default;
  let customerDepositor = customerData.getCustomerDepositor();

  before(async function () {
    const excludedBrands = ['NRDX', 'Capitalix', 'WC1'];
    if (excludedBrands.includes(brand)) this.skip(); // TODO skipped tests for Seychelle regulation due to NG-2233 and NG-2470  -> There are no Pending balance
  });

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer Depositor', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customerDepositor);
  });

  it('Wait For Customer Trading Account Create', async function () {
    await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
  });

  it('Deposit create and confirm', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    const depositRes = await preconditions.createDeposit(agent, { amount: availableAmount + pendingAmount });
    await preconditions.confirmDeposit(agent, depositRes, secureCode);
  });

  it('Wait For Trading Balance Change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await tradingHelper.waitForTradingBalanceChange(agent, constants.MODE.REAL, availableAmount);
  });

  it('Create withdrawal and wait till withdrawal status is changed', async function () {
    const res = await walletHelper.createWithdrawal(agent, withdrawalAmount);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('success');

    await walletHelper.waitForWithdrawalStatusChange(agent, 'open');
  });

  it('Check that withdrawal was from customer "pending amount"', async function () {
    const amountAfterWithdrawal = pendingAmount - withdrawalAmount;
    const resBalance = await walletHelper.getBalance(agent);

    expect(resBalance.body.balance.customer_pending_amount).to.equal(amountAfterWithdrawal);
  });
});
