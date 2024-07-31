const config = require("../config/playwright.config");
const { randomBytes } = require("crypto");

const userAgents = config.use?.userAgents || [];
const languages = [
  "en-US,en;q=0.9",
  "en-GB,en;q=0.8",
  "en-CA,en;q=0.7",
  "en-AU,en;q=0.6",
];
const timezones = ["UTC", "America/New_York", "Europe/London", "Asia/Tokyo"];

const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

const getRandomUserAgent = () => getRandomItem(userAgents) || "";
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

const generateFingerprint = () => randomBytes(16).toString("hex");

const getContextOptions = () => {
  const userAgent = getRandomUserAgent();
  const viewport = getRandomViewport();
  const fingerprint = generateFingerprint();

  return {
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    javaScriptEnabled: true,
    userAgent,
    viewport,
    deviceScaleFactor: Math.random() * (2 - 1) + 1,
    isMobile: Math.random() < 0.2,
    hasTouch: Math.random() < 0.3,
    locale: getRandomLanguage().split(",")[0],
    timezoneId: getRandomTimezone(),
    geolocation: {
      longitude: Math.random() * 360 - 180,
      latitude: Math.random() * 180 - 90,
    },
    permissions: ["geolocation"],
    extraHTTPHeaders: {
      "Accept-Language": getRandomLanguage(),
      "Sec-Ch-Ua": `"Chromium";v="${
        Math.floor(Math.random() * 20) + 90
      }", "Google Chrome";v="${Math.floor(Math.random() * 20) + 90}"`,
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "Cache-Control": "max-age=0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "X-Client-Data": Buffer.from(fingerprint).toString("base64"),
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
