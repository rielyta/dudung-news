<template>
  <div class="app-wrapper">

    <header class="masthead">
      <div class="masthead-top">
        <div class="masthead-date">
          <span class="masthead-day">{{ currentDay }}</span>
          <span class="masthead-month-year">{{ currentMonthYear }}</span>
        </div>
        <div class="masthead-logo">
          <span class="logo-wordmark">DUDUNG<em>NEWS</em></span>
          <span class="logo-tagline">Portal Berita Terpercaya</span>
        </div>
        <div class="masthead-meta">
          <span v-if="!pending" class="article-count-badge">
            <span class="count-num">{{ filteredArticles.length }}</span>
            <span class="count-label">Artikel</span>
          </span>
        </div>
      </div>

      <div class="rule-triple">
        <div class="rule-t"></div>
        <div class="rule-b"></div>
      </div>

      <div class="ticker-bar">
        <span class="ticker-label">TERKINI</span>
        <div class="ticker-track">
          <span class="ticker-item">Berita pilihan dari penulis terpercaya</span>
          <span class="ticker-sep">✦</span>
          <span class="ticker-item">Gunakan pencarian & filter untuk pengalaman terbaik</span>
          <span class="ticker-sep">✦</span>
          <span class="ticker-item">Klik artikel untuk membaca selengkapnya</span>
        </div>
      </div>
    </header>

    <div class="controls-wrapper">
      <div class="controls-inner">
        <div class="search-box" :class="{ focused: searchFocused }">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari judul, penulis, atau topik…"
            class="search-input"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="filter-group">
          <label class="filter-label">PENULIS</label>
          <div class="select-wrapper">
            <select v-model="selectedAuthor" class="filter-select">
              <option value="">Semua Penulis</option>
              <option v-for="author in authors" :key="author" :value="author">{{ author }}</option>
            </select>
            <svg class="select-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">URUTAN</label>
          <div class="sort-tabs">
            <button class="sort-tab" :class="{ active: sortOrder === 'newest' }" @click="sortOrder = 'newest'">Terbaru</button>
            <button class="sort-tab" :class="{ active: sortOrder === 'oldest' }" @click="sortOrder = 'oldest'">Terlama</button>
          </div>
        </div>

        <div class="controls-right">
          <div class="view-toggle">
            <button class="view-btn" :class="{ active: viewMode === 'card' }" @click="viewMode = 'card'" title="Tampilan Kartu">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
                <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
                <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
                <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
            <button class="view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'" title="Tampilan List">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <line x1="1" y1="3" x2="15" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="1" y1="13" x2="15" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div v-if="!pending" class="results-info">
            {{ filteredArticles.length }} dari {{ articlesArray.length }} artikel
          </div>
        </div>
      </div>
    </div>

    <main class="main-content">

      <template v-if="pending">
        <div class="skeleton-grid">
          <div v-for="i in 7" :key="i" class="skeleton-card" :class="{ featured: i === 1 }">
            <div class="skel skel-img"></div>
            <div class="skel-body">
              <div class="skel skel-tag"></div>
              <div class="skel skel-title"></div>
              <div class="skel skel-title short"></div>
              <div class="skel skel-text"></div>
              <div class="skel skel-meta"></div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="error">
        <div class="state-panel error-state">
          <div class="state-icon error-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 9V15M14 19H14.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="14" cy="14" r="12" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <h2 class="state-title">Gagal Memuat Artikel</h2>
          <p class="state-desc">Terjadi kesalahan saat mengambil data. Periksa koneksi internet Anda.</p>
          <button class="btn-primary" @click="refresh()">Coba Lagi</button>
        </div>
      </template>

      <template v-else-if="filteredArticles.length === 0">
        <div class="state-panel empty-state fade-up">
          <div class="state-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="1.5"/>
              <path d="M10 16h12M16 10v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
            </svg>
          </div>
          <h2 class="state-title">Tidak Ada Artikel</h2>
          <p class="state-desc">Tidak ditemukan artikel yang cocok. Coba ubah kata kunci atau filter.</p>
          <button class="btn-primary" @click="resetFilters">Reset Filter</button>
        </div>
      </template>

      <template v-else-if="viewMode === 'card'">
        <div class="cards-grid">
          <article
            v-if="filteredArticles[0]"
            class="card card-featured fade-up"
            @click="openArticle(filteredArticles[0])"
          >
            <div class="card-image-wrap">
              <img :src="getImage(filteredArticles[0], 0)" :alt="filteredArticles[0].title" class="card-image" loading="lazy" />
              <div class="card-image-overlay"></div>
              <div class="card-featured-badge">HEADLINE</div>
              <div class="card-featured-content">
                <div class="card-category-pill">{{ getCategory(filteredArticles[0]) }}</div>
                <h2 class="card-featured-title">{{ filteredArticles[0].title }}</h2>
                <p class="card-featured-desc">{{ getDescription(filteredArticles[0]) }}</p>
                <div class="card-byline">
                  <div class="author-avatar">{{ getInitials(filteredArticles[0].author) }}</div>
                  <div>
                    <span class="byline-name">{{ filteredArticles[0].author }}</span>
                    <span class="byline-date">{{ formatDate(getDate(filteredArticles[0])) }} · {{ readingTime(filteredArticles[0]) }} baca</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article
            v-for="(article, idx) in filteredArticles.slice(1)"
            :key="article.id ?? idx"
            class="card fade-up"
            :style="{ animationDelay: `${(idx % 6) * 0.07 + 0.1}s` }"
            @click="openArticle(article)"
          >
            <div class="card-img-top">
              <img :src="getImage(article, idx + 1)" :alt="article.title" class="card-image-sm" loading="lazy" />
              <div class="card-img-overlay-sm"></div>
            </div>
            <div class="card-body">
              <div class="card-meta-top">
                <span class="card-category">{{ getCategory(article) }}</span>
                <span class="card-reading-time">{{ readingTime(article) }}</span>
              </div>
              <h3 class="card-title">{{ article.title }}</h3>
              <p class="card-desc">{{ getDescription(article) }}</p>
              <div class="card-footer">
                <div class="author-avatar sm">{{ getInitials(article.author) }}</div>
                <span class="card-author">{{ article.author }}</span>
                <span class="card-dot">·</span>
                <span class="card-date">{{ formatDate(getDate(article)) }}</span>
                <span class="card-arrow">→</span>
              </div>
            </div>
          </article>
        </div>
      </template>

      <template v-else>
        <div class="list-wrapper">
          <div class="list-header">
            <span class="list-num">#</span>
            <span class="list-col-title">Artikel</span>
            <span class="list-col-author">Penulis</span>
            <span class="list-col-date">Tanggal</span>
            <span class="list-col-cat">Kategori</span>
          </div>

          <div
            v-for="(article, idx) in filteredArticles"
            :key="article.id ?? idx"
            class="list-row fade-up"
            :style="{ animationDelay: `${idx * 0.04}s` }"
            @click="openArticle(article)"
          >
            <span class="list-index">{{ String(idx + 1).padStart(2, '0') }}</span>
            <div class="list-main">
              <div class="list-category-tag">{{ getCategory(article) }}</div>
              <h3 class="list-title">{{ article.title }}</h3>
              <p class="list-desc">{{ getDescription(article) }}</p>
            </div>
            <div class="list-author-col">
              <div class="author-avatar sm">{{ getInitials(article.author) }}</div>
              <span>{{ article.author }}</span>
            </div>
            <span class="list-date">{{ formatDate(getDate(article)) }}</span>
            <span class="list-cat-badge">{{ getCategory(article) }}</span>
            <span class="list-arrow">→</span>
          </div>
        </div>
      </template>

    </main>

    <footer class="site-footer">
      <div class="rule-triple">
        <div class="rule-t"></div>
        <div class="rule-b"></div>
      </div>
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">DUDUNG<em>NEWS</em></span>
          <span class="footer-copy">© {{ new Date().getFullYear() }} Dudung News. Dibuat dengan Nuxt 3.</span>
        </div>
        <div class="footer-stats">
          <div class="stat-item">
            <span class="stat-num">{{ articlesArray.length }}</span>
            <span class="stat-label">Artikel</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">{{ authors.length }}</span>
            <span class="stat-label">Penulis</span>
          </div>
        </div>
      </div>
    </footer>

    <Transition name="modal">
      <div v-if="activeArticle" class="modal-backdrop" @click.self="closeArticle">
        <div class="modal-panel">
          <div class="modal-header">
            <div class="modal-category-chip">{{ getCategory(activeArticle) }}</div>
            <button class="modal-close" @click="closeArticle">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-img-wrap">
            <img :src="getImage(activeArticle, 0)" :alt="activeArticle.title" class="modal-img" />
            <div class="modal-img-gradient"></div>
          </div>
          <div class="modal-content">
            <h1 class="modal-title">{{ activeArticle.title }}</h1>
            <div class="modal-byline">
              <div class="author-avatar">{{ getInitials(activeArticle.author) }}</div>
              <div class="modal-byline-text">
                <div class="byline-name">{{ activeArticle.author }}</div>
                <div class="byline-date">{{ formatDate(getDate(activeArticle)) }} · {{ readingTime(activeArticle) }} baca</div>
              </div>
            </div>
            <div class="modal-divider"></div>
            <div class="modal-body">
              <p>{{ activeArticle.content || activeArticle.description || 'Konten artikel tidak tersedia.' }}</p>
            </div>
            <a
              v-if="activeArticle.url"
              :href="activeArticle.url"
              target="_blank"
              rel="noopener"
              class="modal-source-link"
            >
              Baca selengkapnya di sumber asli
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H6M12 2V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHead, useRuntimeConfig, useLazyFetch } from 'nuxt/app'
import type { Article, ApiResponse } from '../types/article'

