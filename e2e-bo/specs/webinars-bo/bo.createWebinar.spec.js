import { expect } from 'chai';
import boUserData from '../../../test-data/bo/bo.user.data';
import boCommonData from '../../../test-data/bo/bo.common.data';
import boWebinarsHelper from '../../../test-utils/helpers/helpers-bo/bo.webinars.helper';
import boUserHelper from '../../../test-utils/helpers/helpers-bo/bo.user.helper';
import agent from '../../../test-utils/helpers/agent.helper';

describe('CRUD webinars', function () {
  let uid;
  let roomId;
  let webinarId;
  const superAdminBO = boUserData.getAdminBoDataForLogin(12, process.env.BRAND);
  let webinarSearchBody = boCommonData.getWebinarSearchData();

  before(async function () {
    let res = await boUserHelper.loginBoAdmin(agent, superAdminBO);
    uid = res.body.user.uid;
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
  });

  it('CRUD webinars - Get webinar rooms', async function () {
    let res = await boWebinarsHelper.getWebinarRooms(agent);
    roomId = res.body.rooms[0].room_id;

    expect(res.statusCode).to.equal(200);
  });

  it('C25729 CRUD webinars - Create webinar', async function () {
    let webinarBody = boCommonData.getWebinarBody(uid, roomId);
    let res = await boWebinarsHelper.createWebinar(agent, webinarBody);
    webinarId = res.body.webinar.webinar_id;

    expect(res.statusCode).to.equal(200);
  });

  it('CRUD webinars - Get created webinar by date', async function () {
    let res = await boWebinarsHelper.getWebinarsByDate(agent, webinarSearchBody.start_date, webinarSearchBody.brand_id);

    expect(res.statusCode).to.equal(200);

    let rows = res.body.rows;
    let foundWebinarId = rows.find((row) => row.webinar_id === webinarId).webinar_id;

    expect(foundWebinarId).to.equal(webinarId);
  });

  it('C25741 CRUD webinars - delete webinar', async function () {
    let resInvitation = await boWebinarsHelper.getWebinarInvitation(agent, webinarId);

    expect(resInvitation.statusCode).to.equal(200);

    let resDelete = await boWebinarsHelper.deleteWebinarById(agent, webinarId);

    expect(resDelete.statusCode).to.equal(200);
  });

  it('CRUD webinars - check that webinar is deleted', async function () {
    let res = await boWebinarsHelper.getWebinarsByDate(agent, webinarSearchBody.start_date, webinarSearchBody.brand_id);
    let rows = res.body.rows;
    let deleteResult = !rows.some((row) => row.webinar_id === webinarId);

    expect(deleteResult).to.be.true;
  });
});
