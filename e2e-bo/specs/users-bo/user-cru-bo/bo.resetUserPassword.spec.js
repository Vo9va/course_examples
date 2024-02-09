import { expect } from 'chai';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import agent from '../../../../test-utils/helpers/agent.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';

describe('C19525 CRUD User - reset User password', function () {
  let uid;
  let agentBody = boUserData.getAgentBody();
  let username = agentBody.username;
  const superAdminBO = boUserData.getAdminBoDataForLogin(14, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
  });

  it('Create User', async function () {
    const resCreateUser = await boUserHelper.createUser(agent, agentBody);
    uid = resCreateUser.body.user.uid;

    expect(resCreateUser.status).to.equal(200);
  });

  it('Reset User password', async function () {
    const resResetPassword = await boUserHelper.resetPasswordForUser(agent, { username });

    expect(resResetPassword.status).to.equal(200);
  });

  it('Delete User', async function () {
    const resDeleteUser = await boUserHelper.deleteUserById(agent, uid);

    expect(resDeleteUser.status).to.equal(200);
  });
});
