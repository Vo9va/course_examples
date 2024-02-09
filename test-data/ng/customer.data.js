import config from '../../config';
import randomString from 'randomstring';

const foBrand = process.env.BRAND;

const { brand, env, product, customer_data, campaignId } = config.default;

const getRandomEmail = function () {
  const randomPrefix = 'test' + Math.random().toString(36);
  return `ng_e2e_api_${randomPrefix}@mailinator.com`;
};

const getRandomName = function (length) {
  return randomString.generate({
    length: length,
    charset: 'alphabetic',
  });
};

const customerLead = {
  email: 'defaulth_ng_e2e@blackrockng.com',
  mobile: customer_data.phone,
  password: '123456Aa@',
  first_name: 'Qa',
  last_name: 'API',
  brand_id: brand.toUpperCase(),
  system_id: 'web',
  login_type_id: 'regular',
  country_id: customer_data.country_id,
  lang_id: 'en',
  daily_deposit_limit: 100,
  auth_method: 'regular',
  token: 'string',
  login: 'true',
};

const customerDepositor = {
  ...customerLead,
  currency_id: customer_data.currency,
  address: 'Street',
  city: 'Oslo',
  zip: '1234',
  birth_date: '2000-01-20',
  gender: 'm',
  daily_deposit_limit: 100,
  cxd: 'test',
  auth_method: 'regular',
  token: 'string',
};

const customerDraft = {
  email: 'defaulth_ng_e3e@blackrockng.com',
  mobile: '+4748130055',
  first_name: 'Qa',
  last_name: 'API',
  brand_id: brand.toUpperCase(),
  system_id: 'web',
  login_type_id: 'regular',
  country_id: customer_data.country_id,
  lang_id: 'en',
  daily_deposit_limit: 100,
  auth_method: 'regular',
  token: 'string',
  login: 'false',
};

const customerFirstNameUpdate = {
  first_name: 'new_first_name',
};

const customerCurrencyUpdate = {
  currency_id: 'EUR',
  address: 'Street',
  city: 'Oslo',
  zip: '1234',
  birth_date: '2000-01-20',
};

const customerDraftActivate = {
  password: '123456Aa@',
};
// TODO refactor data for InvestFW and TradEdge brands
const customerSetupPassword = {
  email: 'defaulth_ng_e3e@blackrockng.com',
  code: 'e4f48aa9-bc56-4f44-9e9f-f0694718c899__1585309937782',
  password: '123456Aa@',
  brand_id: brand.toUpperCase(),
};

const customerAutoLogin = {
  token: 'e4f48aa9-bc56-4f44-9e9f-f0694718c899__1585309937782',
  system_id: 'web',
  brand_id: brand.toUpperCase(),
};

const customerTradingAccount = {
  account_id: 111111,
};

/** KYC data */
let customerQuestionnaire;

const questionnaireCapitalix = {
  customer_answers: [
    {
      question_id: 19,
      answer_id: null,
      answer: 'UA',
    },
    {
      question_id: 20,
      answer_id: null,
      answer: 'test',
    },
    {
      question_id: 21,
      answer_id: 159,
    },
    {
      question_id: 22,
      answer_id: 164,
    },
    {
      question_id: 23,
      answer_id: 168,
    },
    {
      question_id: 24,
      answer_id: 172,
    },
    {
      question_id: 25,
      answer_id: 178,
    },
    {
      question_id: 26,
      answer_id: 182,
    },
    {
      question_id: 27,
      answer_id: 188,
    },
    {
      question_id: 28,
      answer_id: 192,
    },
    {
      question_id: 29,
      answer_id: 194,
    },
  ],
};

