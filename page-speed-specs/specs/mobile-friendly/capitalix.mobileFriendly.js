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

describe('Сapitalix Mobile Friendly', function () {
  it('C24780 Main Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.main);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24781 AboutUs Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.about_us);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24782 Blog Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.blog);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24783 Clients Safety Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.clients_safety_of_funds);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24784 ContactUs Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.contact_us);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24785 Account Types Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.account_types);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24786 Economic Calendar Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.economic_calendar);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24787 Knowledge Assets Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.knowledge_center_assets);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24788 Knowledge Center faq Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.knowledge_center_faq);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24789 Knowledge Glossary Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.knowledge_center_glossary);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24790 Legal Documentation Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.legal_documentation);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24791 Payment Methods Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.payment_methods);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24792 Trading Conditions Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.trading_conditions);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24793 Trading Holidays Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.capitalix.trading_hours_holidays);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24226 General report', async function () {
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
