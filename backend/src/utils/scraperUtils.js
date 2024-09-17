const config = require('../config/scraper');
const { randomBytes } = require('crypto');

const userAgents = config.use?.userAgents || [];
const languages = [
  'en-US,en;q=0.9',
  'en-GB,en;q=0.8',
  'en-CA,en;q=0.7',
  'en-AU,en;q=0.6',
  'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
  'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
];
const timezones = [
  'UTC',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

const getRandomUserAgent = () => getRandomItem(userAgents) || '';
const getRandomLanguage = () => getRandomItem(languages);
const getRandomTimezone = () => getRandomItem(timezones);

const getRandomViewport = () => {
  const widths = [1366, 1440, 1536, 1920, 2560];
  const heights = [768, 900, 864, 1080, 1440];
  return {
    width: getRandomItem(widths),
    height: getRandomItem(heights),
  };
};

const generateFingerprint = () => randomBytes(16).toString('hex');

const getRandomPlatform = () =>
  getRandomItem(['Windows', 'MacIntel', 'Linux x86_64']);

const getRandomBrowser = () => {
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const versions = {
    Chrome: ['90', '91', '92', '93', '94', '95'],
    Firefox: ['88', '89', '90', '91', '92'],
    Safari: ['14', '14.1', '15'],
    Edge: ['91', '92', '93', '94'],
  };
  const browser = getRandomItem(browsers);
  const version = getRandomItem(versions[browser]);
  return { name: browser, version };
};

const getContextOptions = () => {
  const userAgent = getRandomUserAgent();
  const viewport = getRandomViewport();
  const fingerprint = generateFingerprint();
  const platform = getRandomPlatform();
  const browser = getRandomBrowser();

  return {
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    javaScriptEnabled: true,
    userAgent,
    viewport,
    deviceScaleFactor: Math.random() * (2 - 1) + 1,
    isMobile: Math.random() < 0.2,
    hasTouch: Math.random() < 0.3,
    locale: getRandomLanguage().split(',')[0],
    timezoneId: getRandomTimezone(),
    geolocation: {
      longitude: Math.random() * 360 - 180,
      latitude: Math.random() * 180 - 90,
      accuracy: Math.floor(Math.random() * 100),
    },
    permissions: ['geolocation'],
    extraHTTPHeaders: {
      'Accept-Language': getRandomLanguage(),
      'Sec-Ch-Ua': `"${browser.name}";v="${browser.version}", "Not;A Brand";v="99"`,
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': `"${platform}"`,
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'X-Client-Data': Buffer.from(fingerprint).toString('base64'),
    },
  };
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  getContextOptions,
  getRandomUserAgent,
  getRandomLanguage,
  getRandomViewport,
  sleep,
};