useHead({
  title: 'Dudung News — Berita Terkini',
  meta: [{ name: 'description', content: 'Portal berita pilihan dari penulis terpercaya.' }],
})

const config = useRuntimeConfig()
const { data: apiResponse, pending, error, refresh } = await useLazyFetch<ApiResponse>(
  config.public.apiBase as string,
  { default: () => ({ status: 'ok', articles: [] }) }
)

const articlesArray = computed<Article[]>(() => {
  const val = apiResponse.value?.articles
  if (!Array.isArray(val)) return []
  return val.filter(isValidArticle)
})

const isValidArticle = (article: Article) => Boolean(article.title && article.author)

const getImage = (article: Article, index = 0) =>
  article.urlToImage || `https://via.placeholder.com/900x600?text=Berita+${index + 1}`

const getCategory = (article: Article) => {
  if (typeof article.source === 'object' && article.source?.name) {
    return article.source.name
  }
  if (typeof article.source === 'string') {
    return article.source
  }
  return article.category || 'Umum'
}

const getDescription = (article: Article) =>
  article.description ||
  (article.content?.slice(0, 120).trim() + '...') ||
  'Deskripsi tidak tersedia.'

const getInitials = (author: string) => {
  if (!author) return 'DN'
  const parts = author.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

const getDate = (article: Article) => article.publishedAt || new Date().toISOString()

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const readingTime = (article: Article) => {
  const words = (article.content || article.description || '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

const searchQuery = ref('')
const selectedAuthor = ref('')
const sortOrder = ref<'newest' | 'oldest'>('newest')
const viewMode = ref<'card' | 'list'>('card')
const activeArticle = ref<Article | null>(null)
const searchFocused = ref(false)

const currentDay = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long' })
)
const currentMonthYear = computed(() =>
  new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
)

const authors = computed<string[]>(() =>
  [...new Set(articlesArray.value.map(a => a.author).filter(Boolean))].sort()
)

const filteredArticles = computed<Article[]>(() => {
  let arr = [...articlesArray.value]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    arr = arr.filter(a =>
      (a.title || '').toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q) ||
      (a.content || '').toLowerCase().includes(q)
    )
  }

  if (selectedAuthor.value) {
    arr = arr.filter(a => a.author === selectedAuthor.value)
  }

  arr.sort((a, b) => {
    const da = new Date(getDate(a)).getTime() || 0
    const db = new Date(getDate(b)).getTime() || 0
    return sortOrder.value === 'newest' ? db - da : da - db
  })

  return arr
})

