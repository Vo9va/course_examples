import { expect } from 'chai';
import agent from '../../../test-utils/helpers/agent.helper';
import constants from '../../../test-data/constants';
import routes from '../../resources/routes';
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

describe('InvestFW Mobile Friendly', function () {
  it('C24794 Main Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.main);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24795 AboutUs Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.investFW.about_us);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24796 ContactUs Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.investFW.contact_us);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24797 Economic Calendar Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.investFW.economic_calendar);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24798 Knowledge Assets Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.investFW.knowledge_center_assets);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24799 Knowledge Center faq Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.investFW.knowledge_center_faq);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24800 Knowledge Glossary Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.investFW.knowledge_center_glossary);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24801 Legal Documentation Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.investFW.legal_documentation);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24802 Payment Methods Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.investFW.payment_methods);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24803 Trading Conditions Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.investFW.trading_conditions);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24804 Trading Holidays Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.investFW.trading_hours);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24228 General report', async function () {
    console.info('----------------------------------');
    reportData.forEach((item) => {
      item.mobileFriendliness === undefined
        ? reportPortalHelper.logInfo(
            `[${item.name}] - Test Status: ${item.testStatus.status} | Mobile Friendliness: FAIL`
          )
        : reportPortalHelper.logInfo(
            `[${item.name}] - Test Status: ${item.testStatus.status} | Mobile Friendliness: ${item.mobileFriendliness}`
          );
    });
  });
});