const questionnaireInvestFwDev = {
  customer_answers: [
    {
      question_id: 30,
      answer_id: 198,
    },
    {
      question_id: 31,
      answer_id: 203,
    },
    {
      question_id: 32,
      answer_id: 227,
    },
    {
      question_id: 33,
      answer_id: 232,
    },
    {
      question_id: 34,
      answer_id: 236,
    },
    {
      question_id: 35,
      answer_id: 241,
    },
    {
      question_id: 36,
      answer_id: 247,
    },
    {
      question_id: 37,
      answer_id: 251,
    },
    {
      question_id: 38,
      answer_id: 257,
    },
    {
      question_id: 39,
      answer_id: 261,
    },
    {
      question_id: 40,
      answer_id: 263,
    },
    {
      question_id: 41,
      answer_id: 266,
    },
    {
      question_id: 42,
      answer_id: 269,
    },
    {
      question_id: 43,
      answer_id: 272,
    },
    {
      question_id: 44,
      answer_id: 275,
    },
    {
      question_id: 45,
      answer_id: 277,
    },
    {
      question_id: 46,
      answer_id: 281,
    },
    {
      question_id: 47,
      answer_id: 285,
    },
    {
      question_id: 48,
      answer_id: 290,
    },
    {
      question_id: 49,
      answer_id: 293,
    },
    {
      question_id: 50,
      answer_id: 298,
    },
    {
      question_id: 51,
      answer_id: 302,
    },
  ],
};

const questionnaireInvestFwStage = {
  customer_answers: [
    {
      question_id: 30,
      answer_id: 198,
    },
    {
      question_id: 31,
      answer_id: 203,
    },
    {
      question_id: 32,
      answer_id: 227,
    },
    {
      question_id: 33,
      answer_id: 232,
    },
    {
      question_id: 34,
      answer_id: 236,
    },
    {
      question_id: 35,
      answer_id: 241,
    },
    {
      question_id: 36,
      answer_id: 257,
    },
    {
      question_id: 37,
      answer_id: 247,
    },
    {
      question_id: 38,
      answer_id: 253,
    },
    {
      question_id: 39,
      answer_id: 261,
    },
    {
      question_id: 40,
      answer_id: 263,
    },
    {
      question_id: 41,
      answer_id: 274,
    },
    {
      question_id: 42,
      answer_id: 271,
    },
    {
      question_id: 43,
      answer_id: 266,
    },
    {
      question_id: 44,
      answer_id: 269,
    },
    {
      question_id: 45,
      answer_id: 277,
    },
    {
      question_id: 46,
      answer_id: 281,
    },
    {
      question_id: 47,
      answer_id: 285,
    },
    {
      question_id: 48,
      answer_id: 290,
    },
    {
      question_id: 49,
      answer_id: 293,
    },
    {
      question_id: 50,
      answer_id: 298,
    },
    {
      question_id: 51,
      answer_id: 302,
    },
  ],
};

const questionnaireInvestFwProd = {
  customer_answers: [
    {
      question_id: 30,
      answer_id: 198,
    },
    {
      question_id: 31,
      answer_id: 203,
    },
    {
      question_id: 32,
      answer_id: 227,
    },
    {
      question_id: 33,
      answer_id: 232,
    },
    {
      question_id: 34,
      answer_id: 237,
    },
    {
      question_id: 35,
      answer_id: 243,
    },
    {
      question_id: 36,
      answer_id: 253,
    },
    {
      question_id: 37,
      answer_id: 247,
    },
    {
      question_id: 38,
      answer_id: 257,
    },
    {
      question_id: 39,
      answer_id: 264,
    },
    {
      question_id: 40,
      answer_id: 266,
    },
    {
      question_id: 41,
      answer_id: 261,
    },
    {
      question_id: 42,
      answer_id: 269,
    },
    {
      question_id: 43,
      answer_id: 272,
    },
    {
      question_id: 44,
      answer_id: 275,
    },
    {
      question_id: 45,
      answer_id: 289,
    },
    {
      question_id: 46,
      answer_id: 277,
    },
    {
      question_id: 47,
      answer_id: 281,
    },
    {
      question_id: 48,
      answer_id: 286,
    },
    {
      question_id: 49,
      answer_id: 293,
    },
    {
      question_id: 50,
      answer_id: 298,
    },
    {
      question_id: 51,
      answer_id: 302,
    },
  ],
};