const openArticle = (a: Article) => { activeArticle.value = a }
const closeArticle = () => { activeArticle.value = null }
const resetFilters = () => {
  searchQuery.value = ''
  selectedAuthor.value = ''
  sortOrder.value = 'newest'
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeArticle()
}
onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.masthead {
  background: var(--cream);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 0 var(--border), 0 4px 24px var(--shadow);
}

.masthead-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0 0.75rem;
}

.masthead-date {
  display: flex;
  flex-direction: column;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.6;
  min-width: 120px;
}
.masthead-day {
  font-weight: 500;
  color: var(--ink);
}

.masthead-logo {
  text-align: center;
  line-height: 1;
}
.logo-wordmark {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 900;
  color: var(--ink);
  letter-spacing: 0.04em;
  display: block;
}
.logo-wordmark em {
  font-style: normal;
  color: var(--accent);
  margin-left: 0.1em;
}
.logo-tagline {
  font-family: var(--font-mono);
  font-size: 0.52rem;
  letter-spacing: 0.25em;
  color: var(--muted);
  text-transform: uppercase;
  display: block;
  margin-top: 0.3rem;
}

.masthead-meta {
  min-width: 120px;
  display: flex;
  justify-content: flex-end;
}
.article-count-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--ink);
  color: var(--paper);
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-sm);
}
.count-num {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1;
}
.count-label {
  font-family: var(--font-mono);
  font-size: 0.5rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-top: 0.1rem;
  opacity: 0.65;
}

