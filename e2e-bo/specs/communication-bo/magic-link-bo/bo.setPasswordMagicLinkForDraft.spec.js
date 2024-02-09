import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import config, { brand, env } from '../../../../config';
import { emailHelper } from '../../../../test-utils/helpers/helpers-email/emailManager.helper';
import { customersForAllBrands } from '../../../../test-data/email/emailAccounts.data';

describe('C19583 Communication - Magic link - "Set password" via email for draft', function () {
  let cid;
  const { nfsToken, draftCustomerSetPasswordMagicLinkCid } = config.default;
  let customerDraft = {
    ...customerData.getCustomerDraft(),
    login: false,
    email:
      env === 'prod'
        ? customersForAllBrands.emailForDraftCustomerProd.email
        : customersForAllBrands.emailForDraftCustomer.email,
  };
  const superAdminBO = boUserData.getAdminBoDataForLogin(1, process.env.BRAND);

  before(async function () {
    // TODO skipped for WC1 on prod due to limited permission access from broker side
    brand === 'WC1' && this.skip();
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  if (env === 'prod') {
    it('Setup draft customer cid', async function () {
      cid = draftCustomerSetPasswordMagicLinkCid;
    });
  } else {
    it('Checking that mail is available for the setup', async function () {
      const existUser = await boCustomerHelper.searchCustomer(agent, customersForAllBrands.emailForDraftCustomer.email);

      if (!existUser.rows.length) return;
      await boCustomerHelper.updateCustomer(agent, existUser.rows[0].cid, customerData.updateDataForDraftCustomer);
    });

    it('Create customer depositor', async function () {
      const resDraftCustomer = await customersHelper.createCustomerWithToken(agent, nfsToken, customerDraft);
      cid = resDraftCustomer.body.customer.cid;

      expect(resDraftCustomer.statusCode).to.equal(200);

      await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
    });
  }

  it('Send "Set password" via email for draft', async function () {
    const resMagicLink = await boCustomerHelper.sendMagicLink(agent, cid);

    expect(resMagicLink.statusCode).to.equal(200);
  });

  it('Check that the mail received', async function () {
    await emailHelper.waitAndGetEmailBody(
      {
        email:
          env === 'prod'
            ? customersForAllBrands.emailForDraftCustomerProd.email
            : customersForAllBrands.emailForDraftCustomer.email,
        password: 'ZAQ!2wsx1',
      },
      ['UNSEEN', ['SUBJECT', `Your ${process.env.BRAND.toUpperCase()} link is ready !`]]
    );
  });
});
