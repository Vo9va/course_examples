export default {
  DEPOSIT_VALIDATION: {
    cardNumber: 'Card number is not valid',
    cardDate: 'Expiration date is not valid',
    cardName: 'Invalid name on card',
    cvv: 'cvv is not valid',
    amountThreshold: 'maximum amount is 999999',
    amountMin: 'minimum amount is 0.01',
    status: 'Restricted status',
  },
  CUSTOMER_VALIDATION: {
    email: "The 'email' field fails to match the required pattern!",
    emailExist: 'Customer name already taken',
    emailIncorrect: 'Incorrect email address or password',
    emailEmpty: "The 'email' field must be a valid e-mail!",
    mobile: 'Invalid mobile',
    passwordEmpty: "The 'password' field length must be greater than or equal to 6 characters long!",
    password:
      'The password field should contain 8-16 characters, ' +
      'at least one uppercase letter, one lowercase letter, one number, and one special character. ' +
      'Allowed special characters are !@#$%^&*)(+=._-',
    currency: 'It is not allowed to update currency_id after account activation',
    invalidCurrency: 'Invalid currency',
    emptyFirstName: `The 'first_name' field must not be empty!`,
    emptyEmail: `The 'email' field fails to match the required pattern!`,
    emailAlreadyTaken: 'E-mail already taken',
    invalidKycStatus: 'Invalid kyc_status_id',
  },
};
