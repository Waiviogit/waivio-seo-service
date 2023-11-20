import fp from 'fastify-plugin';

const GOOGLE_USERAGENT_REGEX1 = /Mozilla\/5\.0 \(Linux; Android 6\.0\.1; Nexus 5X Build\/MMB29P\) AppleWebKit\/537\.36 \(KHTML, like Gecko\) Chrome\/\d+\.\d+\.\d+\.\d+ Mobile Safari\/537\.36 \(compatible; Googlebot\/2\.1; \+http:\/\/www\.google\.com\/bot\.html\)/;
const GOOGLE_USERAGENT_REGEX2 = /Mozilla\/5\.0 AppleWebKit\/537\.36 \(KHTML, like Gecko; compatible; Googlebot\/2\.1; \+http:\/\/www\.google\.com\/bot\.html\) Chrome\/\d+\.\d+\.\d+\.\d+ Safari\/537\.36/;
const GOOGLE_USERAGENT_REGEX3 = /Mozilla\/5\.0 \(Linux; Android 6\.0\.1; Nexus 5X Build\/MMB29P\) AppleWebKit\/537\.36 \(KHTML, like Gecko\) Chrome\/\d+\.\d+\.\d+\.\d+ Mobile Safari\/537\.36 \(compatible; Google-InspectionTool\/1\.0\)/;
const GOOGLE_USERAGENT_REGEX4 = /Mozilla\/5\.0 \(Linux; Android 6\.0\.1; Nexus 5X Build\/MMB29P\) AppleWebKit\/537\.36 \(KHTML, like Gecko\) Chrome\/\d+\.\d+\.\d+\.\d+ Mobile Safari\/537\.36 \(compatible; AdsBot-Google-Mobile; \+http:\/\/www\.google\.com\/mobile\/adsbot\.html\)/;

const USER_AGENTS_DYNAMIC_REGEX = [
  GOOGLE_USERAGENT_REGEX1,
  GOOGLE_USERAGENT_REGEX2,
  GOOGLE_USERAGENT_REGEX3,
  GOOGLE_USERAGENT_REGEX4,
];

const testStringAgainstAgentRegex = (str) => (
  USER_AGENTS_DYNAMIC_REGEX.some((regex) => regex.test(str)));
async function botAgentService(fastify, options, next) {
  const { botUserAgentModel } = fastify;

  const userAgentExists = async ({ userAgent = '' }) => {
    if (!userAgent) return false;
    const isDynamicUserAgent = testStringAgainstAgentRegex(userAgent);
    if (isDynamicUserAgent) return true;
    return botUserAgentModel.userAgentExists({ userAgent });
  };

  fastify.decorate('botAgentService', {
    userAgentExists,
  });

  next();
}

export default fp(botAgentService);
