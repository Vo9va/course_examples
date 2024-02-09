import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import constants from '../../../../test-data/constants';
import errors from '../../../../test-data/ng/error.messages';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';
import walletData from '../../../../test-data/ng/common.data';
import config, { brand } from '../../../../config';

describe('C18774 Customers service | Customer currency validation', function () {
  const { secureCode } = config.default;
  let customerDepositor = customerData.getCustomerDepositor();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Customer', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customerDepositor);
    await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
  });

  it('Deposit create and confirm', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await preconditions.createAndConfirmDeposit(agent, secureCode);
    await walletHelper.waitForDepositTransactionStatusChange(agent, 'approved');
    await walletHelper.waitForBalanceChange(agent, constants.MODE.REAL, walletData.deposit.amount);
  });

  it('Update Customer currency', async function () {
    if (brand === 'TradeEU') {
      const res = await customersHelper.updateCustomer(
        agent,
        customerData.getCustomerCurrencyUpdate({ currency_id: 'USD' })
      );

      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal(errors.CUSTOMER_VALIDATION.invalidCurrency);
    } else {
      const res = await customersHelper.updateCustomer(agent, customerData.getCustomerCurrencyUpdate());

      expect(res.statusCode).to.equal(403);
      expect(res.body.message).to.equal(errors.CUSTOMER_VALIDATION.currency);
    }
  });
});
