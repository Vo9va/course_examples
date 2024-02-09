import { expect } from 'chai';
import agent from '../../../../test-utils/helpers/agent.helper';
import customersHelper from '../../../../test-utils/helpers/helpers-fo/customers.helper';
import customerData from '../../../../test-data/ng/customer.data';
import errors from '../../../../test-data/ng/error.messages';

describe('Customers service | Customer registration validation', function () {
  const customer = customerData.getCustomerLead();

  it('C19644 Customer - email validation', async function () {
    const res = await customersHelper.createCustomer(agent, customer, { email: 'testMail@@gmail.com' });

    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.equal(errors.CUSTOMER_VALIDATION.email);
  });

  it('C18538 Customer - email already exist validation', async function () {
    const res = await customersHelper.createCustomer(agent, customer, { email: 'andrii.obadin@clicklogiq.com' });

    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.equal(errors.CUSTOMER_VALIDATION.emailExist);
  });

  it('C18532 Customer - mobile validation', async function () {
    const res = await customersHelper.createCustomer(agent, customer, { mobile: '00000' });

    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.equal(errors.CUSTOMER_VALIDATION.mobile);
  });

  it('C18535 Customer - password numbers only validation', async function () {
    const res = await customersHelper.createCustomer(agent, customer, { password: '12345678' });

    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.equal(errors.CUSTOMER_VALIDATION.password);
  });

  it('C18536 Customer - password less than 8 characters validation', async function () {
    const res = await customersHelper.createCustomer(agent, customer, { password: 'Aa1234' });

    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.equal(errors.CUSTOMER_VALIDATION.password);
  });

  it('C18537 Customer - password unsupported characters validation', async function () {
    const res = await customersHelper.createCustomer(agent, customer, { password: 'Aa12345[]' });

    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.equal(errors.CUSTOMER_VALIDATION.password);
  });

  it('C17806 Registration validation - first name field empty', async function () {
    const registrationFirstNameEmpty = await customersHelper.createCustomer(agent, customer, { first_name: '' });

    expect(registrationFirstNameEmpty.statusCode).to.equal(400);
    expect(registrationFirstNameEmpty.body.message).to.equal(errors.CUSTOMER_VALIDATION.emptyFirstName);
  });

  it('C17806 Registration validation - email field empty', async function () {
    const registrationEmailEmpty = await customersHelper.createCustomer(agent, customer, { email: '' });

    expect(registrationEmailEmpty.statusCode).to.equal(400);
    expect(registrationEmailEmpty.body.message).to.equal(errors.CUSTOMER_VALIDATION.emptyEmail);
  });
});
