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

describe('C18794 Wallet service | Withdrawal create/read/update', function () {
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
  });

  it('Wait For Trading Balance Change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await tradingHelper.waitForTradingBalanceChange(agent, constants.MODE.REAL, walletData.deposit.amount);
  });

  it('Create Withdrawal', async function () {
    const withdrawalCreateRes = await walletHelper.createWithdrawal(agent, withdrawalAmount);

    expect(withdrawalCreateRes.statusCode).to.equal(200);
  });

  it('Wait For Withdrawal Status Change', async function () {
    await walletHelper.waitForWithdrawalStatusChange(agent, 'open');
  });

  it('Withdrawal update', async function () {
    const withdrawalRes = await walletHelper.getWithdrawals(agent);
    const withdrawalID = withdrawalRes.body.withdrawal_requests[0].id;

    const res = await walletHelper.updateWithdrawal(agent, withdrawalID);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('success');
  });

  it('Check withdrawal status updated', async function () {
    try {
      const res = await walletHelper.getWithdrawals(agent);
      const withdrawalBody = res.body.withdrawal_requests[0];

      expect(res.statusCode).to.equal(200);
      expect(withdrawalBody.status).to.equal('cancelled');
    } catch (e) {
      throw new Error(`Check withdrawal status updated error: ${e}`);
    }
  });
});
