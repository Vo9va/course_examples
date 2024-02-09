import agent from '../../../test-utils/helpers/agent.helper';
import boUserData from '../../../test-data/bo/bo.user.data';
import customerCids from '../../test-data/cids';
import boUserHelper from '../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import sleep from '../../../test-utils/helpers/sleep.helper';

const cids = customerCids.cids;
const superAdminBO = boUserData.getAdminBoDataForLogin(1, process.env.BRAND);
const timeout = 0;

describe('BO:Sync Accounts', function () {
  beforeEach(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  afterEach(async function () {
    await boUserHelper.logoutBoAdmin(agent);
  });

  it(`Sync Accounts`, async function () {
    for (let i = 0; i < cids.length; i++) {
      await boCustomerHelper.syncCustomerLiveTradingAccountWithMT(agent, { cid: cids[i] });
      await sleep(timeout);
    }
  });
});
