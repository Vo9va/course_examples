import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import walletHelper from '../../../../test-utils/helpers/helpers-fo/wallet.helper';
import constants from '../../../../test-data/constants';
import errors from '../../../../test-data/ng/error.messages';
import walletData from '../../../../test-data/ng/common.data';
import config from '../../../../config';

describe('C25656 Marked as "Returned" - when the active customer was already with FTD', function () {
  let cid;
  let dateCreated;
  let customerActiveEmail;
  const { secureCode, nfsToken } = config.default;
  let customerActive = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(6, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor ', async function () {
    let resCustomerActive = await customersHelper.waitTillCustomerCreated(agent, customerActive);
    cid = resCustomerActive.cid;
    dateCreated = resCustomerActive.created_at;
    customerActiveEmail = customerActive.email;
  });

  it('Create and confirm deposit', async function () {
    const depositRes = await walletHelper.createDeposit(agent);

    expect(depositRes.statusCode).to.equal(200);
    expect(depositRes.body.proceedRequestParams).to.have.property('url');

    const confirmUrl = depositRes.body.proceedRequestParams.url;

    const confirmRes = await walletHelper.confirmDeposit(agent, confirmUrl, secureCode);

    expect(confirmRes.statusCode).to.equal(200);
  });

  it('Wait that balance change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await walletHelper.waitForBalanceChange(agent, constants.MODE.REAL, walletData.deposit.amount);
  });

  it('Re-registration draft customer with the same email', async function () {
    let draftCustomer = { ...customerActive };
    delete draftCustomer.password;
    delete draftCustomer.currency_id;
    const resDraftCustomer = await customersHelper.createCustomerWithToken(agent, nfsToken, {
      ...draftCustomer,
      email: customerActiveEmail,
    });

    expect(resDraftCustomer.statusCode).to.equal(400);
    expect(resDraftCustomer.body.message).to.equal(errors.CUSTOMER_VALIDATION.emailAlreadyTaken);
  });

  it('Get customer info after re-registration', async function () {
    const resCustomer = await boCustomerHelper.waitForCustomerReturningStatus(agent, cid);
    let newDateCreated = resCustomer.headers.date;

    expect(resCustomer.body.customer.status_id).to.equal('active');
    expect(resCustomer.statusCode).to.equal(200);
    expect(resCustomer.body.customer.returning_status).to.equal('with_ftd');
    expect(dateCreated).not.to.equal(newDateCreated);
  });
});
