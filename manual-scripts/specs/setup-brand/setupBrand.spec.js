import { expect } from 'chai';
import agent from '../../../test-utils/helpers/agent.helper';
import boUserHelper from '../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boManagementHelper from '../../../test-utils/helpers/helpers-bo/bo.management.helper';
import boLeadsHubHelper from '../../../test-utils/helpers/helpers-bo/bo.leads.hub.helper';
import customerData from '../../../test-data/ng/customer.data';
import customersHelper from '../../../test-utils/helpers/helpers-fo/customers.helper';
import constants from '../../../test-data/constants';
import boMarketingHelper from '../../../test-utils/helpers/helpers-bo/bo.marketing.helper';
import boCustomerHelper from '../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import config from '../../../config';

const superAdminBO = {
  // TODO change to corresponding admin after developer setup user for new brand -> e.g. admin+{brand}@protonixltd.com/Aa@123456
  username: 'brand@mailinator.com',
  password: 'ZAQ!2wsx',
};
let campaignId;

describe('Setup brand', function () {
  describe('Setup data for new brand in BO', function () {
    let businessUnitsId;
    let marketsId;
    let deskId;
    let salesDepartmentId;
    let salesTeamId;
    let retentionDepartmentId;
    let retentionTeamId;
    let superAdminId;
    const { env, customer_data } = config.default;
    let agentBody = {
      username: `NG_UI_${process.env.BRAND}@mailinator.com`,
      password: 'Aa@123456',
      name: `NG_UI_${process.env.BRAND}`,
      role: 'team_lead',
      bi_user: '',
      title: `NG_UI_${process.env.BRAND}`,
      limited_access: false,
      allowed_ips: [],
      persistent_session: false,
      brand_dependence: 'brand',
      brands: [process.env.BRAND.toUpperCase()],
      languages: [{ language_id: 'en' }, { language_id: 'ar' }],
      call_ext: null,
    };

    before(async function () {
      await boUserHelper.loginBoAdmin(agent, superAdminBO);
    });

    after(async function () {
      await boUserHelper.logoutBoAdmin(agent);
    });

    it('Create a business unit for the brand', async function () {
      const businessUnit = {
        name: `${process.env.BRAND.toUpperCase()} - Test Business unit`,
        status: 'active',
      };

      let resCreateBusinessUnits = await boManagementHelper.createBusinessUnits(agent, businessUnit);
      businessUnitsId = resCreateBusinessUnits.body.id;

      expect(resCreateBusinessUnits.statusCode).to.equal(200);
    });

    it('Create market for the brand', async function () {
      const markets = {
        name: `${process.env.BRAND.toUpperCase()} - Test Markets`,
        status: 'active',
      };

      let resCreateMarkets = await boManagementHelper.createMarkets(agent, markets);
      marketsId = resCreateMarkets.body.id;

      expect(resCreateMarkets.statusCode).to.equal(200);
    });

    it('Create a desk', async function () {
      const unitsDesk = {
        parent_id: `${process.env.BRAND.toUpperCase()}`,
        brand_id: `${process.env.BRAND.toUpperCase()}`,
        type: 'desk',
        name: `${process.env.BRAND.toUpperCase()} - Test Desk`,
        assignments_trigger: { assign_trigger: 'after_ftd' },
        languages: [{ language_id: 'ar' }, { language_id: 'en' }],
        countries: [{ country_id: 'AF' }],
        market_id: `${marketsId}`,
        business_unit_id: `${businessUnitsId}`,
      };

      let resCreateDesk = await boManagementHelper.createUnits(agent, unitsDesk);
      deskId = resCreateDesk.body.id;

      expect(resCreateDesk.statusCode).to.equal(200);
    });

    it('Create a sales department', async function () {
      const unitsSalesDepartment = {
        brand_id: `${process.env.BRAND.toUpperCase()}`,
        parent_id: `${deskId}`,
        associates: null,
        type: 'department',
        subtype: 'sales',
        name: `Test Sales Department`,
      };

      let resCreateSalesDepartment = await boManagementHelper.createUnits(agent, unitsSalesDepartment);
      salesDepartmentId = resCreateSalesDepartment.body.id;

      expect(resCreateSalesDepartment.statusCode).to.equal(200);
    });

    it('Create a sales team', async function () {
      const unitsSalesTeam = {
        brand_id: `${process.env.BRAND.toUpperCase()}`,
        parent_id: `${salesDepartmentId}`,
        associates: null,
        type: 'team',
        subtype: 'sales',
        name: `Test Sales Team`,
        languages: [{ language_id: 'ar' }, { language_id: 'en' }],
      };

      let resCreateSalesTeam = await boManagementHelper.createUnits(agent, unitsSalesTeam);
      salesTeamId = resCreateSalesTeam.body.id;

      expect(resCreateSalesTeam.statusCode).to.equal(200);
    });

    it('Create a retention department', async function () {
      const unitsRetentionDepartment = {
        brand_id: `${process.env.BRAND.toUpperCase()}`,
        parent_id: `${deskId}`,
        associates: null,
        type: 'department',
        subtype: 'retention',
        name: `Test Retention Department`,
      };

      let resCreateRetentionDepartment = await boManagementHelper.createUnits(agent, unitsRetentionDepartment);
      retentionDepartmentId = resCreateRetentionDepartment.body.id;

      expect(resCreateRetentionDepartment.statusCode).to.equal(200);
    });

    it('Create a retention team', async function () {
      const unitsRetentionTeam = {
        brand_id: `${process.env.BRAND.toUpperCase()}`,
        parent_id: `${retentionDepartmentId}`,
        associates: null,
        type: 'team',
        subtype: 'retention',
        name: `Test Retention Team`,
        languages: [{ language_id: 'ar' }, { language_id: 'en' }],
      };

      let resCreateRetentionTeam = await boManagementHelper.createUnits(agent, unitsRetentionTeam);
      retentionTeamId = resCreateRetentionTeam.body.id;

      expect(resCreateRetentionTeam.statusCode).to.equal(200);
    });

    it('Create permission group SuperAdmin', async function () {
      const groupSuperAdmin = {
        name: `SuperAdmin - ${process.env.BRAND.toUpperCase()}`,
        permissions: [
          198, 6, 157, 9, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 180, 168, 169, 170, 171, 172, 15, 231, 211,
          212, 244, 219, 17, 55, 146, 147, 148, 149, 150, 151, 152, 153, 222, 137, 214, 118, 215, 304, 250, 205, 18,
          199, 19, 299, 141, 21, 22, 290, 154, 177, 232, 24, 296, 213, 218, 25, 300, 302, 303, 221, 236, 26, 229, 27,
          28, 29, 34, 230, 291, 116, 120, 123, 173, 32, 202, 208, 209, 292, 289, 293, 301, 35, 37, 39, 40, 42, 79, 80,
          41, 43, 36, 38, 156, 249, 294, 234, 235, 44, 45, 297, 119, 145, 47, 155, 179, 220, 245, 174, 175, 176, 216,
          200, 201, 12, 295, 13, 184, 185, 186, 187, 188, 189, 190, 191, 192, 305, 306, 307, 308, 193, 194, 195, 196,
          197, 14, 204, 243, 138, 139, 140, 60, 210, 142, 143, 144, 109, 298, 110, 256, 270, 271, 272, 255, 269, 273,
          277, 278, 279, 274, 280, 281, 282, 275, 283, 284, 285, 276, 286, 287, 288, 237, 238, 239, 240, 241, 242, 246,
          247,
        ],
      };

      let resCreateSuperAdmin = await boManagementHelper.createGroups(agent, groupSuperAdmin);
      superAdminId = resCreateSuperAdmin.body.group.id;

      expect(resCreateSuperAdmin.statusCode).to.equal(200);
    });

    it('Create users for automation tests with role "Team Lead" (dev/stage)', async function () {
      env === 'prod' && this.skip();

      this.timeout(constants.TIMEOUT.WAIT_70s);

      for (let i = 1; i <= 20; i++) {
        const resCreateUser = await boUserHelper.createUser(agent, {
          ...agentBody,
          username: `NG_UI_${process.env.BRAND}_${i}@mailinator.com`,
          permission_group_id: superAdminId,
          desks: deskId,
          departments: [salesDepartmentId, retentionDepartmentId],
          teams: [salesTeamId, retentionTeamId],
        });

        expect(resCreateUser.status).to.equal(200);
      }
    });

    it('Create users for automation tests with role "Department manager" (prod)', async function () {
      env === 'stage' && this.skip();
      env === 'dev' && this.skip();

      this.timeout(constants.TIMEOUT.WAIT_70s);

      let userNumberForProd = [1, 2, 7, 11, 12, 13, 14];

      for (let value of userNumberForProd) {
        const resCreateUser = await boUserHelper.createUser(agent, {
          ...agentBody,
          username: `ruslan.lyzohub_UI_${process.env.BRAND}_${value}@protonixltd.com`,
          role: 'department_manager',
          permission_group_id: superAdminId,
          desks: deskId,
          departments: [salesDepartmentId, retentionDepartmentId],
          teams: [],
        });

        expect(resCreateUser.status).to.equal(200);
      }
    });

    it('Create users for manual QA with role "Brand Manager"', async function () {
      this.timeout(constants.TIMEOUT.WAIT_70s);

      let users = [
        `andrii.obadin_${process.env.BRAND}@protonixltd.com`,
        `daria.zhaloba_${process.env.BRAND}@protonixltd.com`,
        `dmytro.kuznetsov_${process.env.BRAND}@protonixltd.com`,
        `mykyta.hubii_${process.env.BRAND}@protonixltd.com`,
        `mykyta.osetrin_${process.env.BRAND}@protonixltd.com`,
        `oleksandr.bondarenko_${process.env.BRAND}@protonixltd.com`,
        `olena.antonenko_${process.env.BRAND}@protonixltd.com`,
        `ruslan.hrebonkin_${process.env.BRAND}@protonixltd.com`,
        `ruslan.lyzohub_${process.env.BRAND}@protonixltd.com`,
        `serhii.diachenko_${process.env.BRAND}@protonixltd.com`,
        `volodymyr.tkachenko_${process.env.BRAND}@protonixltd.com`,
      ];

      for (let value of users) {
        const resCreateUser = await boUserHelper.createUser(agent, {
          ...agentBody,
          username: value,
          role: 'brand_manager',
          permission_group_id: superAdminId,
          desks: [],
          departments: [],
          teams: [],
        });

        expect(resCreateUser.status).to.equal(200);
      }
    });

    it('Create users for automation tests on BO UI - "teamLeadForNotifications -> Team Lead -> Sales and Retention', async function () {
      const resCreateUser = await boUserHelper.createUser(agent, {
        ...agentBody,
        username: `teamLeadForNotifications_${process.env.BRAND}@mailinator.com`,
        password: 'ZAQ!2wsx1',
        permission_group_id: superAdminId,
        desks: deskId,
        departments: [salesDepartmentId, retentionDepartmentId],
        teams: [salesTeamId, retentionTeamId],
      });

      expect(resCreateUser.status).to.equal(200);
    });

    it('Create users for automation tests on BO UI - "retentionTeamLead -> Team Lead -> Retention', async function () {
      env === 'prod' && this.skip();

      const resCreateUser = await boUserHelper.createUser(agent, {
        ...agentBody,
        username: `retentionTeamLead_${process.env.BRAND}@mailinator.com`,
        password: 'ZAQ!2wsx1',
        permission_group_id: superAdminId,
        desks: deskId,
        departments: [retentionDepartmentId],
        teams: [retentionTeamId],
      });

      expect(resCreateUser.status).to.equal(200);
    });

    it('Create users for automation tests on BO UI - "salesTeamLead -> Team Lead -> Sales', async function () {
      const resCreateUser = await boUserHelper.createUser(agent, {
        ...agentBody,
        username: `salesTeamLead_${process.env.BRAND}@mailinator.com`,
        password: 'ZAQ!2wsx1',
        permission_group_id: superAdminId,
        desks: deskId,
        departments: [salesDepartmentId],
        teams: [salesTeamId],
      });

      expect(resCreateUser.status).to.equal(200);
    });

    it('Create campaign', async function () {
      const campaignData = {
        name: `Test_campaign_for_autotests - ${process.env.BRAND.toUpperCase()}`,
        crm_name: 'Test_campaign_for_autotests',
        status: 'active',
      };

      let resCreateCampaign = await boMarketingHelper.createCampaign(agent, campaignData);
      campaignId = resCreateCampaign.body.id;

      expect(resCreateCampaign.statusCode).to.equal(200);
    });

    it('Create default rules for sales in the leadshub', async function () {
      const leadsHubRuleData = {
        active: true,
        is_power: false,
        campaigns: [{ campaign_id: campaignId }],
        countries: [{ country_id: customer_data.country_id }],
        languages: [{ language_id: 'en' }],
        mode: 'regular',
        outputs: [
          {
            brand_id: `${process.env.BRAND.toUpperCase()}`,
            department_id: `${salesDepartmentId}`,
            desk_id: `${deskId}`,
            team_id: `${salesTeamId}`,
          },
        ],
      };

      let resCreateLeadsHubSales = await boLeadsHubHelper.createLeadsHubRule(agent, leadsHubRuleData);

      expect(resCreateLeadsHubSales.statusCode).to.equal(200);
    });

    it('Create default rules for retention in the leadshub', async function () {
      const leadsHubRuleData = {
        active: true,
        is_power: false,
        campaigns: [{ campaign_id: campaignId }],
        countries: [{ country_id: customer_data.country_id }],
        languages: [{ language_id: 'en' }],
        mode: 'regular',
        outputs: [
          {
            brand_id: `${process.env.BRAND.toUpperCase()}`,
            department_id: `${retentionDepartmentId}`,
            desk_id: `${deskId}`,
            team_id: `${retentionTeamId}`,
          },
        ],
      };

      let resCreateLeadsHubRetention = await boLeadsHubHelper.createLeadsHubRule(agent, leadsHubRuleData);

      expect(resCreateLeadsHubRetention.statusCode).to.equal(200);
    });
  });

  describe('Setup data for new brand in FO', function () {
    let customer = customerData.getCustomerLead();

    it('Create "customerEmailAlreadyExist" and "customerEmailBoxForResetPassword"', async function () {
      let params = [
        {
          email: 'AlreadyExist@mailinator.com',
          password: '123456Aa',
          affiliate_id: '234234',
          campaign_id: campaignId.toString(),
        },
        { email: 'ngtestmail@qamail.devopdata.co', password: '111qqqaaa', campaign_id: campaignId.toString() },
      ];

      for (let value of params) {
        let resCustomer = await customersHelper.createCustomer(agent, customer, value);

        expect(resCustomer.statusCode).to.equal(200);

        await customersHelper.logoutCustomer(agent);
      }
    });
  });

  describe('Create customer and update "Compliance status" in BO', function () {
    let customer = customerData.getCustomerLead();
    let cid;

    before(async function () {
      await boUserHelper.loginBoAdmin(agent, superAdminBO);
    });

    after(async function () {
      await boUserHelper.logoutBoAdmin(agent);
      await customersHelper.logoutCustomer(agent);
    });

    it('Create customer', async function () {
      let resCustomer = await customersHelper.createCustomer(agent, customer, { campaign_id: campaignId.toString() });
      cid = resCustomer.body.customer.cid;
      await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);

      expect(resCustomer.statusCode).to.equal(200);
    });

    it('Update customer data -> "Compliance status"', async function () {
      const resUpdate = await boCustomerHelper.updateCustomerData(agent, cid, { compliance_status: 'na' });

      expect(resUpdate.statusCode).to.equal(200);
    });
  });
});
