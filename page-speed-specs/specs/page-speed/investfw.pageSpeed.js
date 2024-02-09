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

describe('InvestFW Google PageSpeed', function () {
  it('C24753 Main Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.investFW.main);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.investFW.main);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24754 AboutUs Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.investFW.about_us);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.investFW.about_us);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24755 ContactUs Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.investFW.contact_us);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.investFW.contact_us);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24756 Economic Calendar Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.investFW.economic_calendar);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.investFW.economic_calendar);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24757 Knowledge Assets Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(
      agent,
      routes.investFW.knowledge_center_assets
    );
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.investFW.knowledge_center_assets);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24758 Knowledge Center faq Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.investFW.knowledge_center_faq);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.investFW.knowledge_center_faq);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24759 Knowledge Glossary Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(
      agent,
      routes.investFW.knowledge_center_glossary
    );
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(
      agent,
      routes.investFW.knowledge_center_glossary
    );
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24760 Legal Documentation Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.investFW.legal_documentation);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.investFW.legal_documentation);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24761 Payment Methods Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.investFW.payment_methods);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.investFW.payment_methods);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24762 Trading Conditions Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.investFW.trading_conditions);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.investFW.trading_conditions);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24763 Trading Holidays Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.investFW.trading_hours);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.investFW.trading_hours);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24229 General report', async function () {
    console.info('----------------------');
    reportData.forEach((item) => {
      reportPortalHelper.logInfo(
        `[${item.name}] - Desktop performance score: ${item.desktop}% | Mobile performance score: ${item.mobile}%`
      );
    });
  });
});
