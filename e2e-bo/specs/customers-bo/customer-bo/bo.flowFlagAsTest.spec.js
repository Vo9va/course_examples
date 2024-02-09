import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import config, { env } from '../../../../config';

describe('C19558 Customer Flow (Quicktions) - Flag as Test', function () {
  let cid;
  const { nfsToken } = config.default;
  let email = customerData.getRandomEmailNotTest();
  let customerDraftNotTest = customerData.getCustomerDraft({ email: email });
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 11 : 5, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create draft but not test customer with token', async function () {
    const resDraftNotTestCustomer = await customersHelper.createCustomerWithToken(
      agent,
      nfsToken,
      customerDraftNotTest
    );
    cid = resDraftNotTestCustomer.body.customer.cid;

    expect(resDraftNotTestCustomer.statusCode).to.equal(200);

    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Set value for customer is test', async function () {
    const res = await boCustomerHelper.setCustomerIsTest(agent, cid, { is_test: true });

    expect(res.status).to.equal(200);

    await boCustomerHelper.waitForCustomerIsTestStatusChange(agent, cid, true);
  });

  it('Check the customer information after adding the status is test', async function () {
    const resCustomer = await boCustomerHelper.getCustomer(agent, cid);

    expect(resCustomer.status).to.equal(200);
    expect(resCustomer.body.customer.is_test).to.equal(true);
  });
});
