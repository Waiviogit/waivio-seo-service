const Joi = require('joi');

const getPageSchema = Joi.object({
  url: Joi.string().required(),
});

const createPageSchema = Joi.object({
  url: Joi.string().required(),
  page: Joi.string().required(),
});

module.exports = {
  getPageSchema,
  createPageSchema,
};