.rule-triple {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0.5rem 0 0;
}
.rule-t { height: 1px; background: var(--ink); }
.rule-b { height: 3px; background: var(--ink); }

.ticker-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.45rem 0 0.6rem;
  overflow: hidden;
}
.ticker-label {
  background: var(--accent);
  color: white;
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  font-weight: 600;
  padding: 0.18rem 0.55rem;
  flex-shrink: 0;
}
.ticker-track {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
}
.ticker-sep {
  color: var(--accent);
  font-size: 0.45rem;
  opacity: 0.6;
}

.controls-wrapper {
  background: var(--paper);
  border-bottom: 1.5px solid var(--border);
  padding: 0 2rem;
}

.controls-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 0;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--card-bg);
  border: 1.5px solid var(--border);
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-sm);
  flex: 1;
  min-width: 200px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-box.focused {
  border-color: var(--ink);
  box-shadow: 0 0 0 3px rgba(13,13,13,0.06);
}
.search-icon { color: var(--muted); flex-shrink: 0; }
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: var(--ink);
}
.search-input::placeholder { color: var(--muted-light); }
.search-clear {
  color: var(--muted);
  padding: 0.1rem;
  line-height: 1;
  transition: color 0.15s;
}
.search-clear:hover { color: var(--ink); }

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.filter-label {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  color: var(--muted);
  white-space: nowrap;
}

.select-wrapper { position: relative; }
.filter-select {
  appearance: none;
  background: var(--card-bg);
  border: 1.5px solid var(--border);
  padding: 0.45rem 2rem 0.45rem 0.7rem;
  font-size: 0.8rem;
  color: var(--ink);
  border-radius: var(--radius-sm);
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}
.filter-select:focus { border-color: var(--ink); }
.select-chevron {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
}

