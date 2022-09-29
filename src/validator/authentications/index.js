const AuthenticationError = require('../../exceptions/AuthenticationError');
const {
  postAuthenticationValidator,
  putAuthenticationValidator,
  deleteAuthenticationValidator,
} = require('./schema');

const AutenticationValidator = {
  validatePostAuthPayload: (payload) => {
    const validationResult = postAuthenticationValidator.validate(payload);
    if (validationResult.error) {
      throw new AuthenticationsError(validationResult.error.message);
    }
  },
  validatePutAuthPayload: (payload) => {
    const validationResult = putAuthenticationValidator.validate(payload);
    if(validationResult.error) {
      throw new AuthenticationError(validationResult.error.message);
    }
  },
  validateDeleteAuthPayload: (payload) => {
    const validationResult = deleteAuthenticationValidator.validate(payload);
    if (validationResult.error) {
      throw new AuthenticationError(validationResult.error.message);
    }
  }
}

module.exports = AutenticationValidator;