import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/services/api'

const PAGE_SIZE = 7

export const useTicketsStore = defineStore('tickets', () => {
    const tickets = ref({})
    const isLoading = ref(false)
    const error = ref(null)
    const isLoadingMore = ref(false)

    const fetched = ref(false)
    const fetchedAll = ref(false) // use just filter instead of fetching

    // Pagination of all tickets
    const currentPage = ref(1) // always start from first page
    const totalPages = ref(1) // initialy
    const total = ref(0) // initialy

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

    function buildQuery() {
        const params = new URLSearchParams()
        if (filterStatus.value) params.set('status', filterStatus.value)
        if (filterCategory.value) params.set('category', filterCategory.value)
        if (filterDateFrom.value) params.set('dateFrom', filterDateFrom.value)
        if (filterDateTo.value) params.set('dateTo', filterDateTo.value)
        params.set('page', currentPage.value)
        params.set('limit', PAGE_SIZE)
        const qs = params.toString()
        return qs ? `?${qs}` : ''
    }

    // const filteredTickets = computed(() => tickets.value.filter(filterTickets))

    const currentPageTickets = computed(() => tickets.value[currentPage].filter(filterTickets))

    async function fetchTickets(loadMore = false) {

        console.log("fetched")

        if (tickets.value[currentPage.value]) return

        abortPending()
        abortController = new AbortController()
        const { signal } = abortController

        if (loadMore) {
            isLoadingMore.value = true
        } else {
            isLoading.value = true
            error.value = null
        }

        try {
            const data = await adminApi.get(`/tickets${buildQuery()}`, { signal })

            // tickets.value = loadMore ? [...tickets.value, ...data.tickets] : data.tickets
            
            tickets.currentPage = data.tickets

            currentPage.value = data.page
            totalPages.value = data.totalPages
            total.value = data.total
            fetched.value = true

            if (!filterStatus.value && !filterCategory.value && 
                !filterDateFrom.value && !filterDateTo.value
                && currentPage.value === totalPages.value) {
                fetchedAll.value = true
            }
            
        } catch (err) {
            if (err.name === 'AbortError') return
            if (!loadMore) error.value = err.message
        } finally {
            if (signal === abortController?.signal) {
                isLoading.value = false
                isLoadingMore.value = false
                abortController = null
            }
        }
    }


    const selectedCommercialTickets = ref([])
    const commercialTicketsFetched = ref(false)
    const commercialFetchedAll = ref(false)
    const filteredCommercialTickets = computed(() => selectedCommercialTickets.value.filter(filterTickets))

    // pagination of a commercial's tickets
    const commercialCurrentPage = ref(1) // always start from first page
    const commercialTotalPages = ref(1) // initialy
    const commercialTotal = ref(0) // initialy

    const commercialHasMore = computed(() => commercialCurrentPage.value < commercialTotalPages.value)

    let commercialAbortController = null

    function abortPendingCommercial() {
        if (commercialAbortController) {
            commercialAbortController.abort()
            commercialAbortController = null
        }
    }

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
            commercialTicketsFetched.value = true
            if (!filterStatus.value && !filterCategory.value && 
                !filterDateFrom.value && !filterDateTo.value
                && commercialCurrentPage.value === commercialTotalPages.value) {
                commercialFetchedAll.value = true
            }
        } catch (err) {
            if (err.name === 'AbortError') return
            if (!loadMore) {
                error.value = err.message
                selectedCommercialTickets.value = []
            }
        } finally {
            if (signal === commercialAbortController?.signal) {
                isLoading.value = false
                isLoadingMore.value = false
                commercialAbortController = null
            }
        }
    }

    function clearFilters() {
        filterStatus.value = ''
        filterCategory.value = ''
        filterDateFrom.value = ''
        filterDateTo.value = ''
    }

    function filterTickets(t) {
        if (filterStatus.value && filterStatus.value !== t.status) return false
        if (filterCategory.value && filterCategory.value !== t.category) return false
        const date = String(t.created_at).slice(0, 10)
        if (filterDateFrom.value && date < filterDateFrom.value) return false
        if (filterDateTo.value && date > filterDateTo.value) return false
        return true
    }

    return {
        tickets, isLoading, isLoadingMore, error, fetched, fetchedAll, commercialTicketsFetched,commercialFetchedAll,
        filterStatus, filterCategory, filterDateFrom, filterDateTo,
        currentPage, totalPages, total, hasMore, currentPageTickets,
        selectedCommercialTickets, filteredCommercialTickets,
        commercialCurrentPage, commercialTotalPages, commercialTotal, commercialHasMore,
        fetchTickets, loadCommercialTickets, clearFilters, abortPending, abortPendingCommercial
    }
})