.sort-tabs {
  display: flex;
  background: var(--card-bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.sort-tab {
  padding: 0.42rem 0.8rem;
  font-size: 0.78rem;
  color: var(--muted);
  border-right: 1px solid var(--border);
  transition: background 0.15s, color 0.15s;
  letter-spacing: 0.01em;
}
.sort-tab:last-child { border-right: none; }
.sort-tab:hover { background: var(--paper); color: var(--ink); }
.sort-tab.active { background: var(--ink); color: var(--paper); }

.controls-right {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-left: auto;
}

.results-info {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--muted);
  white-space: nowrap;
}

.view-toggle {
  display: flex;
  background: var(--card-bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.view-btn {
  padding: 0.42rem 0.6rem;
  color: var(--muted);
  border-right: 1px solid var(--border);
  display: flex;
  align-items: center;
  transition: background 0.15s, color 0.15s;
}
.view-btn:last-child { border-right: none; }
.view-btn:hover { background: var(--paper); color: var(--ink); }
.view-btn.active { background: var(--ink); color: var(--paper); }

.main-content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  width: 100%;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.card-featured {
  grid-column: span 12;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  height: 460px;
  box-shadow: 0 4px 32px var(--shadow-deep);
  transition: transform 0.3s, box-shadow 0.3s;
}
.card-featured:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 48px var(--shadow-deep);
}

.card-image-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.card-featured:hover .card-image { transform: scale(1.03); }
.card-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(8,8,8,0.94) 0%, rgba(8,8,8,0.5) 40%, rgba(8,8,8,0.1) 100%);
}
.card-featured-badge {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: var(--accent);
  color: white;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  letter-spacing: 0.18em;
  padding: 0.25rem 0.6rem;
  font-weight: 600;
}
.card-featured-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2.5rem 3rem;
}
.card-category-pill {
  display: inline-block;
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.8);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.18rem 0.55rem;
  margin-bottom: 0.875rem;
}
.card-featured-title {
  font-family: var(--font-serif);
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 700;
  color: white;
  line-height: 1.18;
  margin-bottom: 0.875rem;
  max-width: 720px;
}
.card-featured-desc {
  font-size: 0.92rem;
  color: rgba(255,255,255,0.68);
  margin-bottom: 1.5rem;
  max-width: 620px;
  line-height: 1.6;
}
.card-byline {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.byline-name {
  display: block;
  color: white;
  font-size: 0.82rem;
  font-weight: 500;
}
.byline-date {
  display: block;
  color: rgba(255,255,255,0.5);
  font-size: 0.7rem;
  font-family: var(--font-mono);
  margin-top: 0.1rem;
}

.card {
  grid-column: span 4;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px var(--shadow);
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
  opacity: 0;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 36px var(--shadow-deep);
  border-color: var(--ink);
}

.card-img-top {
  height: 185px;
  overflow: hidden;
  position: relative;
}
.card-image-sm {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.card:hover .card-image-sm { transform: scale(1.06); }
.card-img-overlay-sm {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 60%);
  transition: opacity 0.3s;
}

.card-body {
  padding: 1.1rem 1.25rem 1.3rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.card-meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.card-category {
  font-family: var(--font-mono);
  font-size: 0.57rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 500;
}
.card-reading-time {
  font-family: var(--font-mono);
  font-size: 0.57rem;
  color: var(--muted-light);
}
.card-title {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 0.5rem;
  color: var(--ink);
}
.card-desc {
  font-size: 0.8rem;
  color: var(--muted);
  line-height: 1.55;
  flex: 1;
  margin-bottom: 1rem;
}
.card-footer {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.74rem;
  color: var(--muted);
  padding-top: 0.875rem;
  border-top: 1px solid var(--border-light);
}
.card-author { font-weight: 500; color: var(--ink); }
.card-dot { color: var(--border); }
.card-arrow {
  margin-left: auto;
  color: var(--accent);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s, transform 0.2s;
  font-size: 0.85rem;
}
.card:hover .card-arrow { opacity: 1; transform: translateX(0); }

.author-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--cream);
  font-family: var(--font-serif);
  font-size: 0.68rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}
.author-avatar.sm {
  width: 24px;
  height: 24px;
  font-size: 0.52rem;
}

.list-wrapper {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--card-bg);
  box-shadow: 0 2px 12px var(--shadow);
}

.list-header {
  display: grid;
  grid-template-columns: 52px 1fr 170px 120px 110px;
  align-items: center;
  padding: 0.65rem 1.5rem;
  background: var(--ink);
  color: var(--paper);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  gap: 1rem;
  opacity: 0.95;
}

.list-row {
  display: grid;
  grid-template-columns: 52px 1fr 170px 120px 110px 28px;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.15s;
  opacity: 0;
}
.list-row:last-child { border-bottom: none; }
.list-row:hover { background: var(--paper); }
.list-row:hover .list-arrow { opacity: 1; transform: translateX(3px); }

.list-index {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--muted-light);
  font-weight: 500;
}
.list-category-tag {
  font-family: var(--font-mono);
  font-size: 0.56rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.2rem;
}
.list-title {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 0.2rem;
  color: var(--ink);
}
.list-desc {
  font-size: 0.74rem;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list-author-col {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--ink);
}
.list-date {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--muted);
}
.list-cat-badge {
  display: inline-block;
  background: var(--paper);
  border: 1px solid var(--border);
  color: var(--muted);
  font-size: 0.58rem;
  padding: 0.15rem 0.45rem;
  border-radius: 20px;
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}
.list-arrow {
  color: var(--accent);
  font-size: 0.95rem;
  opacity: 0;
  transition: opacity 0.15s, transform 0.15s;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}
