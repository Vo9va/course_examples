import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import { env, brand } from '../../../../config';

//TODO delete skip when SMS functionality is paid for
(env === 'prod' ? describe : describe.skip)(
  'C25619 Customer Search - Last communication date is updated after sending SMS to a customer',
  function () {
    let cid;
    let createdSmsDateAndTime;
    let customerLead = customerData.getCustomerLead();
    const superAdminBO = boUserData.getAdminBoDataForLogin(2, process.env.BRAND);
    let customerProd = customerData.getCustomerForLoginOnProd(22, brand);

    before(async function () {
      (brand === 'NRDX' || brand === 'WC1') && this.skip(); // delete skip after fix this bug TL-14751
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
      it('Create customer lead', async function () {
        const res = await customersHelper.createCustomer(agent, customerLead);
        cid = res.body.customer.cid;
        await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
      });
    }

    it('Send "Sms" magic link', async function () {
      const res = await boCustomerHelper.sendMagicLink(agent, cid, {
        channel: 'sms',
        text: 'SMS by autotest',
        type: 'free-text-sms',
      });

      expect(res.statusCode).to.equal(200);
    });

    it('Get communication date after send magic link', async function () {
      const resGetCommunications = await boCustomerHelper.waitForGetCustomerCommunications(agent, cid);
      createdSmsDateAndTime = resGetCommunications.body.rows[0].sent_at;

      expect(resGetCommunications.statusCode).to.equal(200);
      expect(resGetCommunications.body.rows[0].communication_channel_id).to.equal('sms');
      expect(resGetCommunications.body.rows[0].type).to.equal('free-text');
    });

    it('Check last communication date in customer search by cid and create sms date and time', async function () {
      const resLastCommunication = await boCustomerHelper.waitForGetCustomerSearchInfoByCid(
        agent,
        cid,
        createdSmsDateAndTime
      );

      expect(resLastCommunication.statusCode).to.equal(200);
      expect(resLastCommunication.body.rows[0].cid).to.equal(cid);
      expect(resLastCommunication.body.rows[0].last_interaction_date).to.equal(createdSmsDateAndTime);
    });
  }
);
