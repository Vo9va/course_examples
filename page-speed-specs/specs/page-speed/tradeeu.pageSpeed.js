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

describe('TradeEU Google PageSpeed', function () {
  it('Main Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradeEU.main);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradeEU.main);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('AboutUs Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradeEU.about_us);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradeEU.about_us);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('ContactUs Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradeEU.contact_us);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradeEU.contact_us);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('Legal Documentation Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradeEU.legal_documentation);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradeEU.legal_documentation);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('Trading Conditions Page', async function () {
    const resDesktop = await pageSpeedHelper.checkPageSpeedForDesktopUrl(agent, routes.tradeEU.trading_conditions);
    expect(resDesktop.status).to.equal(200);
    let percentDesktop = pageSpeedHelper.getPerformanceScorePercent(resDesktop);

    const resMobile = await pageSpeedHelper.checkPageSpeedForMobileUrl(agent, routes.tradeEU.trading_conditions);
    expect(resMobile.status).to.equal(200);
    let percentMobile = pageSpeedHelper.getPerformanceScorePercent(resMobile);

    /** Reporting */
    reporting(this.test.title, percentDesktop, percentMobile);

    /** Assertions */
    expect(percentDesktop).to.be.not.lessThan(validPercentValue);
    expect(percentMobile).to.be.not.lessThan(validPercentValue);
  }).timeout(constants.TIMEOUT.WAIT_70s);

  it('General report', async function () {
    console.info('----------------------');
    reportData.forEach((item) => {
      reportPortalHelper.logInfo(
        `[${item.name}] - Desktop performance score: ${item.desktop}% | Mobile performance score: ${item.mobile}%`
      );
    });
  });
});
