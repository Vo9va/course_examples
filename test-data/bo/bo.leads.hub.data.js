import config from '../../config';

const { departmentId, deskId, teamId, brand, leadsHubRuleData } = config.default;

export default {
  leadsHubRuleData() {
    return {
      active: true,
      is_power: false,
      campaigns: [{ campaign_id: leadsHubRuleData.campaignId }],
      countries: [{ country_id: leadsHubRuleData.country_id }],
      languages: [{ language_id: leadsHubRuleData.language_id }],
      mode: 'regular',
      outputs: [
        {
          brand_id: brand.toUpperCase(),
          department_id: departmentId,
          desk_id: deskId,
          team_id: teamId,
        },
      ],
    };
  },
  leadsHubRuleDataForUpdate() {
    return {
      active: true,
      is_power: false,
      campaigns: [{ campaign_id: leadsHubRuleData.updateLeadsHubRuleData.campaignId }],
      countries: [{ country_id: leadsHubRuleData.updateLeadsHubRuleData.country_id }],
      languages: [{ language_id: leadsHubRuleData.updateLeadsHubRuleData.language_id }],
      mode: 'regular',
      outputs: [
        {
          brand_id: brand.toUpperCase(),
          department_id: leadsHubRuleData.updateLeadsHubRuleData.departmentId,
          desk_id: leadsHubRuleData.updateLeadsHubRuleData.deskId,
          team_id: leadsHubRuleData.updateLeadsHubRuleData.teamId,
          percentage: null,
        },
      ],
    };
  },
};
