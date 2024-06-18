// For more information, see https://crawlee.dev/
import { CheerioCrawler, Dataset, ProxyConfiguration } from 'crawlee'

import { router } from './routes.ts'

const startUrls = ['https://github.com/stars/HiChen404/lists/%E5%89%8D%E7%AB%AF%E5%BA%93?page=1']

const crawler = new CheerioCrawler({
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: router,
  // Comment this option to scrape the full website.
  maxRequestsPerCrawl: 20,
  maxConcurrency: 1,
})

await crawler.run(startUrls)
