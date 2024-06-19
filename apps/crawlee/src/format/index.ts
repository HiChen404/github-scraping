import type { Project, DataJSON } from '@repo/shared/types'
import Bun from 'bun'
import fs from 'node:fs/promises'
// import { Project, DataJSON } from '@/types/index.ts'
import path from 'node:path'
// 使用 bun 对 数据进行格式化

const turboDir = path.resolve(__dirname, '../../../..')

const crawleeDir = path.join(turboDir, 'apps/crawlee')
const datasetsDir = path.join(crawleeDir, 'storage/datasets/default')
console.log('🚀 -> datasetsDir:', datasetsDir)

const outputDir = path.join(turboDir, '/packages/shared/src/datasets')
console.log('🚀 -> outputDir:', outputDir)

//读取该目录
const fileNames = await fs.readdir(datasetsDir)

const projects: Project[] = []
let total = 0
for (const fileName of fileNames) {
  const filePath = path.join(datasetsDir, fileName)

  const file = Bun.file(filePath)

  const res: DataJSON = await file.json()

  total += res.items.length
  projects.push(...res.items)
}

console.log('🚀 -> total:', total)
Bun.write(path.join(outputDir, 'output.json'), JSON.stringify(projects))
