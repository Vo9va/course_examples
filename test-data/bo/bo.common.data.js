import moment from 'moment/moment';
import config from '../../config';

const { permissions, brand } = config.default;

function getRandomName() {
  const randomValue = Date.now();
  return `API Autotest ${randomValue}`;
}

export default {
  getGroupBody() {
    return {
      name: getRandomName(),
      permissions: [permissions],
    };
  },

  getCampaignData() {
    return {
      name: `E2E Campaign ${getRandomName()}`,
      crm_name: 'E2E CRM Name',
      brand_id: brand.toUpperCase(),
      language_id: 'ar',
      channel_id: 'affiliates',
      sub_channel: 'E2E Sub channel',
      angle: '1',
      lp: 'E2E Lp',
      device_id: 'desktop',
      os_id: 'android',
      targeting: 'E2E targeting',
      asset: '1',
      status: 'active',
    };
  },

  getWebinarBody(uid, roomId) {
    return {
      brand_id: brand.toUpperCase(),
      end_date: moment().set({ hour: 23, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD hh:mm:ss'),
      lang_id: 'en',
      room_id: roomId,
      start_date: moment().set({ hour: 22, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DD hh:mm:ss'),
      title: `Webinar ${getRandomName()}`,
      uid: uid,
    };
  },

  getWebinarSearchData() {
    return {
      brand_id: brand.toUpperCase(),
      start_date: moment().format('YYYY-MM-DD'),
    };
  },

  getCustomerSearchBody(cid) {
    return {
      cid: [cid],
      is_test: true,
    };
  },
};
