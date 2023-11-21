const Joi = require('joi');

const addVisit = Joi.object({
  userAgent: Joi.string().required(),
});

module.exports = {
  addVisit,
};
