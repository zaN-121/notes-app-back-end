const InvariantError = require("../../exceptions/InvariantError");
const schema = require('./schema');

const UsersValidator = {
  validateUsernamePayload: async (payload, service) => {
    const { username } = payload;
    const users = await service.getUsers();
    const isExist = users.some((val) => val.username === username);

    if (isExist) {
      throw new InvariantError('Username telah digunakan');
    }
  },
  validateUserPayload: (payload) => {
    const validationResult = schema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = UsersValidator;