import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/services/api'

const PAGE_SIZE = 5

export const useTicketsStore = defineStore('tickets', () => {
    const tickets = ref([])
    const isLoading = ref(false)
    const isLoadingMore = ref(false)
    const error = ref(null)

    const sortBy = ref(null)    // 'amount' | 'date'
    const sortDir = ref('asc')  // 'asc' | 'desc'
    const fetched = ref(false)

    // Pagination
    const currentPage = ref(1)
    const totalPages = ref(1)
    const total = ref(0)

    const hasMore = computed(() => currentPage.value < totalPages.value)

    // Filters
    const filterStatus = ref('')
    const filterCategory = ref('')
    const filterDateFrom = ref('')
    const filterDateTo = ref('')

    // Abort controller
    let abortController = null

    function abortPending() {
        if (abortController) {
            abortController.abort()
            abortController = null
        }
    }

    function toggleSort(field) {
        if (sortBy.value === field) {
            sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortBy.value = field
            sortDir.value = 'asc'
        }
    }

    function buildQuery(page = 1) {
        const params = new URLSearchParams()
        if (filterStatus.value) params.set('status', filterStatus.value)
        if (filterCategory.value) params.set('category', filterCategory.value)
        if (filterDateFrom.value) params.set('dateFrom', filterDateFrom.value)
        if (filterDateTo.value) params.set('dateTo', filterDateTo.value)
        params.set('page', page)
        params.set('limit', PAGE_SIZE)
        const qs = params.toString()
        return qs ? `?${qs}` : ''
    }

    const sortedTickets = computed(() => {
        if (!sortBy.value) return tickets.value
        const dir = sortDir.value === 'asc' ? 1 : -1
        return [...tickets.value].sort((a, b) => {
            if (sortBy.value === 'amount') {
                return (Number(a.amount) - Number(b.amount)) * dir
            }
            if (sortBy.value === 'date') {
                return (new Date(a.ticketDate) - new Date(b.ticketDate)) * dir
            }
            return 0
        })
    })

    async function fetchTickets(loadMore = false) {
        abortPending()
        abortController = new AbortController()
        const { signal } = abortController

        const page = loadMore ? currentPage.value + 1 : 1

        if (loadMore) {
            isLoadingMore.value = true
        } else {
            isLoading.value = true
            error.value = null
        }

        try {
            const data = await adminApi.get(`/tickets${buildQuery(page)}`, { signal })
            if (loadMore) {
                tickets.value = [...tickets.value, ...data.tickets]
            } else {
                tickets.value = data.tickets
            }
            currentPage.value = data.page
            totalPages.value = data.totalPages
            total.value = data.total
            fetched.value = true
        } catch (err) {
            if (err.name === 'AbortError') return
            if (!loadMore) error.value = err.message
        } finally {
            isLoading.value = false
            isLoadingMore.value = false
            abortController = null
        }
    }

    const selectedCommercialTickets = ref([])
    const commercialCurrentPage = ref(1)
    const commercialTotalPages = ref(1)
    const commercialTotal = ref(0)
    const commercialHasMore = computed(() => commercialCurrentPage.value < commercialTotalPages.value)

    let commercialAbortController = null

    function abortPendingCommercial() {
        if (commercialAbortController) {
            commercialAbortController.abort()
            commercialAbortController = null
        }
    }

    const sortedCommercialTickets = computed(() => {
        if (!sortBy.value) return selectedCommercialTickets.value
        const dir = sortDir.value === 'asc' ? 1 : -1
        return [...selectedCommercialTickets.value].sort((a, b) => {
            if (sortBy.value === 'amount') {
                return (Number(a.amount) - Number(b.amount)) * dir
            }
            if (sortBy.value === 'date') {
                return (new Date(a.ticketDate) - new Date(b.ticketDate)) * dir
            }
            return 0
        })
    })

    async function loadCommercialTickets(commercialId, loadMore = false) {
        abortPendingCommercial()
        commercialAbortController = new AbortController()
        const { signal } = commercialAbortController

        const page = loadMore ? commercialCurrentPage.value + 1 : 1

        if (loadMore) {
            isLoadingMore.value = true
        } else {
            isLoading.value = true
            error.value = null
        }

        try {
            const data = await adminApi.get(`/commercials/${commercialId}/tickets${buildQuery(page)}`, { signal })
            if (loadMore) {
                selectedCommercialTickets.value = [...selectedCommercialTickets.value, ...data.tickets]
            } else {
                selectedCommercialTickets.value = data.tickets
            }
            commercialCurrentPage.value = data.page
            commercialTotalPages.value = data.totalPages
            commercialTotal.value = data.total
        } catch (err) {
            if (err.name === 'AbortError') return
            if (!loadMore) {
                error.value = err.message
                selectedCommercialTickets.value = []
            }
        } finally {
            isLoading.value = false
            isLoadingMore.value = false
            commercialAbortController = null
        }
    }

    function clearFilters() {
        filterStatus.value = ''
        filterCategory.value = ''
        filterDateFrom.value = ''
        filterDateTo.value = ''
    }

    return {
        tickets, isLoading, isLoadingMore, error, fetched, sortBy, sortDir,
        filterStatus, filterCategory, filterDateFrom, filterDateTo,
        sortedTickets, currentPage, totalPages, total, hasMore,
        selectedCommercialTickets, sortedCommercialTickets,
        commercialCurrentPage, commercialTotalPages, commercialTotal, commercialHasMore,
        toggleSort, fetchTickets, loadCommercialTickets, clearFilters, abortPending, abortPendingCommercial
    }
})
