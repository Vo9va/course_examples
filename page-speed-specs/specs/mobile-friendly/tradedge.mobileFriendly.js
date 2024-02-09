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

// TODO un-skip this `describe` when needed
describe.skip('TradEdge Mobile Friendly', function () {
  it('C24805 Main Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.main);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24806 AboutUs Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.about_us);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24807 Blog Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.blog);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24808 Why Tradedge Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.why_tradedge);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24809 ContactUs Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.contact_us);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24810 Account Types Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.account_types);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24811 Legal Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.legal);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24812 Platform Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.platform);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24813 Markets Events Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.markets_events);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24814 Markets Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.markets);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24815 How to Trade Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.how_to_trade);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24816 Payment Methods Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.payment_methods);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24817 Forex Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.forex);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24818 News Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.news);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24819 Trading Conditions Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.trading_conditions);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24820 Reviews Page', async function () {
    const res = await mobileFriendlyHelper.checkMobileFriendly(agent, routes.tradEdge.reviews);
    expect(res.status).to.equal(200);

    /** Reporting */
    let result = JSON.parse(res.text);
    reporting(this.test.title, result);

    /** Assertions */
    expect(result.mobileFriendliness).to.be.equal(validResponse);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24230 General report', async function () {
    console.info('----------------------------------');
    reportData.forEach((item) => {
      item.mobileFriendliness === undefined
        ? reportPortalHelper.logInfo(
            `[${item.name}] - Test Status: ${item.testStatus.status} | Mobile Friendliness: FA,,IL,`
          )
        : reportPortalHelper.logInfo(
            `[${item.name}] - Test Status: ${item.testStatus.status} | Mobile Friendliness: ${item.mobileFriendlines},`
          );
    });
  });
});
