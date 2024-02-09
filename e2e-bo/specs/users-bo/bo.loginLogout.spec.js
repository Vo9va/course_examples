import { expect } from 'chai';
import agent from '../../../test-utils/helpers/agent.helper';
import boUserHelper from '../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boUserData from '../../../test-data/bo/bo.user.data';
import { env } from '../../../config';

describe('C19965 Login. Logout', function () {
  const superAdminBO = boUserData.getAdminBoDataForLogin(env === 'prod' ? 14 : 15, process.env.BRAND);

  it('User login', async function () {
    const res = await boUserHelper.loginBoAdmin(agent, superAdminBO);

    expect(res.status).to.equal(200);
    expect(res.body.user.username).to.equal(superAdminBO.username);
  });

  it('User logout', async function () {
    const res = await boUserHelper.logoutBoAdmin(agent);

    expect(res.status).to.equal(200);
  });
});
