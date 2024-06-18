
const parseGithubStarListPage = async ($: CheerioCrawler) => {
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
}
