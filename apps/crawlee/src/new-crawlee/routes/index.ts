import {
  CheerioRoot,
  createCheerioRouter,
  createPlaywrightRouter,
  Dataset,
  PlaywrightCrawlingContext,
  Request,
} from 'crawlee'
import { Project } from '@repo/shared/types'
import { CheerioCrawlingContext } from 'crawlee'
import { requestQueue } from '../main.ts'
// export const router = createCheerioRouter()
export const router = createPlaywrightRouter()

const parseListPage = async (ctx: PlaywrightCrawlingContext) => {
  const $ = await ctx.parseWithCheerio()
  const $items = $('#user-starred-repos > div > div.col-lg-9 > div.col-12.d-block')
  const items: Project[] = []

  $items.each((i, el) => {
    const $item = $(el)
    const $title = $item.find('h3 > a')

    const title = $title.text()?.trim()
    const url = $title.attr('href')?.trim()

    const $desc = $item.find('p[itemprop="description"]')
    const desc = $desc.text()?.trim()

    const star = $item.find('.Link--muted.mr-3').text()?.trim()
    const language = $item.find('[itemprop="programmingLanguage"]').text()?.trim()

    const favorites = $item
      .find('label')
      .has('input[name="list_ids[]"]')
      .map((i, el) => {
        // const isChecked = ctx.$(el).find('input').attr('checked')
        // const name = ctx.$(el).find('span.Truncate-text').text()
        // console.log('🚀 -> .map -> name:', name)
        // if (isChecked) return name
      })
      .toArray()

    items.push({
      name: title,
      homePage: url || '',
      description: desc || '',
      favorites: [],
      language: language,
      star,
      starTime: '',
    })
  })

  return items
}

let page = 1

router.addHandler('next', async ctx => {
  console.log('开始')

  const $ = await ctx.parseWithCheerio()
  console.log('当前页数', page)
  console.log('当前url', ctx.request.url)

  const btns = $('.BtnGroup-item').filter((i, el) => {
    const text = $(el).text()
    return text === 'Previous' || text === 'Next'
  })


  console.log(await ctx.page.text());

  const preBtn = btns.filter((i, el) => $(el).text() === 'Previous').first()
  const nextBtn = btns.filter((i, el) => $(el).text() === 'Next').first()

  const isFirstPage = preBtn.attr()?.disabled === 'disabled'
  const isLastPage = nextBtn.attr()?.disabled === 'disabled'

  const nextUrl = nextBtn.attr()?.href

  const res = await parseListPage(ctx)

  ctx.pushData(res)
  page++

  if (!nextUrl) {
    console.log('no next page')
    return
  }

  if (isLastPage) {
    console.log('last page')
    return
  }

  // ctx.addRequests([{ url: nextUrl, label: 'next' }])
})
