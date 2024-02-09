import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import { brand, env } from '../../../../config';

describe('C25626 Customer Search - "Last communication date is updated after sending Magic Link to a customer', function () {
  let cid;
  let createdLinkDateAndTime;
  let customerLead = customerData.getCustomerLead();
  const superAdminBO = boUserData.getAdminBoDataForLogin(2, process.env.BRAND);
  let customerProd = customerData.getCustomerForLoginOnProd(20, brand);

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
    it('Create customer depositor', async function () {
      const res = await customersHelper.waitTillCustomerCreated(agent, customerLead);
      cid = res.cid;
      await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
    });
  }

  it('Send "Deposit" magic link', async function () {
    const res = await boCustomerHelper.sendMagicLink(agent, cid, {
      channel: 'email',
      type: 'deposit',
    });

    expect(res.statusCode).to.equal(200);
  });

  it('Get communication date after send magic link', async function () {
    const resGetCommunications = await boCustomerHelper.waitForGetCustomerCommunications(agent, cid);
    createdLinkDateAndTime = resGetCommunications.body.rows[0].sent_at;

    expect(resGetCommunications.statusCode).to.equal(200);
    expect(resGetCommunications.body.rows[0].communication_channel_id).to.equal('email');
    expect(resGetCommunications.body.rows[0].type).to.equal('click2email');
  });

  it('Check last communication date in customer search by cid and create sms date and time', async function () {
    const resLastCommunication = await boCustomerHelper.waitForGetCustomerSearchInfoByCid(
      agent,
      cid,
      createdLinkDateAndTime
    );

    expect(resLastCommunication.statusCode).to.equal(200);
    expect(resLastCommunication.body.rows[0].cid).to.equal(cid);
    expect(resLastCommunication.body.rows[0].last_interaction_date).to.equal(createdLinkDateAndTime);
  });
});
