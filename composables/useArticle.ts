import type { Article } from '../types/article'

export const useArticle = () => {
  const getDate = (a: Article): string =>
    a.date || a.publishedAt || a.created_at || ''

  const getDescription = (a: Article, maxLength = 120): string => {
    const text = a.description || a.content || ''
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
  }

  const getCategory = (a: Article): string => {
    if (a.category && typeof a.category === 'string') return a.category
    if (a.source) {
      if (typeof a.source === 'string') return a.source
      if (typeof a.source === 'object' && 'name' in a.source) return (a.source as any).name
    }
    return 'Berita'
  }

  const getInitials = (name: string): string =>
    name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '?'

  const getImage = (a: Article, idx: number): string => {
    if (a.imageUrl) return a.imageUrl
    if (a.image && typeof a.image === 'string') return a.image
    return `https://picsum.photos/seed/dudung${idx}/800/500`
  }

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const readingTime = (a: Article): string => {
    const text = (a.content || a.description || '') + ' ' + (a.title || '')
    const mins = Math.max(1, Math.round(text.split(/\s+/).length / 200))
    return `${mins} mnt`
  }

  return {
    getDate,
    getDescription,
    getCategory,
    getInitials,
    getImage,
    formatDate,
    readingTime,
  }
}