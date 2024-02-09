import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import constants from '../../../../test-data/constants';
import walletData from '../../../../test-data/ng/common.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import boWalletHelper from '../../../../test-utils/helpers/helpers-bo/bo.wallet.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import config from '../../../../config';

describe('C25476 Assign from customer page - positive flow (BO Units - Assign on Unit) for Compliance team', function () {
  let cid;
  let confirmUrl;
  const { secureCode, uids, complianceDepartment_id } = config.default;
  let customer = customerData.getCustomerDepositor();
  const complianceAdminBO = boUserData.getAdminBoDataForLogin(
    21,
    process.env.BRAND,
    'Compliance',
    uids.complianceDepartmentManager
  );

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, complianceAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    const res = await customersHelper.waitTillCustomerCreated(agent, customer);
    cid = res.cid;
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it(`Create and confirm deposit from BO`, async function () {
    const depositRes = await boWalletHelper.createDeposit(agent, cid);

    expect(depositRes.statusCode).to.equal(200);
    expect(depositRes.body.proceedRequestParams).to.have.property('url');

    confirmUrl = depositRes.body.proceedRequestParams.url;
    const confirmRes = await boWalletHelper.confirmDeposit(agent, confirmUrl, secureCode);

    expect(confirmRes.statusCode).to.equal(200);
  });

  it(`Wait that balance change`, async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    await boCustomerHelper.waitForBalanceChange(agent, cid, constants.MODE.REAL, walletData.deposit.amount);
  });

  it(`Assign in customer complains`, async function () {
    let resAssign = await boCustomerHelper.assignCustomerCompliance(agent, [cid], {
      department: complianceDepartment_id,
    });

    expect(resAssign.statusCode).to.equal(200);

    const resCustomer = await boCustomerHelper.getCustomer(agent, cid);

    expect(resCustomer.status).to.equal(200);
    expect(resCustomer.body.customer.assignment_compliance.department_id).to.equal(complianceDepartment_id);
  });
});
