const Joi = require('joi');

const ExportsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportsPayloadSchema;