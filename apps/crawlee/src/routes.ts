import {
  CheerioRoot,
  createCheerioRouter,
  createPlaywrightRouter,
  Dataset,
  PlaywrightCrawlingContext,
  Request,
} from 'crawlee'
// import { Project } from '@repo/shared/types'
import { CheerioCrawlingContext } from 'crawlee'
import { requestQueue } from './main.js'
// export const router = createCheerioRouter()
import { Project } from '@repo/shared/types'

export const router = createPlaywrightRouter()

const parseListPageWithPw = async (ctx: PlaywrightCrawlingContext) => {
  const { page } = ctx

  // const $cheerio = await ctx.parseWithCheerio()

  // const res = await page.locator('#user-starred-repos > div > div.col-lg-9 > div:nth-child(6)').innerHTML()
  // console.log('🚀 -> parseListPageWithPw -> res:', res)

  const $items = await page
    .locator('#user-starred-repos > div > div.col-lg-9')
    .locator('div.col-12.d-block.width-full.py-4.border-bottom.color-border-muted')
    .all()

  //
  //   const starBtns = await ctx.page
  //     .locator("summary[aria-label='Add this repository to a list']")
  //     .all()
  //   const starItems = await ctx.page
  //     .locator('#user-starred-repos > div > div.col-lg-9 > div.col-12.d-block')
  //     .all()
  //

  const projects: Project[] = []

  // 1. 不能使用map，异步问题
  // 2. 要处理找不到元素的报错
  for (let idx in $items) {
    const item = $items[idx]
    const name = (await item.locator('h3 > a').innerText())?.trim()
    const homePage = (await item.locator('h3 > a').getAttribute('href'))?.trim()
    const description = (
      await item
        .locator('p[itemprop="description"]')
        .innerText({ timeout: 100 })
        .catch(() => '')
    )?.trim()
    const star = (await item.locator('.Link--muted.mr-3').first().innerText())?.trim()
    // const fork = (await item.locator('.Link--muted.mr-3').nth(1).innerText())?.trim()

    const language = (
      await item
        .locator('[itemprop="programmingLanguage"]')
        .innerText({ timeout: 100 })
        .catch(() => '')
    ).trim()

    const project: Project = {
      name,
      homePage: homePage || '',
      description,
      star,
      favorites: [],
      starTime: '',
      language,
    }
    projects.push(project)
  }

  return projects
}

let page = 1

router.addHandler('next', async ctx => {
  const $ = await ctx.parseWithCheerio()
  console.log('当前页数', page)
  console.log('当前url', ctx.request.url)

  const btns = $('.BtnGroup-item').filter((i, el) => {
    const text = $(el).text()
    return text === 'Previous' || text === 'Next'
  })

  const preBtn = btns.filter((i, el) => $(el).text() === 'Previous').first()
  const nextBtn = btns.filter((i, el) => $(el).text() === 'Next').first()

  // const isFirstPage = preBtn.attr()?.disabled === 'disabled'
  const isLastPage = nextBtn.attr()?.disabled === 'disabled'

  const nextUrl = nextBtn.attr()?.href

  const res = await parseListPageWithPw(ctx)

  await ctx.pushData(res)
  page++

  if (!nextUrl) {
    ctx.log.warning(`doesn't find nextUrl and return`)

    return
  }

  if (isLastPage) {
    ctx.log.info('is LastPage and return')
    return
  }

  ctx.addRequests([{ url: nextUrl, label: 'next' }])
})
