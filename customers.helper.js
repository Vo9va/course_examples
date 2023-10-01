module.exports = {
  async loginCustomer(agent, customer, params = {}) {
    const request = { ...customer, ...params };
    return agent
      .post(`https://api.capitalix.com/auth/login`)
      .set({
        NAME: 'x-ng-autotests-run',
        VALUE: '5d1lt0e8ypgrpz0',
      })
      .send(request)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw new Error(`customersHelper.loginCustomer err: ${JSON.stringify(err)}`);
      });
  },

  async logoutCustomer(agent) {
    return await agent
      .post(`https://api.capitalix.com/auth/logout`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw new Error(`customersHelper.logoutCustomer err: ${JSON.stringify(err)}`);
      });
  },
};
