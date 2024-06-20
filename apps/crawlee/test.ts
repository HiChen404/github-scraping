import $ from 'cheerio'

const htmlFile = Bun.file('./example/item.txt')

const html = $.load(await htmlFile.text())

html('label').each((i, el) => {
  console.log(i)
})


console.log(html.html());

