const Joi = require('joi');

const postAuthenticationValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const putAuthenticationValidator = Joi.object({
  refreshToken: Joi.string().required(),
});

const deleteAuthenticationValidator = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {postAuthenticationValidator, putAuthenticationValidator, deleteAuthenticationValidator};