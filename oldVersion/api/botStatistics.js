const db = require('../mongo');
const { botStatisticsValidation } = require('./validation');

const addVisit = async ({ userAgent }) => {
  const validation = botStatisticsValidation.addVisit.validate({ userAgent });
  if (validation.error) return validation.error;
  return db.botStatisticsRepository.incrementVisit({ userAgent });
};

module.exports = { addVisit };
