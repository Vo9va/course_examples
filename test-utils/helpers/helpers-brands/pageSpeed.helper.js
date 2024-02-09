import proxy from '../../helpers/proxy.helper';
import reportPortalHelper from '../reportPortal.helper';

const apiKEY = 'AIzaSyCEFvry_aJ8JGA1vzrATQNsFoNLreI9WuU';
const pageSpeedURLDesktop = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?locale=en_US&strategy=desktop&key=${apiKEY}`;
const pageSpeedURLMobile = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?locale=en_US&strategy=mobile&key=${apiKEY}`;

export default {
  async checkPageSpeedForDesktopUrl(agent, url) {
    return await agent
      .get(pageSpeedURLDesktop + `&url=${url}`)
      .proxy(proxy)
      .then((res) => {
        if (res.status !== 200) {
          reportPortalHelper.logInfo(`checkPageSpeedForDesktopUrl statusCode error: ${JSON.stringify(res)}`);
        }
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`checkPageSpeedForDesktopUrl err: ${err}`);
      });
  },

  async checkPageSpeedForMobileUrl(agent, url) {
    return await agent
      .get(pageSpeedURLMobile + `&url=${url}`)
      .proxy(proxy)
      .then((res) => {
        if (res.status !== 200) {
          reportPortalHelper.logInfo(`checkPageSpeedForMobileUrl statusCode error: ${JSON.stringify(res)}`);
        }
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`checkPageSpeedForMobileUrl err: ${err}`);
      });
  },

  getPerformanceScorePercent(res) {
    return res.body.lighthouseResult.categories.performance.score * 100;
  },
};
