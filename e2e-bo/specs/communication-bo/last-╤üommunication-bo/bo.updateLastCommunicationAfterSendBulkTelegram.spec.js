import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import constants from '../../../../test-data/constants';
import config, { brand } from '../../../../config';

describe('C25628 Customer Search - "Last communication date" is updated after sending Bulk Telegram to a customer', function () {
  let lastCommunicationMessageId;
  let createdMessageDateAndTime;
  const { customerWithActiveTelegramCid } = config.default;
  const superAdminBO = boUserData.getAdminBoDataForLogin(2, process.env.BRAND);

  before(async function () {
    const excludedBrands = ['NRDX', 'TradeEU', 'WC1'];
    if (excludedBrands.includes(brand)) this.skip();
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it(`Send Bulk Telegram to a customer`, async function () {
    const resSendBulkMessage = await boCustomerHelper.sendBulkMessage(agent, {
      cids: [customerWithActiveTelegramCid],
      message: {
        provider: 'telegram',
        type: 'text',
        text: `Bulk message test ${Date.now()}`,
        purpose: 'ftd',
      },
    });

    expect(resSendBulkMessage.statusCode).to.equal(200);
  });

  it('Get last communication data', async function () {
    const resLastCommunications = await boCustomerHelper.getCustomerCommunications(
      agent,
      customerWithActiveTelegramCid
    );
    lastCommunicationMessageId = resLastCommunications.body.rows[0].message_id;

    expect(resLastCommunications.statusCode).to.equal(200);
  });

  it('Wait for last communication message not equal previous message', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await boCustomerHelper.waitForLastCommunicationMessageIdNotEqualsTo(
      agent,
      customerWithActiveTelegramCid,
      lastCommunicationMessageId
    );
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
      createdMessageDateAndTime
    );

    expect(resLastCommunication.statusCode).to.equal(200);
    expect(resLastCommunication.body.rows[0].cid).to.equal(customerWithActiveTelegramCid);
    expect(resLastCommunication.body.rows[0].last_interaction_date).to.equal(createdMessageDateAndTime);
  });
});
