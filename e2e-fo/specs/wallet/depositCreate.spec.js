import { expect } from 'chai';
import agent from '../../../test-utils/helpers/agent.helper';
import walletHelper from '../../../test-utils/helpers/helpers-fo/wallet.helper';
import customerData from '../../../test-data/ng/customer.data';
import customersHelper from '../../../test-utils/helpers/helpers-fo/customers.helper';
import config from '../../../config';

describe('C18654, C24025 Deposit create and check that deposit transaction created', function () {
  const { secureCode } = config.default;
  const customer = customerData.getCustomerDepositor();

  after(async function () {
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    await customersHelper.waitTillCustomerCreated(agent, customer);
  });

  it('Deposit create', async function () {
    const depositRes = await walletHelper.createDeposit(agent);

    expect(depositRes.statusCode).to.equal(200);
    expect(depositRes.body.proceedRequestParams).to.have.property('url');

    const confirmUrl = depositRes.body.proceedRequestParams.url;
    const confirmRes = await walletHelper.confirmDeposit(agent, confirmUrl, secureCode);

    expect(confirmRes.statusCode).to.equal(200);
  });

  it('Check that deposit transaction created', async function () {
    await walletHelper.waitForDepositTransactionStatusChange(agent, 'approved');

    const res = await walletHelper.getTransactions(agent);

    expect(res.statusCode).to.equal(200);
    expect(res.body.transactions).to.have.lengthOf(2);
    expect(res.body.transactions[0].type.name).to.equal('Internal');
    expect(res.body.transactions[0].status).to.equal('approved');
    expect(res.body.transactions[1].type.name).to.equal('Deposit');
    expect(res.body.transactions[1].status).to.equal('approved');
  });
});
