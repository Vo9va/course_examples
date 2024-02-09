import { expect } from 'chai';
import boUserData from '../../../test-data/bo/bo.user.data';
import boCommonData from '../../../test-data/bo/bo.common.data';
import boUserHelper from '../../../test-utils/helpers/helpers-bo/bo.user.helper';
import agent from '../../../test-utils/helpers/agent.helper';

describe('C19527 Management - update Group', function () {
  let groupId;
  let groupBody = boCommonData.getGroupBody();
  let groupName = groupBody.name;
  const superAdminBO = boUserData.getAdminBoDataForLogin(12, process.env.BRAND);

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
  });

  it('Create Group', async function () {
    const resCreateGroup = await boUserHelper.createGroup(agent, groupBody);
    groupId = resCreateGroup.body.group.id;

    expect(resCreateGroup.status).to.equal(200);
  });

  it('Update Group', async function () {
    const resUpdateGroup = await boUserHelper.updateGroup(agent, groupId, {
      name: groupName,
      permissions: [6, 157, 9, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 180, 168, 169, 170, 171, 172],
    });

    expect(resUpdateGroup.status).to.equal(200);
  });

  it('Delete Group', async function () {
    const resDeleteGroup = await boUserHelper.deleteGroup(agent, groupId);

    expect(resDeleteGroup.status).to.equal(200);
  });
});
