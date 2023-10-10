const Joi = require('joi');

const getSitemapSchema = Joi.object({
  host: Joi.string().required(),
  name: Joi.string().required(),
});

const createSitemapSchema = Joi.object({
  host: Joi.string().required(),
});

module.exports = {
  getSitemapSchema,
  createSitemapSchema,
};
