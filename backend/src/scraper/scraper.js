const { chromium } = require('playwright')
const config = require('../config/scraper')
const logger = require('../utils/logger')
const scraperUtils = require('../utils/scraperUtils')
const strategies = require('../strategies')

class Scraper {
  constructor(strategy) {
    this.strategy = strategy
  }

  async initialize() {
    const contextOptions = scraperUtils.getContextOptions()
    this.browser = await chromium.launch({
      headless: config.headless || false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    this.context = await this.browser.newContext(contextOptions)
    this.page = await this.context.newPage()

    await this.page.setExtraHTTPHeaders(contextOptions.extraHTTPHeaders)
    await this.page.setViewportSize(contextOptions.viewport)
    await this.context.setGeolocation(contextOptions.geolocation)
    await this.context.grantPermissions(contextOptions.permissions)
  }

  async scrape() {
    try {
      await this.initialize()
      await scraperUtils.sleep(Math.random() * 3000 + 2000)
      await this.strategy.execute(this.page)
    } catch (error) {
      logger.error('Error during scraping:', error)
    } finally {
      await this.cleanup()
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}

const getStrategy = brand => {
  const strategy = strategies[brand.toLowerCase()]
  if (!strategy) {
    throw new Error(`Unsupported brand: ${brand}`)
  }
  return strategy
}

const scrape = async brand => {
  const strategy = getStrategy(brand)
  const scraper = new Scraper(strategy)
  await scraper.scrape()
}

module.exports = { scrape, Scraper }
