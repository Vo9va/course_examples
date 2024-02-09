import { expect } from 'chai';
import agent from '../../../test-utils/helpers/agent.helper';
import boUserData from '../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boLeadsHubHelper from '../../../test-utils/helpers/helpers-bo/bo.leads.hub.helper';
import boLeadsHubData from '../../../test-data/bo/bo.leads.hub.data';

describe('LeadHub CRUD', function () {
  let ruleId;
  const superAdminBO = boUserData.getAdminBoDataForLogin(11, process.env.BRAND);
  let leadsHubRuleData = boLeadsHubData.leadsHubRuleData();
  let leadsHubRuleDataForUpdate = boLeadsHubData.leadsHubRuleDataForUpdate();

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
  });

  it('C19640 LeadsHub - Create new rule', async function () {
    let resCreateLeadsHub = await boLeadsHubHelper.createLeadsHubRule(agent, leadsHubRuleData);
    ruleId = resCreateLeadsHub.body.id;

    expect(resCreateLeadsHub.statusCode).to.equal(200);
    expect(resCreateLeadsHub.body.active).to.equal(true);
    expect(resCreateLeadsHub.body.campaigns[0].rule_id).to.equal(ruleId);
    expect(resCreateLeadsHub.body.countries[0].rule_id).to.equal(ruleId);
    expect(resCreateLeadsHub.body.languages[0].rule_id).to.equal(ruleId);

    let resLeadsHubList = await boLeadsHubHelper.getLeadsHubRuleList(agent);

    expect(resLeadsHubList.body.rows[0].id).to.equal(ruleId);
  });

  it('C19641 LeadsHub - Editing rule', async function () {
    let resLeadsHubUpdate = await boLeadsHubHelper.updateLeadsHubRuleById(agent, ruleId, leadsHubRuleDataForUpdate);

    expect(resLeadsHubUpdate.statusCode).to.equal(200);

    let resLeadsHubList = await boLeadsHubHelper.getLeadsHubRuleList(agent);

    expect(resLeadsHubList.statusCode).to.equal(200);
    expect(resLeadsHubList.body.rows[0].outputs[0]).to.deep.equal(leadsHubRuleDataForUpdate.outputs[0]);
    expect(resLeadsHubList.body.rows[0].campaigns[0]).to.deep.equal(leadsHubRuleDataForUpdate.campaigns[0]);
    expect(resLeadsHubList.body.rows[0].countries[0]).to.deep.equal(leadsHubRuleDataForUpdate.countries[0]);
    expect(resLeadsHubList.body.rows[0].languages[0]).to.deep.equal(leadsHubRuleDataForUpdate.languages[0]);
  });

  it('C19642 LeadsHub - Deactivation rule', async function () {
    let resLeadsHubUpdate = await boLeadsHubHelper.updateLeadsHubRuleById(agent, ruleId, {
      ...leadsHubRuleDataForUpdate,
      active: false,
    });

    expect(resLeadsHubUpdate.statusCode).to.equal(200);

    let resLeadsHub = await boLeadsHubHelper.getLeadsHubRuleById(agent, ruleId);

    expect(resLeadsHub.statusCode).to.equal(200);
    expect(resLeadsHub.body.active).to.equal(false);
  });

  it('C19643 LeadsHub - Deleting rule', async function () {
    let resLeadsHubDelete = await boLeadsHubHelper.deleteLeadsHubRuleById(agent, ruleId);

    expect(resLeadsHubDelete.statusCode).to.equal(200);

    let resLeadsHub = await boLeadsHubHelper.getLeadsHubRuleById(agent, ruleId);

    expect(resLeadsHub.statusCode).to.equal(404);
    expect(resLeadsHub.body.message).to.equal('Rule not found');
  });
});
