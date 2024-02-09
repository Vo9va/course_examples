import { expect } from 'chai';
import agent from '../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../test-data/ng/customer.data';
import boUserData from '../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import config, { env } from '../../../config';

describe('C25561 Login after "Activate Account" for draft customer', function () {
  let cid;
  let statusId;
  const { nfsToken } = config.default;
  let customer = customerData.getCustomerDraft();
  let activateData = customerData.getCustomerDraftActivate();
  let adminBO =
    env === 'prod'
      ? boUserData.getAdminBoDataForLogin(1, process.env.BRAND)
      : boUserData.getAdminBoDataForLogin(5, process.env.BRAND);

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer with token', async function () {
    const resDraftCustomer = await customersHelper.createCustomerWithToken(agent, nfsToken, customer);
    cid = resDraftCustomer.body.customer.cid;
    statusId = resDraftCustomer.body.customer.status_id;

    expect(resDraftCustomer.statusCode).to.equal(200);
    expect(statusId).to.equal('draft');
  });

  it('Activate draft customer', async function () {
    const resBO = await boUserHelper.loginBoAdmin(agent, adminBO);
    expect(resBO.status).to.equal(200);

    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);

    const resActivate = await boCustomerHelper.activateDraftCustomer(agent, activateData, cid);
    expect(resActivate.status).to.equal(200);
  });

  it('Login after "Activate Account" for draft customer', async function () {
    const resLogin = await customersHelper.loginCustomer(agent, customer, {
      password: customerData.customerDraftActivate.password,
    });
    statusId = resLogin.body.customer.status_id;

    expect(resLogin.statusCode).to.equal(200);
    expect(statusId).to.equal('active');
  });
});
