export interface Article {
  id?: number | string
  title: string
  author: string
  date?: string
  publishedAt?: string
  created_at?: string
  description?: string
  content?: string
  category?: string
  imageUrl?: string
  image?: string
  urlToImage?: string
  url?: string
  source?: string | { id: string | null; name: string }
}

export interface ApiResponse {
  status?: string
  articles?: Article[]
}