const questionnaireTradeEuProd = {
  customer_answers: [
    {
      question_id: 59,
      answer_id: 308,
      answer: 'Retired',
      valid: true,
    },
    {
      question_id: 62,
      answer_id: 343,
      answer: 'High school',
      valid: true,
    },
    {
      question_id: 63,
      answer_id: 346,
      answer: 'Investments',
      valid: true,
    },
    {
      question_id: 64,
      answer_id: 351,
      answer: '20k-50k',
      valid: true,
    },
    {
      question_id: 65,
      answer_id: 419,
      answer: 'Intraday trading',
      valid: true,
    },
    {
      question_id: 66,
      answer_id: 361,
      answer: '20k-50k',
      valid: true,
    },
    {
      question_id: 67,
      answer_id: 367,
      answer: '50k-250k',
      valid: true,
    },
    {
      question_id: 68,
      answer_id: 370,
      answer: 'Yes',
      valid: true,
    },
    {
      question_id: 69,
      answer_id: 372,
      answer: 'Speculative, particularly complex and risky',
      valid: true,
    },
    {
      question_id: 70,
      answer_id: 375,
      answer: 'Magnification of the profits or losses',
      valid: true,
    },
    {
      question_id: 71,
      answer_id: 378,
      answer: '1000 USD',
      valid: true,
    },
    {
      question_id: 72,
      answer_id: 381,
      answer: 'Potential loss',
      valid: true,
    },
    {
      question_id: 81,
      answer_id: 414,
      answer: 'Move in the same direction',
      valid: true,
    },
    {
      question_id: 73,
      answer_id: 384,
      answer: 'Yes',
      valid: true,
    },
    {
      question_id: 74,
      answer_id: 389,
      answer: 'Frequently',
      valid: true,
    },
    {
      question_id: 75,
      answer_id: 393,
      answer: 'Frequently',
      valid: true,
    },
    {
      question_id: 76,
      answer_id: 397,
      answer: 'Frequently',
      valid: true,
    },
    {
      question_id: 77,
      answer_id: 401,
      answer: '€10000 +',
      valid: true,
    },
    {
      question_id: 78,
      answer_id: 402,
      answer: 'More than 10,000 EUR',
      valid: true,
    },
    {
      question_id: 79,
      answer_id: 407,
      answer: 'All of it. I am a risk taker',
      valid: true,
    },
    {
      question_id: 80,
      answer_id: 410,
      answer: 'To make a quick profit from short-term trading.',
      valid: true,
    },
  ],
};

const questionnaireTradeEuStageAndDev = {
  customer_answers: [
    {
      question_id: 52,
      answer_id: 308,
      answer: 'Retired',
      valid: true,
    },
    {
      question_id: 55,
      answer_id: 343,
      answer: 'High school',
      valid: true,
    },
    {
      question_id: 56,
      answer_id: 346,
      answer: 'Investments',
      valid: true,
    },
    {
      question_id: 57,
      answer_id: 351,
      answer: '20k-50k',
      valid: true,
    },
    {
      question_id: 58,
      answer_id: 419,
      answer: 'Intraday trading',
      valid: true,
    },
    {
      question_id: 59,
      answer_id: 361,
      answer: '20k-50k',
      valid: true,
    },
    {
      question_id: 60,
      answer_id: 367,
      answer: '50k-250k',
      valid: true,
    },
    {
      question_id: 61,
      answer_id: 370,
      answer: 'Yes',
      valid: true,
    },
    {
      question_id: 62,
      answer_id: 372,
      answer: 'Speculative, particularly complex and risky',
      valid: true,
    },
    {
      question_id: 63,
      answer_id: 375,
      answer: 'Magnification of the profits or losses',
      valid: true,
    },
    {
      question_id: 64,
      answer_id: 378,
      answer: '1000 USD',
      valid: true,
    },
    {
      question_id: 65,
      answer_id: 381,
      answer: 'Potential loss',
      valid: true,
    },
    {
      question_id: 74,
      answer_id: 414,
      answer: 'Move in the same direction',
      valid: true,
    },
    {
      question_id: 66,
      answer_id: 384,
      answer: 'Yes',
      valid: true,
    },
    {
      question_id: 67,
      answer_id: 389,
      answer: 'Frequently',
      valid: true,
    },
    {
      question_id: 68,
      answer_id: 393,
      answer: 'Frequently',
      valid: true,
    },
    {
      question_id: 69,
      answer_id: 397,
      answer: 'Frequently',
      valid: true,
    },
    {
      question_id: 70,
      answer_id: 401,
      answer: '€10000 +',
      valid: true,
    },
    {
      question_id: 71,
      answer_id: 402,
      answer: 'More than 10,000 EUR',
      valid: true,
    },
    {
      question_id: 72,
      answer_id: 407,
      answer: 'All of it. I am a risk taker',
      valid: true,
    },
    {
      question_id: 73,
      answer_id: 410,
      answer: 'To make a quick profit from short-term trading.',
      valid: true,
    },
  ],
};

