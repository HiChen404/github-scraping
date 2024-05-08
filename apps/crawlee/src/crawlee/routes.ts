import { createCheerioRouter, Dataset } from 'crawlee'
import { Project } from '../types/index.js'

export const router = createCheerioRouter()

router.addDefaultHandler(async ({ $, enqueueLinks, log, pushData, ...rest }) => {
  log.info(`enqueueing new URLs`)
  const hrefs: string[] = []
  $("[aria-label='Pagination']")
    .find('a[aria-label]')
    .each((idx, el) => {
      hrefs.push(el.attribs?.href)
    })

  // 获取到需要抓取的所有的链接
  const urls = hrefs.map(href => `https://github.com${href}`)
  urls.unshift(`${rest.request.url}?page=1`)

  // 将链接放入到队列中

  await enqueueLinks({
    urls: urls,
    label: 'page',
    // 'baseUrl'
  })
})

router.addHandler('page', async ({ request, $, log, pushData, ...rest }) => {
  const title = $('title').text()
  const currentPage = request.loadedUrl?.match(/page=(\d+)/)![1]
  log.info(`${title}`, { url: request.loadedUrl })

  const items: Project[] = []

  $('#user-list-repositories > div:not(.paginate-container)').each((idx, el) => {
    const $el = $(el)

    const name = $el.find('h3 a').text().trim()
    const homePage = $el.find('h3 a').attr('href')!
    const description = $el.find('div p').text().trim()
    const language = $el.find('div span[itemprop="programmingLanguage"]').text().trim()
    const star = $el.find('a:has(svg[aria-label="star"])').next().text().trim().replace(/\,/g, '')
    // 收藏时间
    const starTime = $el.find('relative-time').attr('datetime')?.trim()!

    // 收藏夹
    const favorite = $(
      '#user-profile-frame > div > div.my-3 > div.d-flex.flex-justify-between.flex-items-center.mb-2 > h2',
    )
      .text()
      .trim()
    items.push({
      name,
      description,
      language,
      star,
      homePage,
      starTime,
      favorites: [favorite],
    })
  })

  // 将内容保存8
  await pushData({
    title,
    url: request.loadedUrl,
    currentPage: currentPage,
    items,
  })
})
