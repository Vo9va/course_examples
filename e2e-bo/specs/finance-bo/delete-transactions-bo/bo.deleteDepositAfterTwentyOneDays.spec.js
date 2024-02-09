import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boWalletHelper from '../../../../test-utils/helpers/helpers-bo/bo.wallet.helper';
import config from '../../../../config';

describe('C25590 Financial Flow - No possibility to delete the deposit made by customers after 21 days', function () {
  const { depositOver21DaysData } = config.default;
  const superAdminBO = boUserData.getAdminBoDataForLogin(9, process.env.BRAND);
  let cid = depositOver21DaysData.customerWithDepositOver21Days;
  let idTransaction = depositOver21DaysData.depositOver21Days;

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
  });

  it('Delete deposit after 21 days', async function () {
    const resDelete = await boWalletHelper.deleteTransaction(agent, cid, { id: idTransaction });

    expect(resDelete.status).to.equal(403);
    expect(resDelete.body.message).to.equal('Transaction is not allowed to delete');
  });
});
