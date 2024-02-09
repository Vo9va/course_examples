import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import config, { env } from '../../../../config';

describe('C17825 Customer Flow (Quicktions) - Activate Account', function () {
  let cid;
  const { nfsToken } = config.default;
  let activateData = customerData.getCustomerDraftActivate();
  let customerDraft = customerData.getCustomerDraft();
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 11 : 5, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create draft customer with token', async function () {
    const resDraftCustomer = await customersHelper.createCustomerWithToken(agent, nfsToken, customerDraft);
    let statusId = resDraftCustomer.body.customer.status_id;
    cid = resDraftCustomer.body.customer.cid;

    expect(resDraftCustomer.statusCode).to.equal(200);
    expect(statusId).to.equal('draft');

    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('C19551 Activate draft customer', async function () {
    const resActivate = await boCustomerHelper.activateDraftCustomer(agent, activateData, cid);

    expect(resActivate.status).to.equal(200);
  });

  it('Login by an activated customer', async function () {
    let resLoginCustomer = await customersHelper.loginCustomer(agent, customerDraft, activateData);

    expect(resLoginCustomer.statusCode).to.equal(200);
    expect(resLoginCustomer.body.customer.cid).to.equal(cid);
  });

  it('Wait for customer status id change', async function () {
    await boCustomerHelper.waitForCustomerStatusIdChange(agent, cid, 'active');
  });

  it('Check that customer is test', async function () {
    let resGetCustomer = await boCustomerHelper.getCustomer(agent, cid);

    expect(resGetCustomer.statusCode).to.equal(200);
    expect(resGetCustomer.body.customer.is_test).to.equal(true);
  });

  it('Check that agent can not activate the customer activated again', async function () {
    const resActivateSecond = await boCustomerHelper.activateDraftCustomer(agent, activateData, cid);

    expect(resActivateSecond.status).to.equal(400);
    expect(resActivateSecond.body.message).to.equal('Customer is already activated');
  });
});
