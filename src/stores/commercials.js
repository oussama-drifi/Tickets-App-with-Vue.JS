import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { adminApi } from '@/services/api'

const PAGE_SIZE = 5;

export const useCommercialsStore = defineStore('commercials', () => {
  const commercials = ref([])

  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const error = ref(null)

  const currentPage = ref(1)
  const totalPages = ref(1)
  const total = ref(0)

  const fetched = ref(false)
  const fetchedAll = ref(false)

  const filterStatus = ref('all')
  const filterSearch = ref('')

  const selectedCommercial = ref(null)
  const isSelectedCommercialLoading = ref(false)
  const selectedCommercialNotFoundError = ref(null)

  const filteredCommercials = computed(() => {
    return commercials.value.filter((c) => {
      if (!fetchedAll.value) return true
      if (!c.name.toLowerCase().startsWith(filterSearch.value.toLowerCase())) return false
      if (!c.status.toLowerCase().startsWith(filterStatus.value.toLowerCase())) return false
      return true
    })
  })

  let abortController = null

  function abortPending() {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  function buildQuery(p = 1) {
    const params = new URLSearchParams()
    params.set('page', p)
    params.set('limit', PAGE_SIZE)
    if (filterSearch.value) params.set('search', filterSearch.value)
    if (filterStatus.value && filterStatus.value !== 'all') params.set('status', filterStatus.value)
    return `?${params.toString()}`
  }

  async function fetchCommercials(fetchMore = false) {
    abortPending()
    abortController = new AbortController()
    const { signal } = abortController

    const page = fetchMore ? currentPage.value + 1 : 1

    if (fetchMore) {
      isLoadingMore.value = true
    } else {
      isLoading.value = true
      error.value = null
    }

    try {
      const data = await adminApi.get(
        `/commercials${buildQuery(page)}`,
        { signal }
      )
      commercials.value = fetchMore ? [...commercials.value, ...data.commercials] : data.commercials
  
      currentPage.value = data.page
      totalPages.value = data.totalPages
      total.value = data.total

      // set fetched flag
      fetched.value = true

      // set fetchedAll flag in case of no-filtered results and all data loaded
      if (!filterStatus.value && !filterSearch.value
          && currentPage.value === totalPages.value) {
          fetchedAll.value = true
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err.message
      }
    } finally {
      isLoading.value = false
      isLoadingMore.value = false
      abortController = null
    }
  }

  const hasMore = computed(() => currentPage.value < totalPages.value)

  async function fetchCommercial(commercialId) {

    const commercial = commercials.value.find(c => c.id === commercialId) || null

    if (commercial) {
      selectedCommercial.value = commercial
    }

    else {
      isSelectedCommercialLoading.value = true
      selectedCommercialNotFoundError.value = null
  
      try {
        selectedCommercial.value = await adminApi.get(`/commercials/${commercialId}`)
      } catch(err) {
        selectedCommercialNotFoundError.value = err.message
      } finally {
        isSelectedCommercialLoading.value = false
      }
    }

  }

  return {
    filteredCommercials, isLoading, isLoadingMore, error,
    currentPage, totalPages, total, fetched, fetchedAll, filterStatus, filterSearch,
    selectedCommercial, isSelectedCommercialLoading, selectedCommercialNotFoundError,
    fetchCommercials, hasMore, abortPending, fetchCommercial
  }
})