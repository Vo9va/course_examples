import request from 'superagent';
// extend with Request#proxy()
require('superagent-proxy')(request);
// HTTP, HTTPS, or SOCKS proxy to use
const proxy = process.env.GLOBAL_AGENT_HTTP_PROXY;
export default proxy;
