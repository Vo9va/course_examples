import { expect } from 'chai';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import agent from '../../../../test-utils/helpers/agent.helper';
import boUserData from '../../../../test-data/bo/bo.user.data';

describe('C22362 CRUD User - create User', function () {
  let uid;
  let agentBody = boUserData.getAgentBody();
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
    expect(resCreateUser.body.user).to.have.property('uid');
    expect(resCreateUser.body.user.name).to.equal(agentBody.name);
    expect(resCreateUser.body.user.role).to.equal(agentBody.role);
  });

  it('Delete User', async function () {
    const resDeleteUser = await boUserHelper.deleteUserById(agent, uid);

    expect(resDeleteUser.status).to.equal(200);
  });
});
