import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customerData from '../../../../test-data/ng/customer.data';
import boUserData from '../../../../test-data/bo/bo.user.data';
import boUserHelper from '../../../../test-utils/helpers/helpers-bo/bo.user.helper';
import boCustomerHelper from '../../../../test-utils/helpers/helpers-bo/bo.customer.helper';
import boWalletHelper from '../../../../test-utils/helpers/helpers-bo/bo.wallet.helper';
import constants from '../../../../test-data/constants';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import { brand } from '../../../../config';
import tradingHelper from '../../../../test-utils/helpers/helpers-fo/trading.helper';

describe('C25488 Bank Transfer Deposit - Check transaction with all PSP', function () {
  let cid;
  let resGetBanksList;
  let resTransactionsFiltered;
  let bankTransferPaymentMethodId = 2;
  let customer = customerData.getCustomerDepositor();
  const superAdminBO = boUserData.getAdminBoDataForLogin(8, process.env.BRAND);
  let balanceAdjustmentUrl = `?is_test=true&transaction_type_id=1&transaction_subtype_id=8`;

  before(async function () {
    await boUserHelper.loginBoAdmin(agent, superAdminBO);
  });

  after(async function () {
    await boUserHelper.logoutBoAdmin(agent);
    await customersHelper.logoutCustomer(agent);
  });

  it('Create customer depositor', async function () {
    const res = await customersHelper.waitTillCustomerCreated(agent, customer);
    cid = res.cid;
    await tradingHelper.waitForCustomerTradingAccountCreate(agent, constants.MODE.REAL);
    await boCustomerHelper.waitForCustomerCreateInBO(agent, cid);
  });

  it('Get bank list', async function () {
    resGetBanksList = await boWalletHelper.getBanksList(agent, process.env.BRAND.toUpperCase());

    expect(resGetBanksList.body.banks_list[brand.toUpperCase()]).to.be.an('array').that.is.not.empty;
    expect(resGetBanksList.statusCode).to.equal(200);
  });

  it('Create balance adjustment -> Bank Transfer with Processor name', async function () {
    const resBalanceAdjustment = await boWalletHelper.createBalanceAdjustment(agent, cid, {
      processor_name: resGetBanksList.body.banks_list[process.env.BRAND.toUpperCase()][0].name,
      payment_method_id: bankTransferPaymentMethodId,
    });

    expect(resBalanceAdjustment.status).to.equal(200);
  });

  it('Wait for transactions count change', async function () {
    this.timeout(constants.TIMEOUT.WAIT_BALANCE);

    let resTransactions = await boWalletHelper.waitForTransactionsCountChange(agent, cid, balanceAdjustmentUrl, 1);

    expect(resTransactions.statusCode).to.equal(200);
    expect(resTransactions.body.count).to.equal(1);
  });

  it('Find transaction from filter by Type & Sub-type & Payment method in Financial tab', async function () {
    resTransactionsFiltered = await boWalletHelper.getTransactions(
      agent,
      cid,
      `${balanceAdjustmentUrl}&payment_method_id=${bankTransferPaymentMethodId}`
    );

    expect(resTransactionsFiltered.statusCode).to.equal(200);
    expect(resTransactionsFiltered.body.count).to.equal(1);
  });

  it('Find transaction from filter by Transaction id & Payment method in Operations -> Transactions', async function () {
    let resOperationTransactions = await boWalletHelper.getOperationTransactions(
      agent,
      `&id=${resTransactionsFiltered.body.rows[0].id}&payment_method_id=${bankTransferPaymentMethodId}`
    );

    expect(resOperationTransactions.statusCode).to.equal(200);
    expect(resOperationTransactions.body.count).to.equal(1);
    expect(resOperationTransactions.body.rows[0].payment_method_id).to.equal(bankTransferPaymentMethodId);
  });
});
