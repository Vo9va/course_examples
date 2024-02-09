import proxy from '../proxy.helper';
import reportPortalHelper from '../reportPortal.helper';
import config from '../../../config';

export default {
  async loginBoAdmin(agent, adminBO) {
    return await agent
      .post(`${config.default.boApiURL}/auth/bo-login`)
      .proxy(proxy)
      .send({ username: adminBO.username, password: adminBO.password })
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boUserHelper.loginBoAdmin res: ${JSON.stringify(res.body.user)}`)
          : reportPortalHelper.logInfo(`boUserHelper.loginBoAdmin status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boUserHelper.loginBoAdmin err: ${JSON.stringify(err)}`);
      });
  },

  async logoutBoAdmin(agent) {
    return await agent
      .get(`${config.default.boApiURL}/auth/logout`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boUserHelper.logoutBoAdmin res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boUserHelper.logoutBoAdmin status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boUserHelper.logoutBoAdmin err: ${JSON.stringify(err)}`);
      });
  },

  async createUser(agent, userData) {
    return await agent
      .post(`${config.default.boApiURL}/bo/users`)
      .send(userData)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boUserHelper.createUser res: ${JSON.stringify(res.body.user)}`)
          : reportPortalHelper.logInfo(`boUserHelper.createUser status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boUserHelper.createUser error: ${JSON.stringify(err)}`);
      });
  },

  async updateUser(agent, uid, userData) {
    return await agent
      .put(`${config.default.boApiURL}/bo/users/${uid}`)
      .send(userData)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boUserHelper.updateUser res: ${JSON.stringify(res.body.user)}`)
          : reportPortalHelper.logInfo(`boUserHelper.updateUser status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boUserHelper.updateUser error: ${JSON.stringify(err)}`);
      });
  },

  async resetPasswordForUser(agent, username) {
    return await agent
      .post(`${config.default.boApiURL}/bo/users/reset-password-init`)
      .send(username)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boUserHelper.resetPasswordForUser res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boUserHelper.resetPasswordForUser status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boUserHelper.resetPasswordForUser error: ${JSON.stringify(err)}`);
      });
  },

  async deleteUserById(agent, uid) {
    return await agent
      .delete(`${config.default.boApiURL}/bo/users/${uid}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boUserHelper.deleteUserById res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boUserHelper.deleteUserById status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boUserHelper.deleteUserById error: ${err}`);
      });
  },

  async createGroup(agent, groupData) {
    return await agent
      .post(`${config.default.boApiURL}/bo/groups`)
      .send(groupData)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boUserHelper.createGroup res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boUserHelper.createGroup status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boUserHelper.createGroup error: ${err}`);
      });
  },

  async updateGroup(agent, id, groupData) {
    return await agent
      .put(`${config.default.boApiURL}/bo/groups/${id}`)
      .send(groupData)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boUserHelper.updateGroup res: ${JSON.stringify(res)}`)
          : reportPortalHelper.logInfo(`boUserHelper.updateGroup status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boUserHelper.updateGroup error: ${err}`);
      });
  },

  async deleteGroup(agent, id) {
    return await agent
      .delete(`${config.default.boApiURL}/bo/groups/${id}`)
      .proxy(proxy)
      .then((res) => {
        res.statusCode === 200
          ? reportPortalHelper.logInfo(`boUserHelper.deleteGroup res: ${JSON.stringify(res.body)}`)
          : reportPortalHelper.logInfo(`boUserHelper.deleteGroup status code error: ${JSON.stringify(res)}`);
        return res;
      })
      .catch((err) => {
        reportPortalHelper.logInfo(`boUserHelper.deleteGroup error: ${err}`);
      });
  },
};
