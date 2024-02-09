const superagent = require('superagent');
require('superagent-retry-delay')(superagent);
const agent = superagent.agent();

export default agent;
