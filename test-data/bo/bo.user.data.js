import config from '../../config';

const { env, deskId, departmentId, teamId } = config.default;

function getRandomEmail() {
  const randomValue = Math.random().toString(36).slice(2, 12);

  return `User_BO_E2E_API_${randomValue}@mailinator.com`;
}

export default {
  /**
   * @param {number} adminNumber - number admin in BO
   * @param {string} brand - denotes for which brand the admin will be
   * @param {string} team - the name of the admin team
   * @param {number} uid - admin ID in BO
   * @returns {{password: string, username: string}|{uid, password: string, name: string, username: string}}
   */

  getAdminBoDataForLogin(adminNumber, brand, team, uid) {
    if (adminNumber > 20) {
      return {
        uid: uid,
        username: `NG_UI_${team}_${brand}_${adminNumber}@mailinator.com`,
        password: 'Aa@123456',
        name: `NG UI ${team.split('_').join(' ')} Test User`,
      };
    } else {
      if (env !== 'prod') {
        return {
          username: `NG_UI_${brand}_${adminNumber}@mailinator.com`,
          password: 'Aa@123456',
        };
      } else {
        return {
          username: `ruslan.lyzohub_UI_${brand}_${adminNumber}@protonixltd.com`,
          password: 'Aa@123456',
        };
      }
    }
  },

  getAgentBody() {
    return {
      username: getRandomEmail(),
      password: 'Aa@123456',
      name: 'Test',
      role: 'agent',
      bi_user: '',
      title: 'API',
      permission_group_id: 3,
      limited_access: false,
      allowed_ips: [],
      persistent_session: false,
      brand_dependence: 'brand',
      brands: [process.env.BRAND.toUpperCase()],
      desks: [deskId],
      departments: [departmentId],
      teams: [teamId],
      languages: [{ language_id: 'en' }],
      call_ext: null,
    };
  },
};
