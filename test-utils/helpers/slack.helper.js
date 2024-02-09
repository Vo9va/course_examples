import SlackNotify from './slack-notify';

const ENV = process.env.ENV || '';
const SLACK_WEBHOOK_URL =
  ENV !== 'prod'
    ? 'https://hooks.slack.com/services/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'
    : 'https://hooks.slack.com/services/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';
const slack = SlackNotify(SLACK_WEBHOOK_URL);

class SlackHelper {
  async slackAlert(reportLink, status, result, popupColor, launchName, emoji) {
    let failedCountTests;
    let skippedCountTests;
    result.failed === 0 ? (failedCountTests = 0) : (failedCountTests = result.failures);
    result.pending === 0 ? (skippedCountTests = 0) : (skippedCountTests = result.pending);

    await slack.send({
      channel: ENV === 'prod' ? '#ng-e2e-prod-circle' : '#ng-e2e-circle',
      text: `${emoji} ${launchName}`,
      attachments: [
        {
          color: popupColor,
          fields: [
            { title: 'Report Portal URL', value: `${reportLink}`, short: true },
            { title: 'Status', value: `${status}`, short: true },
            { title: 'Total', value: result.tests, short: true },
            { title: 'Passed', value: result.passes, short: true },
            { title: 'Failed', value: failedCountTests, short: true },
            { title: 'Skipped', value: skippedCountTests, short: true },
          ],
        },
      ],
    });
  }

  async sendSlackAlert(currentResult, reportLink, launchName, previousCountFailedTests) {
    if (ENV !== 'prod') {
      if (currentResult.failures > 0) {
        if (previousCountFailedTests === undefined && currentResult.failures > 0) {
          await this.slackAlert(reportLink, 'FAILED', currentResult, 'danger', launchName, ':sob:');
        }
      } else {
        if (previousCountFailedTests !== undefined && currentResult.failures === 0) {
          await this.slackAlert(reportLink, 'SUCCESS', currentResult, 'good', launchName, ':tada:');
        }
      }
    } else {
      if (currentResult.failures === 0) {
        await this.slackAlert(reportLink, 'SUCCESS', currentResult, 'good', launchName, ':tada:');
      } else {
        await this.slackAlert(reportLink, 'FAILED', currentResult, 'danger', launchName, ':sob:');
      }
    }
  }
}

export const slackHelper = new SlackHelper();
