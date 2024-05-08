'use client'
import Image from 'next/image'
import { datasets } from '@repo/shared/datasets'
import { Project } from '@repo/shared/types'
import { searchProject } from '@/actions/'
import { useState } from 'react'
import { FuseResult } from 'fuse.js'
import { useRequest } from 'ahooks'
export default function Home() {
  // const [projects, setProjects] = useState<FuseResult<Project>[]>([])
  const [keyword, setKeyword] = useState('')
  const { loading, data: projects } = useRequest(() => searchProject(keyword), {
    refreshDeps: [keyword],
  })

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <input aria-label='input' onChange={e => setKeyword(e.target.value)} />

      <div>
        {projects?.map(item => {
          return (
            <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex'>
              <a
                href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
                className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
                target='_blank'
                rel='noopener noreferrer'>
                <h2 className='mb-3 text-2xl font-semibold'>
                  {item.item.name}
                  <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
                    -&gt;
                  </span>
                </h2>
                <p className='m-0 max-w-[30ch] text-balance text-sm opacity-50'>
                  {item.item.description}
                </p>
              </a>
            </div>
          )
        })}
      </div>
    </main>
  )
}
