import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import errors from '../../../../test-data/ng/error.messages';
import config, { env } from '../../../../config';

// TODO failed by TL-11103
describe.skip('C25682 Marked as "Returned" - when the active customer was already without FTD', function () {
  const { nfsToken } = config.default;
  let customerActive = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 12 : 6, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    let resCustomerActive = await customersHelper.createCustomerWithToken(agent, nfsToken, customerActive);

    expect(resCustomerActive.statusCode).to.equal(200);
  });

  it('Re-registration draft customer with the same email', async function () {
    let draftCustomer = { ...customerActive };
    delete draftCustomer.password;
    delete draftCustomer.currency_id;
    const resDraftCustomer = await customersHelper.createCustomerWithToken(agent, nfsToken, draftCustomer);

    expect(resDraftCustomer.statusCode).to.equal(400);
    expect(resDraftCustomer.body.message).to.equal(errors.CUSTOMER_VALIDATION.emailExist);
  });
});
