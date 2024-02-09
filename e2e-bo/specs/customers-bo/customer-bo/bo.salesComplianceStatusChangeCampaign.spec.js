import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import config, { env } from '../../../../config';

describe('C19564 Sales/Compliance status & Marketing - Change Campaign', function () {
  let cid;
  const { campaignIdForUpdate } = config.default;
  let customerDepositor = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 11 : 5, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    const resDepositor = await customersHelper.waitTillCustomerCreated(agent, customerDepositor);
    cid = resDepositor.cid;

    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Change campaign for customer', async function () {
    const resUpdate = await boCustomerHelper.updateCustomer(agent, cid, { campaign_id: Number(campaignIdForUpdate) });

    expect(resUpdate.statusCode).to.equal(200);
  });

  it('Wait for customer campaign id changed', async function () {
    const resCustomer = await boCustomerHelper.waitForCustomerCampaignIdChanged(
      agent,
      cid,
      Number(campaignIdForUpdate)
    );

    expect(resCustomer.status).to.equal(200);
    expect(resCustomer.body.customer.campaign_id).to.equal(Number(campaignIdForUpdate));
  });
});
