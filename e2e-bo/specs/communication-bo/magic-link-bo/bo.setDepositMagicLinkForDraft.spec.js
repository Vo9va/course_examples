import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import config, { env } from '../../../../config';

describe('C25559 Communication - Magic link - "Deposit" via email for draft', function () {
  let cid;
  const { nfsToken, draftCustomerDepositMagicLinkCid } = config.default;
  let customerDraft = customerData.getCustomerDraft();
  const superAdminBO = boUserData.getAdminBoDataForLogin(1, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  if (env === 'prod') {
    it('Setup draft customer cid', async function () {
      cid = draftCustomerDepositMagicLinkCid;
    });
  } else {
    it('Create customer depositor', async function () {
      const resDraftCustomer = await customersHelper.createCustomerWithToken(agent, nfsToken, customerDraft);
      cid = resDraftCustomer.body.customer.cid;

      expect(resDraftCustomer.statusCode).to.equal(200);

      await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
    });
  }

  it(`Send 'deposit' magic link`, async function () {
    const resMagicLink = await boCustomerHelper.sendMagicLink(agent, cid, { type: 'deposit' });

    expect(resMagicLink.status).to.equal(400);
    expect(resMagicLink.body.message).to.equal("Can't generate magic link for draft customers");
  });
});