.skeleton-card {
  grid-column: span 4;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.skeleton-card.featured { grid-column: span 12; }

.skel {
  background: linear-gradient(90deg, var(--border-light) 25%, var(--paper) 50%, var(--border-light) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 2px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton-card.featured .skel-img { height: 300px; }
.skel-img { height: 185px; border-radius: 0; }
.skel-body { padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.55rem; }
.skel-tag { height: 10px; width: 70px; }
.skel-title { height: 16px; }
.skel-title.short { width: 65%; }
.skel-text { height: 12px; }
.skel-meta { height: 10px; width: 45%; margin-top: 0.4rem; }

.state-panel {
  text-align: center;
  padding: 6rem 2rem;
  max-width: 480px;
  margin: 0 auto;
}
.state-icon {
  width: 60px;
  height: 60px;
  background: var(--paper);
  border: 1.5px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--muted);
}
.error-icon {
  background: var(--accent-light);
  border-color: var(--accent-soft);
  color: var(--accent);
}
.state-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}
.state-desc {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 1.75rem;
}
.btn-primary {
  background: var(--ink);
  color: var(--paper);
  padding: 0.65rem 1.75rem;
  font-size: 0.82rem;
  letter-spacing: 0.05em;
  border-radius: var(--radius-sm);
  transition: background 0.2s, transform 0.15s;
}
.btn-primary:hover { background: var(--accent); transform: translateY(-1px); }

.site-footer {
  background: var(--cream);
  padding: 0 2rem 1.75rem;
  border-top: 1px solid var(--border);
  margin-top: auto;
}
.footer-inner {
  max-width: 1400px;
  margin: 1.25rem auto 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.footer-logo {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}
.footer-logo em {
  font-style: normal;
  color: var(--accent);
  margin-left: 0.1em;
}
.footer-copy {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--muted);
}
.footer-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-num {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
}
.stat-label {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 0.15rem;
}
.stat-divider {
  width: 1px;
  height: 28px;
  background: var(--border);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(8,8,8,0.72);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.modal-panel {
  background: var(--cream);
  width: 100%;
  max-width: 680px;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: var(--radius-md);
  position: relative;
  box-shadow: 0 32px 96px rgba(0,0,0,0.4);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.5rem 0;
}
.modal-category-chip {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid var(--accent-soft);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
}
.modal-close {
  width: 32px;
  height: 32px;
  background: var(--ink);
  color: var(--paper);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s, transform 0.15s;
}
.modal-close:hover { background: var(--accent); transform: rotate(90deg); }
.modal-img-wrap {
  height: 260px;
  overflow: hidden;
  position: relative;
  margin-top: 1rem;
}
.modal-img { width: 100%; height: 100%; object-fit: cover; }
.modal-img-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(250,248,245,0.6) 0%, transparent 60%);
}
.modal-content { padding: 1.75rem 2rem 2.25rem; }
.modal-title {
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 3vw, 1.85rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.25rem;
}
.modal-byline {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.modal-byline-text .byline-name { color: var(--ink); }
.modal-byline-text .byline-date { color: var(--muted); }
.modal-divider {
  height: 1px;
  background: var(--border);
  margin: 1.25rem 0;
}
.modal-body {
  font-size: 0.93rem;
  line-height: 1.85;
  color: var(--ink);
}
.modal-source-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.75rem;
  background: var(--ink);
  color: var(--paper);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-sm);
  transition: background 0.2s, transform 0.15s;
}
.modal-source-link:hover { background: var(--accent); transform: translateY(-1px); color: var(--paper); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-panel, .modal-leave-active .modal-panel { transition: transform 0.25s ease; }
.modal-enter-from .modal-panel { transform: translateY(20px) scale(0.97); }
.modal-leave-to .modal-panel { transform: translateY(10px) scale(0.98); }

@media (max-width: 1100px) {
  .card { grid-column: span 6; }
}
@media (max-width: 768px) {
  .masthead, .controls-wrapper, .main-content, .site-footer { padding-left: 1rem; padding-right: 1rem; }
  .card, .card-featured { grid-column: span 12; }
  .card-featured { height: 320px; }
  .card-featured-content { padding: 1.5rem; }
  .card-featured-title { font-size: 1.35rem; }
  .list-header { display: none; }
  .list-row {
    grid-template-columns: 36px 1fr 28px;
  }
  .list-author-col, .list-date, .list-cat-badge { display: none; }
  .list-arrow { grid-column: 3; grid-row: 1; }
  .controls-inner { gap: 0.75rem; }
  .controls-right { margin-left: 0; width: 100%; justify-content: space-between; }
  .logo-wordmark { font-size: 1.5rem; }
  .masthead-meta { display: none; }
}
</style>
