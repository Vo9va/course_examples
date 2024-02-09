import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import { customersForAllBrands } from '../../../../test-data/email/emailAccounts.data';
import { emailHelper } from '../../../../test-utils/helpers/helpers-email/emailManager.helper';
import config, { brand } from '../../../../config';

describe('C19592 Communication - Magic link - "Reset password" via Email', function () {
  const { customerForResetPassword, emailSendBrand } = config.default;
  let uuidAfterRedirect;
  let newPassword = '111QQQaaa@';
  let customerDepositor = {
    ...customerData.getCustomerDepositor(),
    email: customersForAllBrands.emailForResetPassword.email,
    login: false,
  };
  const superAdminBO = boUserData.getAdminBoDataForLogin(1, process.env.BRAND);

  before(async function () {
    // TODO skipped for WC1 on prod due to limited permission access from broker side
    brand === 'WC1' && this.skip();
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
  });

  it('Send "Set password" via email', async function () {
    const resMagicLink = await boCustomerHelper.sendResetPasswordMagicLink(agent, customerForResetPassword);

    expect(resMagicLink.statusCode).to.equal(200);
  });

  it('Check that the mail received and get redirected url', async function () {
    const emailBody = await emailHelper.waitAndGetEmailBody(customersForAllBrands.emailForResetPassword, [
      'UNSEEN',
      ['SUBJECT', `Forgot your password?`],
      ['FROM', emailSendBrand],
    ]);

    const redirectUrl = await emailHelper.getLink(emailBody);

    uuidAfterRedirect = await emailHelper.getLinkAfterRedirect(agent, redirectUrl);
  });

  it('Change password', async function () {
    const res = await emailHelper.resetPasswordByLink(agent, {
      password_reset_code: uuidAfterRedirect,
      new_password: newPassword,
    });

    expect(res.status).to.equal('ok');
  });

  it('Customer login with new password', async function () {
    const res = await customersHelper.loginCustomer(agent, customerDepositor, {
      password: newPassword,
    });

    expect(res.statusCode).to.equal(200);
    expect(res.body.customer.cid).to.equal(customerForResetPassword);
  });
});
