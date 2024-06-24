export interface DataJSON {
  title: string
  url: string
  currentPage: string
  items: Project[]
}

export interface Project {
  name: string
  description: string
  language?: string
  star: string
  homePage: string
  starTime: string
  favorites: string[]
}
