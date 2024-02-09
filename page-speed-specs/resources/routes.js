import { env } from '../../config';

let capitalixDomain;
let investFwDomain;
let tradEdgeDomain;
let tradeEuDomain;

if (env === 'stage') {
  capitalixDomain = 'https://www.stage-capitalix.com/';
  investFwDomain = 'https://www.stage-investfw.com/';
  tradEdgeDomain = 'https://www.stage-tradedge.com/';
  tradeEuDomain = 'https://www.stage-tradeeu.com/?security=f3b849f7a2abaec1d8e62a6dd5dfd64c/';
}

if (env === 'prod') {
  capitalixDomain = 'https://www.capitalix.com/';
  investFwDomain = 'https://www.investfw.com/';
  tradEdgeDomain = 'https://www.tradedge.com/';
  tradeEuDomain = 'https://www.tradeeu.com/?security=f3b849f7a2abaec1d8e62a6dd5dfd64c/';
}

const routes = {
  capitalix: {
    main: capitalixDomain,
    about_us: capitalixDomain + 'about-us',
    clients_safety_of_funds: capitalixDomain + 'clients-safety-of-funds',
    contact_us: capitalixDomain + 'contact-us',
    blog: capitalixDomain + 'blog',
    account_types: capitalixDomain + 'account-types',
    trading_hours_holidays: capitalixDomain + 'trading-hours-holidays',
    trading_conditions: capitalixDomain + 'trading-conditions',
    economic_calendar: capitalixDomain + 'economic-calendar',
    payment_methods: capitalixDomain + 'payment-methods',
    knowledge_center_assets: capitalixDomain + 'knowledge-center-assets/nasdaq-100',
    knowledge_center_faq: capitalixDomain + 'knowledge-center-faq',
    knowledge_center_glossary: capitalixDomain + 'knowledge-center-glossary',
    legal_documentation: capitalixDomain + 'legal-documentation',
  },
  investFW: {
    main: investFwDomain,
    about_us: investFwDomain + 'about-us',
    contact_us: investFwDomain + 'contact-us',
    trading_hours: investFwDomain + 'trading-hours',
    trading_conditions: investFwDomain + 'trading-conditions',
    economic_calendar: investFwDomain + 'economic-calendar',
    payment_methods: investFwDomain + 'payment-methods',
    knowledge_center_assets: investFwDomain + 'knowledge-center-assets',
    knowledge_center_faq: investFwDomain + 'knowledge-center-faq',
    knowledge_center_glossary: investFwDomain + 'knowledge-center-glossary',
    legal_documentation: investFwDomain + 'legal-documentation',
  },
  tradEdge: {
    main: tradEdgeDomain,
    about_us: tradEdgeDomain + 'about-us',
    why_tradedge: tradEdgeDomain + 'why-tradedge',
    contact_us: tradEdgeDomain + 'contact-us',
    legal: tradEdgeDomain + 'legal',
    platform: tradEdgeDomain + 'platform',
    trading_conditions: tradEdgeDomain + 'trading-conditions',
    markets_events: tradEdgeDomain + 'markets-events',
    account_types: tradEdgeDomain + 'account-types',
    payment_methods: tradEdgeDomain + 'payment-methods',
    markets: tradEdgeDomain + 'markets',
    how_to_trade: tradEdgeDomain + 'how-to-trade',
    forex: tradEdgeDomain + 'forex',
    news: tradEdgeDomain + 'news',
    reviews: tradEdgeDomain + 'reviews',
    blog: tradEdgeDomain + 'blog',
  },
  tradeEU: {
    main: tradeEuDomain,
    about_us: tradeEuDomain + 'about-us',
    contact_us: tradeEuDomain + 'contact-us',
    legal_documentation: tradeEuDomain + 'legal',
    trading_conditions: tradeEuDomain + 'trading-conditions',
  },
};

export default routes;
