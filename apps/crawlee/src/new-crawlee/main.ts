// For more information, see https://crawlee.dev/
import { CheerioCrawler, Dataset, ProxyConfiguration, RequestQueue } from 'crawlee'

import { router } from './routes/index.ts'

export const requestQueue = await RequestQueue.open()
await requestQueue.addRequest({ url: 'https://github.com/HiChen404?tab=stars', label: 'next' })
// await requestQueue.addRequest({ url: 'https://baidu.com', label: 'next' })

const crawler = new CheerioCrawler({
  requestQueue,
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: router,
  // Comment this option to scrape the full website.
  maxRequestsPerCrawl: 20,
  maxConcurrency: 1,
})

await crawler.run()
