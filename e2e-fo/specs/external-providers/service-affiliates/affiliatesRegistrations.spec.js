import agent from '../../../../test-utils/helpers/agent.helper';
import affiliatesHelper from '../../../../test-utils/helpers/helpers-fo/affiliates.helper';
import customerData from '../../../../test-data/ng/customer.data';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import { expect } from 'chai';
import config, { brand } from '../../../../config';

describe('C28632 Affiliates registrations', function () {
  let cid;
  const { cellxpertToken, prolineToken, hlmToken } = config.default;
  let customer = customerData.getCustomerLead();
  let token =
    brand === 'Capitalix' || brand === 'InvestFW'
      ? cellxpertToken
      : brand === 'TradeEU'
      ? prolineToken
      : brand === 'WC1'
      ? hlmToken
      : null;

  before(async function () {
    brand === 'NRDX' && this.skip(); // TODO remove this when affiliate channels are added to these brands
  });

  it('Create Affiliate customer', async function () {
    const res = await customersHelper.createCustomerWithToken(agent, token, customer);
    cid = res.body.customer.cid;

    expect(res.statusCode).to.equal(200);

    const resAffiliates = await affiliatesHelper.waitForAffiliatesCustomerData(agent, token, cid);

    expect(resAffiliates.statusCode).to.equal(200);
  });

  it('Check affiliates registrations to contain data of our customer', async function () {
    const date = new Date().toISOString().split('T')[0];
    const res = await affiliatesHelper.getAffiliatesRegistrationsData(
      agent,
      token,
      `?registration_date_from=${date}&registration_date_to=${date}`
    );

    expect(res.statusCode).to.equal(200);
    expect(res.body[0].cid).to.equal(cid);
  });
});
