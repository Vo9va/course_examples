import Mocha from 'mocha';
import agent from './test-utils/helpers/agent.helper';
import fsHelper from './test-utils/helpers/fs.helper';
import reportPortalHelper from './test-utils/helpers/reportPortal.helper';
import config from './config';
import { testRailHelper } from './test-utils/helpers/testRail.helper';
import { slackHelper } from './test-utils/helpers/slack.helper';

const TAG = process.env.TAG || '';

const launchName = `${process.env.npm_lifecycle_event}_api`;
let reportLink;
let launchUuid;
let startTime;

if (config.REPORT === 'true') {
  let mochaMain = new Mocha(reportPortalHelper.reportConfig);

  process.on('exit', (code) => {
    code === 0 ? process.exit(0) : process.exit(1);
  });

  try {
    const specs = fsHelper.getMainTestsDirectoryByConfigProduct();
    fsHelper.getAllSpecFiles(specs);
    fsHelper.excludeFilesToRunOnProd();

    mochaMain.files = fsHelper.files;
    // exit with non-zero exit code, other wise fails will not fail mocha run
    mochaMain.run(async (failures) => {
      // is called after all tests finished
      // convert 'duration' value from milliseconds to minutes
      mochaMain._previousRunner.stats.duration = parseFloat(
        (mochaMain._previousRunner.stats.duration / 60000).toFixed(2)
      );
      await reportPortalHelper.finishLaunch(agent, launchUuid, startTime + 20);

      // ReportPortal launch link
      reportLink = await reportPortalHelper.getLatestLaunchLink(launchId);

      if (TAG === 'ci') {
        let resPreviousLaunch = await reportPortalHelper.getPreviousLaunch(agent, launchName);

        let previousResult = resPreviousLaunch.body.content[1].statistics.executions.failed;
        await slackHelper.sendSlackAlert(mochaMain._previousRunner.stats, reportLink, launchName, previousResult);
      }

      console.log('\nTest run info:', mochaMain._previousRunner.stats);
      // exit from the process with the appropriate code
      failures > 0 ? process.exit(1) : process.exit(0);
    });
  } catch (err) {
    console.error(`Test suite doesn't exists or set. Error: ${err}`);
  }
}

/** Mocha hooks */
let launchId;

export async function mochaGlobalSetup() {
  console.log('---before hook');
  if (config.REPORT === 'true') {
    let res = await reportPortalHelper.getLatestLaunchAll(agent);
    launchId = res.id;
    launchUuid = res.uuid;
    startTime = res.startTime;
  }
}

export const mochaHooks = {
  async afterEach() {
    // Update API test status to Automated
    if (config.TR_UPDATE === 'true') {
      await testRailHelper.updateTestStatusToAutomated(this.currentTest);
    }
  },
};
