import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import walletData from '../../../../test-data/ng/common.data';
import config from '../../../../config';

describe('C22304 Wallet service | Withdrawal create', function () {
  const withdrawalAmount = 50;
  const { secureCode } = config.default;
  let customer = customerData.getCustomerDepositor();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer Depositor', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customer);
    await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
  });

  it('Create And Confirm Deposit', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await preconditions.createAndConfirmDeposit(agent, secureCode);
    await tradingHelper.waitForTradingBalanceChange(agent, constants.MODE.REAL, walletData.deposit.amount);
  });

  it('Withdrawal create', async function () {
    const res = await walletHelper.createWithdrawal(agent, withdrawalAmount);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('success');
  });

  it('Withdrawal read', async function () {
    try {
      const res = await walletHelper.getWithdrawals(agent);
      const withdrawalBody = res.body.withdrawal_requests[0];

      expect(res.statusCode).to.equal(200);
      expect(withdrawalBody).to.have.property('id');
      expect(withdrawalBody.status).to.be.oneOf(['open', 'draft']);
      expect(withdrawalBody.initiator).to.equal('customer');
      expect(withdrawalBody.requested_amount).to.equal(withdrawalAmount);
    } catch (e) {
      throw new Error(`Withdrawal read error: ${e}`);
    }
  });

  it('Wait till withdrawal status is changed', async function () {
    try {
      await walletHelper.waitForWithdrawalStatusChange(agent, 'open');

      const withdrawalRes = await walletHelper.getWithdrawals(agent);
      const withdrawalStatus = withdrawalRes.body.withdrawal_requests[0].status;

      expect(withdrawalStatus).to.equal('open');
    } catch (e) {
      throw new Error(`Wait till withdrawal status is changed error: ${e}`);
    }
  });
});
