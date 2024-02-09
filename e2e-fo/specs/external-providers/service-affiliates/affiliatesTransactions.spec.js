import agent from '../../../../test-utils/helpers/agent.helper';
import affiliatesHelper from '../../../../test-utils/helpers/helpers-fo/affiliates.helper';
import customerData from '../../../../test-data/ng/customer.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import preconditions from '../../../../test-utils/test-preconditions/preconditions';
import { expect } from 'chai';
import config, { brand } from '../../../../config';

describe('C28633 Affiliates transactions', function () {
  let cid;
  const { cellxpertToken, prolineToken, hlmToken, secureCode } = config.default;
  let customer = customerData.getCustomerDepositor();
  let token =
    brand === 'Capitalix' || brand === 'InvestFW'
      ? cellxpertToken
      : brand === 'TradeEU'
      ? prolineToken
      : brand === 'WC1'
      ? hlmToken
      : null;

  before(async function () {
    brand === 'NRDX' && this.skip(); // TODO remove this when affiliate channels are added to these brands
  });

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create Affiliate customer', async function () {
    const res = await customersHelper.createCustomerWithToken(agent, token, customer);
    cid = res.body.customer.cid;

    expect(res.statusCode).to.equal(200);

    const resAffiliates = await affiliatesHelper.waitForAffiliatesCustomerData(agent, token, cid);

    expect(resAffiliates.statusCode).to.equal(200);
  });

  it('Update customer to depositor', async function () {
    const resLogin = await customersHelper.loginCustomer(agent, customer);

    expect(resLogin.statusCode).to.equal(200);

    const resUpdate = await customersHelper.updateCustomer(agent, customer);

    expect(resUpdate.statusCode).to.equal(200);
  });

  it('Create deposit and wait till it is approved', async function () {
    await preconditions.createAndConfirmDeposit(agent, secureCode);
    await walletHelper.waitForDepositTransactionStatusChange(agent, 'approved');
  });

  it('Check affiliates transactions to contain data of our customer', async function () {
    const date = new Date().toISOString().split('T')[0];
    const res = await affiliatesHelper.getAffiliatesTransactionsData(
      agent,
      token,
      `?transaction_date_from=${date}&transaction_date_to=${date}`
    );

    expect(res.statusCode).to.equal(200);
    expect(res.body[0].cid).to.equal(cid);
  });
});
