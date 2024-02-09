import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import boWalletHelper from '../../../../test-utils/helpers/helpers-bo/bo.wallet.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import { brand, env } from '../../../../config';

describe('C18561 Financial Flow - Deleting manual deposit transaction', function () {
  let cid;
  let customer = customerData.getCustomerDepositor();
  let customerProd = customerData.getCustomerForLoginOnProd(31, brand);
  const superAdminBO = boUserData.getAdminBoDataForLogin(11, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  if (env === 'prod') {
    it('Login with prod customer', async function () {
      const res = await customersHelper.loginCustomer(agent, customerProd);
      cid = res.body.customer.cid;

      expect(res.statusCode).to.equal(200);
    });
  } else {
    it('Create Customer Lead', async function () {
      const res = await customersHelper.waitTillCustomerCreated(agent, customer);
      cid = res.cid;

      await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
    });
  }

  it('Check error - maximum amount is 999999', async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await boUserHelper.loginBoAdmin(agent, superAdminBO);

    const depositRes = await boWalletHelper.createDeposit(agent, cid, { amount: 1000000 });

    expect(depositRes.statusCode).to.equal(400);
    expect(depositRes.body.details.message).to.equal('maximum amount is 999999');
  });

  it('Check error - minimal amount is 0.01', async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await boUserHelper.loginBoAdmin(agent, superAdminBO);

    const depositRes = await boWalletHelper.createDeposit(agent, cid, { amount: 0 });

    expect(depositRes.statusCode).to.equal(400);
    expect(depositRes.body.details.message).to.equal('minimum amount is 0.01');
  });

  it('Check error - The "amount" field must be a number!', async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await boUserHelper.loginBoAdmin(agent, superAdminBO);

    const depositRes = await boWalletHelper.createDeposit(agent, cid, { amount: 'qwert' });

    expect(depositRes.statusCode).to.equal(400);
    expect(depositRes.body.message).to.equal("The 'amount' field must be a number!");
  });

  it('Check error - deposit field is required', async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await boUserHelper.loginBoAdmin(agent, superAdminBO);

    const depositRes = await boWalletHelper.createDeposit(agent, cid, { amount: null });

    expect(depositRes.statusCode).to.equal(400);
    expect(depositRes.body.message).to.equal("The 'amount' field is required!");
  });

  it('Check error - Card number is not valid', async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await boUserHelper.loginBoAdmin(agent, superAdminBO);

    const depositRes = await boWalletHelper.createDeposit(agent, cid, { card_number: '0000000000000' });

    expect(depositRes.statusCode).to.equal(400);
    expect(depositRes.body.message).to.equal('Card number is not valid');
  });

  it('Check error - Expiration date is not valid', async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await boUserHelper.loginBoAdmin(agent, superAdminBO);

    const depositRes = await boWalletHelper.createDeposit(agent, cid, { expire_year: '2023' });

    expect(depositRes.statusCode).to.equal(400);
    expect(depositRes.body.message).to.equal('Expiration date is not valid');
  });

  it('Check error - Incorrect CVV/CVV2', async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await boUserHelper.loginBoAdmin(agent, superAdminBO);

    const depositRes = await boWalletHelper.createDeposit(agent, cid, { cvv: '23' });

    expect(depositRes.statusCode).to.equal(400);
    expect(depositRes.body.message).to.equal('cvv is not valid');
  });

  it('Check error - Name on Card field is required', async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await boUserHelper.loginBoAdmin(agent, superAdminBO);

    const depositRes = await boWalletHelper.createDeposit(agent, cid, { card_number: '' });

    expect(depositRes.statusCode).to.equal(400);
    expect(depositRes.body.message).to.equal('Card number is not valid');
  });
});