const questionnaireNrdxStageAndDev = {
  customer_answers: [
    {
      question_id: 108,
      answer_id: null,
      answer: 'Bahrain',
      valid: true,
    },
    {
      question_id: 109,
      answer_id: null,
      answer: 'test',
      valid: true,
    },
    {
      question_id: 110,
      answer_id: 570,
      answer: '250.000 - 500.000',
      valid: true,
    },
    {
      question_id: 111,
      answer_id: 574,
      answer: 'Unemployed',
      valid: true,
    },
    {
      question_id: 112,
      answer_id: 578,
      answer: 'Bachelor degree / Diploma',
      valid: true,
    },
    {
      question_id: 113,
      answer_id: 585,
      answer: '250.000 - 500.000',
      valid: true,
    },
    {
      question_id: 114,
      answer_id: 588,
      answer: 'Assets saving',
      valid: true,
    },
    {
      question_id: 115,
      answer_id: 595,
      answer: '250.000 - 500.000',
      valid: true,
    },
    {
      question_id: 116,
      answer_id: 598,
      answer: 'I have relevant qualification and/or education',
      valid: true,
    },
    {
      question_id: 117,
      answer_id: 602,
      answer: 'Yes',
      valid: true,
    },
    {
      question_id: 118,
      answer_id: 604,
      answer: 'Sometimes',
      valid: true,
    },
    {
      question_id: 174,
      answer_id: 850,
      answer: 'Accountancy',
      valid: true,
    },
  ],
};

const questionnaireNrdxProd = {
  customer_answers: [
    {
      question_id: 115,
      answer_id: null,
      answer: 'Bahrain',
    },
    {
      question_id: 116,
      answer_id: null,
      answer: 'test',
    },
    {
      question_id: 117,
      answer_id: 568,
    },
    {
      question_id: 118,
      answer_id: 572,
    },
    {
      question_id: 119,
      answer_id: 577,
    },
    {
      question_id: 120,
      answer_id: 581,
    },
    {
      question_id: 121,
      answer_id: 587,
    },
    {
      question_id: 122,
      answer_id: 592,
    },
    {
      question_id: 123,
      answer_id: 597,
    },
    {
      question_id: 124,
      answer_id: 601,
    },
    {
      question_id: 125,
      answer_id: 603,
    },
    {
      question_id: 181,
      answer_id: 850,
    },
  ],
};

const questionnaireWC1StageAndDev = {
  customer_answers: [
    {
      question_id: 97,
      answer_id: null,
      answer: 'Bahrain',
    },
    {
      question_id: 98,
      answer_id: null,
      answer: 'test',
    },
    {
      question_id: 99,
      answer_id: 529,
    },
    {
      question_id: 100,
      answer_id: 533,
    },
    {
      question_id: 101,
      answer_id: 538,
    },
    {
      question_id: 102,
      answer_id: 542,
    },
    {
      question_id: 103,
      answer_id: 548,
    },
    {
      question_id: 104,
      answer_id: 552,
    },
    {
      question_id: 105,
      answer_id: 558,
    },
    {
      question_id: 106,
      answer_id: 562,
    },
    {
      question_id: 107,
      answer_id: 564,
    },
  ],
};

const questionnaireWC1Prod = {
  customer_answers: [
    {
      question_id: 104,
      answer_id: null,
      answer: 'Bahrain',
    },
    {
      question_id: 105,
      answer_id: null,
      answer: 'test',
    },
    {
      question_id: 106,
      answer_id: 532,
    },
    {
      question_id: 107,
      answer_id: 533,
    },
    {
      question_id: 108,
      answer_id: 538,
    },
    {
      question_id: 109,
      answer_id: 547,
    },
    {
      question_id: 110,
      answer_id: 549,
    },
    {
      question_id: 111,
      answer_id: 557,
    },
    {
      question_id: 112,
      answer_id: 561,
    },
    {
      question_id: 113,
      answer_id: 562,
    },
    {
      question_id: 114,
      answer_id: 564,
    },
  ],
};

