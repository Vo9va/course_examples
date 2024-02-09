import proxy from '../../helpers/proxy.helper';
import reportPortalHelper from '../../helpers/reportPortal.helper';

const apiKEY = 'AIzaSyCEFvry_aJ8JGA1vzrATQNsFoNLreI9WuU';
const mobileFriendlyURL = `https://searchconsole.googleapis.com/v1/urlTestingTools/mobileFriendlyTest:run?key=${apiKEY}`;

export default {
  async checkMobileFriendly(agent, url) {
    let testData = { url: url, requestScreenshot: false };
    return await agent
      .post(mobileFriendlyURL)
      .proxy(proxy)
      .send(testData)
      .then((res) => {
        if (res.status !== 200) {
          reportPortalHelper.logInfo(`checkMobileFriendly status error: ${JSON.stringify(res)}`);
        }
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`checkMobileFriendly status error: ${err}`);
      });
  },
};
