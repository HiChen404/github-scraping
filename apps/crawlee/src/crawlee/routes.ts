import { CheerioRoot, createCheerioRouter, Dataset, Request } from 'crawlee'
import { Project } from '@repo/shared/types'
import { parseGithubStarListPage } from './parseGithubStarListPage.ts'

export const router = createCheerioRouter()

const getUrl = ($: CheerioRoot) => {
  const href = $("[rel='next'].next_page").attr('href')
  const url = `https://github.com${href}`
  return url
}

const getCurrentPageNumber = (request: Request) => {
  const currentPage = request.loadedUrl?.match(/page=(\d+)/)?.[1]
  return currentPage
}

router.addDefaultHandler(async ({ request, $, enqueueLinks, log, pushData, ...rest }) => {
  const title = $('title').text()

  const currentPage = getCurrentPageNumber(request) || 1

  log.info(`${title}`, { url: request.loadedUrl })

  const items = await parseGithubStarListPage($)

  // 将内容保存
  await pushData({
    title,
    url: request.loadedUrl,
    currentPage: currentPage,
    items,
  })

  const url = getUrl($)

  if (!url) return
  // 将链接放入到队列中

  await enqueueLinks({
    urls: [url],
    label: 'next',
  })
})

router.addHandler('next', async ({ request, $, log, pushData, enqueueLinks, ...rest }) => {
  const title = $('title').text()
  const currentPage = request.loadedUrl?.match(/page=(\d+)/)![1]
  log.info(`${title}`, { url: request.loadedUrl })

  const items = await parseGithubStarListPage($)

  // 将内容保存8
  await pushData({
    title,
    url: request.loadedUrl,
    currentPage: currentPage,
    items,
  })

  const url = getUrl($)

  if (!url) return

  await enqueueLinks({
    urls: [url],
    label: 'page',
  })
})
