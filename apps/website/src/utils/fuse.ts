import Fuse from 'fuse.js'
import { datasets } from '@repo/shared/datasets'
const fuseOptions = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ['name', 'description', 'tags'],
}

export const fuse = new Fuse(datasets, fuseOptions)
console.log('fuse 执行...')

