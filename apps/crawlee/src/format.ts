import { Project } from '@repo/shared/types'

import Bun from 'bun'
import fs from 'node:fs/promises'
import path from 'node:path'

const workspaceDir = path.resolve(__dirname, '../')
const outputDir = path.resolve(__dirname)

const datasetsDir = path.join(workspaceDir, '/storage/datasets/default')

const fileNames = await fs.readdir(datasetsDir)

const projects: Project[] = []

for (const fileName of fileNames) {
  const filePath = path.join(datasetsDir, fileName)

  const file = await Bun.file(filePath).json()
  projects.push(file)
}

const outputFileDir = path.join(outputDir, 'output.json')

const isExists = await Bun.file(outputDir).exists()
console.log('🚀 -> isExists:', isExists)

await Bun.write(outputFileDir, JSON.stringify(projects))
