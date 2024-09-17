const scraperService = require('../src/services/scraperService');

async function testScraper() {
  try {
    await scraperService.runScraper('Coles');
    console.log('Scraper test completed successfully');
  } catch (error) {
    console.error('Scraper test failed:', error);
  }
}

testScraper();
