import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import config, { brand } from '../../../../config';

describe('C25627 Customer Search - Last communication date is updated after sending Telegram message to a customer', function () {
  let createdMessageDateAndTime;
  const { customerWithActiveTelegramCid } = config.default;
  const superAdminBO = boUserData.getAdminBoDataForLogin(2, process.env.BRAND);

  before(async function () {
    const excludedBrands = ['NRDX', 'WC1'];
    if (excludedBrands.includes(brand)) this.skip(); // TODO need customer with telegram
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it(`Send telegram message`, async function () {
    const resSendTelegramMessage = await boCustomerHelper.sendTelegramMessage(agent, {
      provider: 'telegram',
      cid: customerWithActiveTelegramCid,
      message: 'Test message',
    });

    expect(resSendTelegramMessage.statusCode).to.equal(200);
  });

  it('Get communication date after send telegram message', async function () {
    const resGetCommunications = await boCustomerHelper.waitForGetCustomerCommunications(
      agent,
      customerWithActiveTelegramCid
    );

    expect(resGetCommunications.statusCode).to.equal(200);
    expect(resGetCommunications.body.rows[0].communication_channel_id).to.equal('telegram');
    expect(resGetCommunications.body.rows[0].type).to.equal('text');

    createdMessageDateAndTime = resGetCommunications.body.rows[0].sent_at;
  });

  it('Check last communication date in customer search by cid and create sms date and time', async function () {
    const resLastCommunication = await boCustomerHelper.waitForGetCustomerSearchInfoByCid(
      agent,
      customerWithActiveTelegramCid,
      createdMessageDateAndTime.slice(0, 10)
    );

    expect(resLastCommunication.statusCode).to.equal(200);
    expect(resLastCommunication.body.rows[0].cid).to.equal(customerWithActiveTelegramCid);
    expect(resLastCommunication.body.rows[0].last_interaction_date).to.contain(createdMessageDateAndTime.slice(0, 10));
  });
});