// TODO add data for the TradEdge brand
switch (foBrand) {
  case 'Capitalix':
    customerQuestionnaire = questionnaireCapitalix;
    break;
  case 'InvestFW':
    customerQuestionnaire = getInvestFwQuestionnaireByEnv(env);
    break;
  case 'TradeEU':
    customerQuestionnaire = getTradeEuQuestionnaireByEnv(env);
    break;
  case 'NRDX':
    customerQuestionnaire = getNrdxQuestionnaireByEnv(env);
    break;
  case 'WC1':
    customerQuestionnaire = getWC1QuestionnaireByEnv(env);
    break;
}

function getTradeEuQuestionnaireByEnv(env) {
  return env === 'prod' ? questionnaireTradeEuProd : questionnaireTradeEuStageAndDev;
}

function getInvestFwQuestionnaireByEnv(env) {
  let questionnaireInvestFW;
  switch (env) {
    case 'dev':
      questionnaireInvestFW = questionnaireInvestFwDev;
      break;
    case 'stage':
      questionnaireInvestFW = questionnaireInvestFwStage;
      break;
    case 'prod':
      questionnaireInvestFW = questionnaireInvestFwProd;
      break;
  }
  return questionnaireInvestFW;
}

function getNrdxQuestionnaireByEnv(env) {
  if (env !== 'prod') {
    return questionnaireNrdxStageAndDev;
  } else {
    return questionnaireNrdxProd;
  }
}

function getWC1QuestionnaireByEnv(env) {
  if (env !== 'prod') {
    return questionnaireWC1StageAndDev;
  } else {
    return questionnaireWC1Prod;
  }
}

// FO Brand
function getCurrentFoBrand() {
  /* product value could be 'FO', 'iOS' and 'BO'
   * if 'FO' or 'iOS' we get 'brand' value from config
   * if 'BO' we get 'brand' value from the 'process.env.FO_BRAND'
   */
  let foBrand;
  product === 'FO' ? (foBrand = brand) : (foBrand = process.env.BRAND);
  return foBrand;
}

//Email Customer Data
const updateDataForDraftCustomer = {
  first_name: 'AutotestQA',
  last_name: 'AutotestQA',
  mobile: '+380730000002',
  email: `${randomString.generate(15)}@qamail.devopdata.co`,
};

export default {
  getCustomerLead: function (params = {}) {
    return {
      ...customerLead,
      email: getRandomEmail(),
      brand_id: getCurrentFoBrand().toUpperCase(),
      campaign_id: campaignId,
      ...params,
    };
  },

  getCustomerDepositor: function (params = {}) {
    return {
      ...customerDepositor,
      email: getRandomEmail(),
      brand_id: getCurrentFoBrand().toUpperCase(),
      campaign_id: campaignId,
      ...params,
    };
  },

  getCustomerDraft: function (params = {}) {
    return {
      ...customerDraft,
      email: getRandomEmail(),
      brand_id: getCurrentFoBrand().toUpperCase(),
      campaign_id: campaignId,
      marketing_info: {},
      ...params,
    };
  },

  getCustomerForLoginOnProd: function (customerNumber, brand) {
    return {
      brand_id: brand.toUpperCase(),
      email: `ng_e2e_api_prod_${brand}_${customerNumber}@mailinator.com`,
      password: '123456Aa@',
      system_id: 'web',
    };
  },

  getCustomerSetupPassword: function (params = {}) {
    return {
      ...customerSetupPassword,
      ...params,
    };
  },

  getCustomerAutoLogin: function (params = {}) {
    return {
      ...customerAutoLogin,
      ...params,
    };
  },

  getCustomerDraftActivate: function (params = {}) {
    return {
      ...customerDraftActivate,
      ...params,
    };
  },

  getCustomerTradingAccount: function (params = {}) {
    return {
      ...customerTradingAccount,
      ...params,
    };
  },

  getRandomEmailNotTest: function () {
    const randomPrefix = 'group' + Math.random().toString(36);
    return `ng_e2e_api_${randomPrefix}@mail.com`;
  },

  getCustomerCurrencyUpdate: function (params = {}) {
    return {
      ...customerCurrencyUpdate,
      ...params,
    };
  },
  customerLead,
  customerDepositor,
  customerDraft,
  customerFirstNameUpdate,
  customerQuestionnaire,
  customerSetupPassword,
  customerAutoLogin,
  customerDraftActivate,
  updateDataForDraftCustomer,
  getRandomName,
};
