const db = require('../mongo');

const userAgentExists = async ({ userAgent = '' }) => {
  if (!userAgent) return false;
  return db.botUserAgentRepository.userAgentExists({ userAgent });
};

module.exports = { userAgentExists };
