import PublicReportingAPI from '@reportportal/agent-js-mocha/lib/publicReportingAPI';

const reportPortalUser = {
  username: 'hedg.automation',
  password: 'QI62geul',
};
// ReportPortal config data
const reportPortalUrl = 'https://rtportal.devopdata.co/';
const reportPortalProject = 'trade_logiq';
// get package.json script name to compose 'launchName' variable
const scriptName = process.env.npm_lifecycle_event;
const launchName = `${scriptName}_api`;
// use TAG env variable for 'ci' and 'regression' test runs
const TAG = process.env.TAG;

export default {
  /** General */
  reportConfig: {
    reporter: '@reportportal/agent-js-mocha',
    reporterOptions: {
      token: 'cccfcc8e-eb46-4121-9cf3-2f06d470196e',
      endpoint: `${reportPortalUrl}/api/v1`,
      project: reportPortalProject,
      launch: launchName,
      attributes: TAG !== undefined ? [{ key: 'tag', value: TAG }] : [],
      /* before and after hooks display parameter */
      reportHooks: true,
      /* 'skippedIssue: true' - skipped tests will be marked as 'To Investigate', 'false' - will not be marked */
      skippedIssue: false,
    },
    timeout: 20000,
  },

  /** Log info via PublicReportingAPI */
  async logInfo(message) {
    PublicReportingAPI.log('INFO', message);
    console.log(message);
  },

  /** ReportPortal API */
  async getAccessToken(agent) {
    const auth = 'Basic ' + Buffer.from('ui:uiman').toString('base64');

    const headers = {
      Authorization: auth,
      'Content-Type': 'application/json',
    };

    return await agent
      .post(`${reportPortalUrl}/uat/sso/oauth/token`)
      .set(headers)
      .set('Content-Type', 'multipart/form-data')
      .field('grant_type', 'password')
      .field('username', reportPortalUser.username)
      .field('password', reportPortalUser.password)
      .then((res) => {
        res.statusCode === 200
          ? console.log(`reportHelper.getAccessToken res: ${JSON.stringify(res.body)}`)
          : console.log(`reportHelper.getAccessToken status code error: ${JSON.stringify(res.body)}`);
        return res.body;
      })
      .catch((err) => {
        console.log(`reportHelper.getAccessToken err: ${JSON.stringify(err)}`);
      });
  },

  async getLatestLaunch(agent, accessToken, launchName) {
    const headers = {
      Authorization: `bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    return await agent
      .get(`${reportPortalUrl}/api/v1/${reportPortalProject}/launch/latest?filter.eq.name=${launchName}`)
      .set(headers)
      .then((res) => {
        res.statusCode === 200
          ? console.log(`reportHelper.getLatestLaunch res: ${JSON.stringify(res.body)}`)
          : console.log(`reportHelper.getLatestLaunch status code error: ${JSON.stringify(res.body)}`);
        return res.body;
      })
      .catch((err) => {
        console.log(`reportHelper.getLatestLaunch err: ${JSON.stringify(err)}`);
      });
  },

  async getLatestLaunchAll(agent) {
    const getAccessTokenRes = await this.getAccessToken(agent);
    const accessToken = getAccessTokenRes.access_token;
    const getLatestLaunchRes = await this.getLatestLaunch(agent, accessToken, launchName);
    return getLatestLaunchRes.content[0];
  },

  async getLatestLaunchLink(launchId) {
    const latestLaunchLink = `${reportPortalUrl}/ui/#${reportPortalProject}/launches/all/${launchId}`;
    console.log(`\n--- ReportPortal launch link: ${latestLaunchLink}`);
    return latestLaunchLink;
  },

  async getPreviousLaunch(agent, launchName) {
    const getAccessTokenRes = await this.getAccessToken(agent);
    const headers = {
      Authorization: `bearer ${getAccessTokenRes.access_token}`,
      'Content-Type': 'application/json',
    };
    return agent
      .get(
        `${reportPortalUrl}api/v1/${reportPortalProject}/launch?page.size=2&filter.any.compositeAttribute=tag%3Aci%2Ctag%3Aregression&page.sort=startTime%2Cnumber%2CDESC&filter.eq.name=${launchName}`
      )
      .set(headers)
      .then((res) => {
        res.statusCode === 200
          ? console.log(`reportHelper.getPreviousLaunch res: ${JSON.stringify(res.body)}`)
          : console.log(`reportHelper.getPreviousLaunch status code error: ${JSON.stringify(res.body)}`);
        return res;
      })
      .catch((err) => {
        console.log(`reportHelper.getPreviousLaunch err: ${JSON.stringify(err)}`);
      });
  },

  async finishLaunch(agent, uuid, endTime) {
    const getAccessTokenRes = await this.getAccessToken(agent);
    const headers = {
      Authorization: `bearer ${getAccessTokenRes.access_token}`,
      'Content-Type': 'application/json',
    };
    return agent
      .put(`${reportPortalUrl}api/v1/${reportPortalProject}/launch/${uuid}/finish`)
      .set(headers)
      .send({
        endTime: `${endTime}`,
      })
      .then((res) => {
        res.statusCode === 200
          ? console.log(`reportHelper.finishLaunch res: ${JSON.stringify(res.body)}`)
          : console.log(`reportHelper.finishLaunch status code error: ${JSON.stringify(res.body)}`);
        return res;
      })
      .catch((err) => {
        console.log(`reportHelper.finishLaunch err: ${JSON.stringify(err)}`);
      });
  },
};
