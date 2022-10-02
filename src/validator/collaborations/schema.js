const Joi = require('joi');

const collaborationPayloadSchema = Joi.object({
    noteId: Joi.string().required(),
    userId: Joi.string().required(),
});

module.exports = { collaborationPayloadSchema };