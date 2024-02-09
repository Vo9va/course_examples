import sleep from '../sleep.helper';
import imaps from 'imap-simple';
import { find } from 'lodash';
import quotedPrintable from 'quoted-printable';
import reportPortalHelper from '../reportPortal.helper';
import config from '../../../config';
import proxy from '../proxy.helper';
import getHrefs from 'get-hrefs';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const emailBoxHost = 'qamail.devopdata.co';

class EmailPostfixHelper {
  async getEmailBoxData(userData) {
    return {
      imap: {
        user: userData.email,
        password: userData.password,
        host: emailBoxHost,
        port: 993,
        tls: true,
        authTimeout: 3000,
      },
    };
  }

  async getEmailBody(userData, searchCriteria = ['UNSEEN']) {
    const emailCredentials = this.getEmailBoxData(userData);
    const connection = await imaps.connect(await emailCredentials);
    await connection.openBox('INBOX');
    let fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: true,
    };
    const messages = await connection.search(searchCriteria, fetchOptions);
    await connection.end();

    return messages
      .map(function (item) {
        let all = find(item.parts, { which: 'TEXT' });
        return quotedPrintable.decode(all.body);
      })
      .join('');
  }

  async waitAndGetEmailBody(userData, searchCriterias) {
    for (let i = 1; i <= 9; i++) {
      let emailBody = await this.getEmailBody(userData, searchCriterias);
      if (emailBody === '') {
        await reportPortalHelper.logInfo(`Wait Email Body ${i} seconds`);
        await sleep(1000);
      } else {
        return emailBody;
      }
    }
  }

  async getLink(obj) {
    try {
      const results = getHrefs(obj);
      return results[1];
    } catch (e) {
      throw new Error(`emailManager.getLink error: ${e}`);
    }
  }

  async getLinkAfterRedirect(agent, url) {
    return agent
      .get(url)
      .proxy(proxy)
      .then((res) => {
        const redirectedurl = res.redirects.pop();
        res.status === 200
          ? reportPortalHelper.logInfo(`emailManager.getLinkAfterRedirect user uid: ${redirectedurl}`)
          : reportPortalHelper.logInfo(`emailManager.getLinkAfterRedirect status error: ${res}`);
        return redirectedurl.slice(-36);
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`emailManager.getLinkAfterRedirect error: ${JSON.stringify(err)}`);
      });
  }

  async resetPasswordByLink(agent, newPassword) {
    return agent
      .post(`${config.default.apiURL}/customers/reset-password`)
      .proxy(proxy)
      .send(newPassword)
      .then((res) => {
        res.status === 200
          ? reportPortalHelper.logInfo(`emailManager.resetPasswordByLink user uid: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`emailManager.resetPasswordByLink status error: ${JSON.stringify(res)}`);
        return res.body;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`emailManager.resetPasswordByLink error: ${JSON.stringify(err)}`);
      });
  }
}

export const emailHelper = new EmailPostfixHelper();
