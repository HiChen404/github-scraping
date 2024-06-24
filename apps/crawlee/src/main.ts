// For more information, see https://crawlee.dev/
import {
  CheerioCrawler,
  Dataset,
  ProxyConfiguration,
  RequestQueue,
  PlaywrightCrawler,
} from 'crawlee'
// import { chromium } from 'playwright'
// import path from 'path'
import { router } from './routes.js'
// const userDataDir = 'C:/Users/PIKA/AppData/Local/Google/Chrome/User Data'

// chromium.executablePath = () => {
//   return 'C:/Program Files/Google/Chrome Beta/Application/chrome.exe'
// }

export const requestQueue = await RequestQueue.open()
await requestQueue.addRequest({ url: 'https://github.com/HiChen404?tab=stars', label: 'next' })
// await requestQueue.addRequest({ url: 'https://baidu.com', label: 'next' })

const crawler = new PlaywrightCrawler({
  requestQueue,
  // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
  requestHandler: router,
  // Comment this option to scrape the full website.
  maxRequestsPerCrawl: 20,
  maxConcurrency: 10,
  maxRequestRetries: 1,
  launchContext: {
    launchOptions: {
      timeout: 6000,
    },
  },
  // headless: false,
  // keepAlive: true,
  // launchContext: {
  //   userDataDir: userDataDir,
  //   launchOptions: {
  //     channel: 'chrome',
  //     executablePath: 'C:\\Program Files\\Google\\Chrome Beta\\Application\\chrome.exe',
  //   },
  // },
})

await crawler.run()
