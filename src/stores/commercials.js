import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminApi } from '@/services/api'

export const useCommercialsStore = defineStore('commercials', () => {
  const commercials = ref([])
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const error = ref(null)
  const page = ref(1)
  const totalPages = ref(1)
  const total = ref(0)

  let abortController = null

  function abortPending() {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  function buildQuery(search, status, p) {
    const params = new URLSearchParams()
    params.set('page', p)
    params.set('limit', '5')
    if (search) params.set('search', search)
    if (status && status !== 'all') params.set('status', status)
    return `?${params.toString()}`
  }

  async function fetchCommercials(search = '', status = 'all') {
    abortPending()
    abortController = new AbortController()

    commercials.value = []
    page.value = 1
    isLoading.value = true
    error.value = null

    try {
      const data = await adminApi.get(
        `/commercials${buildQuery(search, status, 1)}`,
        { signal: abortController.signal }
      )
      commercials.value = data.commercials
      page.value = data.page
      totalPages.value = data.totalPages
      total.value = data.total
    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err.message
      }
    } finally {
      isLoading.value = false
      abortController = null
    }
  }

  async function fetchMore(search = '', status = 'all') {
    if (page.value >= totalPages.value || isLoadingMore.value) return

    abortPending()
    abortController = new AbortController()

    const nextPage = page.value + 1
    isLoadingMore.value = true

    try {
      const data = await adminApi.get(
        `/commercials${buildQuery(search, status, nextPage)}`,
        { signal: abortController.signal }
      )
      commercials.value.push(...data.commercials)
      page.value = data.page
      totalPages.value = data.totalPages
      total.value = data.total
    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err.message
      }
    } finally {
      isLoadingMore.value = false
      abortController = null
    }
  }

  const hasMore = () => page.value < totalPages.value

  return {
    commercials, isLoading, isLoadingMore, error,
    page, totalPages, total,
    fetchCommercials, fetchMore, hasMore, abortPending
  }
})
