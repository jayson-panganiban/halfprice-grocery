const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { Readable } = require('stream');

const routes = [
  { url: '/', changefreq: 'weekly', priority: 1 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
];

const stream = new SitemapStream({ hostname: 'https://halfpricegrocery.com' });

const sitemap = streamToPromise(Readable.from(routes).pipe(stream)).then(
  (data) => data.toString()
);

sitemap.then((xml) => {
  createWriteStream('./public/sitemap.xml').write(xml);
  console.log('Sitemap generated successfully');
});
