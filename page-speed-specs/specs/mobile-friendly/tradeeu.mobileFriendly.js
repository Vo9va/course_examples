import { expect } from 'chai';
import agent from '../../../test-utils/helpers/agent.helper';
import routes from '../../resources/routes';
import constants from '../../../test-data/constants';
import reportPortalHelper from '../../../test-utils/helpers/reportPortal.helper';
import mobileFriendlyHelper from '../../../test-utils/helpers/helpers-brands/mobileFriendly.helper';

let reportData = [];

const validResponse = 'MOBILE_FRIENDLY';

function reporting(testTitle, result) {
  result.mobileFriendliness === undefined
    ? reportPortalHelper.logInfo(`Test Status: ${result.testStatus.status} | Mobile Friendliness: FAIL`)
    : reportPortalHelper.logInfo(
        `Test Status: ${result.testStatus.status} | Mobile Friendliness:' ${result.mobileFriendliness}`
      );

  reportData.push({
    name: testTitle,
    testStatus: result.testStatus,
    mobileFriendliness: result.mobileFriendliness,
  });
}

describe('TradeEU Mobile Friendly', function () {
  it('Main Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradeEU.main);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('AboutUs Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradeEU.about_us);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('ContactUs Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradeEU.contact_us);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('Legal Documentation Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradeEU.legal_documentation);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('Trading Conditions Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradeEU.trading_conditions);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('General report', async function () {
    console.info('----------------------------------');
    reportData.forEach((item) => {
      item.mobileFriendliness === undefined
        ? reportPortalHelper.logInfo(
            `[${item.name}] - Test Status: ${item.testStatus.status} | Mobile Friendliness: FAIL`
          )
        : reportPortalHelper.logInfo(
            `[${item.name}] - Test Status: ${item.testStatus.status} | Mobile Friendliness:' ${item.mobileFriendliness}`
          );
    });
  });
});
