import { expect } from 'chai';
import agent from '../../../test-utils/helpers/agent.helper';
import constants from '../../../test-data/constants';
import routes from '../../resources/routes';
import reportPortalHelper from '../../../test-utils/helpers/reportPortal.helper';
import pageSpeedHelper from '../../../test-utils/helpers/helpers-brands/pageSpeed.helper';

let reportData = [];

const validPercentValue = 50;

function reporting(testTitle, percentDesktop, percentMobile) {
  reportPortalHelper.logInfo(
    `Desktop performance score: ${percentDesktop}% | Mobile performance score: ${percentMobile}%`
  );

  reportData.push({
    name: testTitle,
    desktop: percentDesktop,
    mobile: percentMobile,
  });
}

// TODO un-skip this `describe` when needed
describe.skip('TradEdge Google PageSpeed', function () {
  it('C24764 Main Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.main);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.main);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24765 AboutUs Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.about_us);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.about_us);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24766 Blog Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.blog);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.blog);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24767 Why Tradedge Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.why_tradedge);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.why_tradedge);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24768 ContactUs Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.contact_us);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.contact_us);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24769 Account Types Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.account_types);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.account_types);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24770 Legal Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.legal);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.legal);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24771 Platform Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.platform);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.platform);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24772 Markets Events Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.markets_events);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.markets_events);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24773 Markets Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.markets);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.markets);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24774 How to Trade Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.how_to_trade);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.how_to_trade);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24775 Payment Methods Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.payment_methods);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.payment_methods);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24776 Forex Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.forex);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.forex);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24777 News Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.news);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.news);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24778 Trading Conditions Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.trading_conditions);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.trading_conditions);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24779 Reviews Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradEdge.reviews);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradEdge.reviews);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24231 General report', async function () {
    console.info('----------------------');
    reportData.forEach((item) => {
      reportPortalHelper.logInfo(
        `[${item.name}] - Desktop performance score: ${item.desktop}% | Mobile performance score: ${item.mobile}%`
      );
    });
  });
});
