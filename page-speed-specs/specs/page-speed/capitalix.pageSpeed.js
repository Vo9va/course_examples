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

describe('Сapitalix Google PageSpeed', function () {
  it('C24739 Main Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.capitalix.main);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.main);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24740 AboutUs Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.capitalix.about_us);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.about_us);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24741 Blog Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.capitalix.blog);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.blog);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24742 Clients Safety Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(
      agent,
      routes.capitalix.clients_safety_of_funds
    );
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.clients_safety_of_funds);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24743 ContactUs Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.capitalix.contact_us);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.contact_us);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24744 Account Types Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.capitalix.account_types);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.account_types);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24745 Economic Calendar Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.capitalix.economic_calendar);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.economic_calendar);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24746 Knowledge Assets Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(
      agent,
      routes.capitalix.knowledge_center_assets
    );
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.knowledge_center_assets);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24747 Knowledge Center faq Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.capitalix.knowledge_center_faq);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.knowledge_center_faq);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24748 Knowledge Glossary Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(
      agent,
      routes.capitalix.knowledge_center_glossary
    );
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(
      agent,
      routes.capitalix.knowledge_center_glossary
    );
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24749 Legal Documentation Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.capitalix.legal_documentation);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.legal_documentation);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24750 Payment Methods Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.capitalix.payment_methods);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.payment_methods);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24751 Trading Conditions Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.capitalix.trading_conditions);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.trading_conditions);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24752 Trading Holidays Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(
      agent,
      routes.capitalix.trading_hours_holidays
    );
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.capitalix.trading_hours_holidays);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('C24227 General report', async function () {
    console.info('----------------------');
    reportData.forEach((item) => {
      reportPortalHelper.logInfo(
        `[${item.name}] - Desktop performance score: ${item.desktop}% | Mobile performance score: ${item.mobile}%`
      );
    });
  });
});
