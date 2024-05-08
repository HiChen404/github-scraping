'use server'
import { fuse } from '@/utils/fuse'
export async function searchProject(keyword: string) {
  return fuse.search(keyword)
}
