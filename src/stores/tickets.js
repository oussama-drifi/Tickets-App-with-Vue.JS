import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/services/api'

const PAGE_SIZE = 8

export const useTicketsStore = defineStore('tickets', () => {
    const tickets = ref({})
    const filteredTickets = ref({})
    const fetched = ref(false)
    const fetchedAll = ref(false)

    const selectedCommercialId = ref(null)
    const selectedCommercialTickets = ref({})
    const filteredCommercialTickets = ref({})
    const commercialTicketsFetched = ref(false)
    const commercialFetchedAll = ref(false)

    const isLoading = ref(false)
    const isLoadingMore = ref(false)
    const error = ref(null)

    // Pagination — all tickets
    const currentPage = ref(1)
    const totalPages = ref(1)
    const total = ref(0)

    // Pagination — commercial tickets
    const commercialCurrentPage = ref(1)
    const commercialTotalPages = ref(1)
    const commercialTotal = ref(0)

    // Pagination — filtered tickets
    const currentFilteredPage = ref(1)
    const totalFilteredPages = ref(1)
    const totalFiltered = ref(0)

    // Filters
    const filterStatus = ref('')
    const filterCategory = ref('')
    const filterDateFrom = ref('')
    const filterDateTo = ref('')

    // Abort controllers
    let abortController = null
    let commercialAbortController = null

    function abortPending() {
        if (abortController) { abortController.abort(); abortController = null }
    }
    function abortPendingCommercial() {
        if (commercialAbortController) { commercialAbortController.abort(); commercialAbortController = null }
    }

    const filtersActive = computed(() =>
        filterStatus.value || filterCategory.value || filterDateFrom.value || filterDateTo.value
    )

    // All in-memory tickets flattened and filtered
    const allFilteredInMemory = computed(() =>
        Object.values(tickets.value).flat().filter(filterTicket)
    )

    const currentPageTickets = computed(() => {
        if (filtersActive.value) {
            if (fetchedAll.value) {
                // paginate in-memory filtered results
                const start = (currentFilteredPage.value - 1) * PAGE_SIZE
                return allFilteredInMemory.value.slice(start, start + PAGE_SIZE)
            }
            return filteredTickets.value[currentFilteredPage.value] || []
        }
        return tickets.value[currentPage.value] || []
    })

    // Effective page/totalPages exposed to the UI
    const activePage = computed(() =>
        filtersActive.value ? currentFilteredPage.value : currentPage.value
    )
    const activeTotalPages = computed(() => {
        if (filtersActive.value) {
            if (fetchedAll.value) return Math.ceil(allFilteredInMemory.value.length / PAGE_SIZE) || 1
            return totalFilteredPages.value
        }
        return totalPages.value
    })

    async function fetchTickets() {
        abortPending()
        abortController = new AbortController()
        const { signal } = abortController
        isLoading.value = true
        error.value = null

        try {
            const data = await adminApi.get(`/tickets${buildQuery()}`, { signal })

            if (filtersActive.value) {
                currentFilteredPage.value = data.page
                totalFilteredPages.value = data.totalPages
                totalFiltered.value = data.total
                filteredTickets.value = { ...filteredTickets.value, [data.page]: data.tickets }
            } else {
                currentPage.value = data.page
                totalPages.value = data.totalPages
                total.value = data.total
                tickets.value = { ...tickets.value, [data.page]: data.tickets }
                fetched.value = true
                if (Object.keys(tickets.value).length === data.totalPages) {
                    fetchedAll.value = true
                }
            }
        } catch (err) {
            if (err.name === 'AbortError') return
            error.value = err.message
        } finally {
            if (signal === abortController?.signal) {
                isLoading.value = false
                abortController = null
            }
        }
    }

    async function goToPage(page) {
        const tp = activeTotalPages.value
        const target = Math.max(1, Math.min(page, tp))

        if (filtersActive.value) {
            // in-memory: just update page, computed handles it
            if (fetchedAll.value) { currentFilteredPage.value = target; return }
            // already cached
            if (filteredTickets.value[target]) { currentFilteredPage.value = target; return }
            currentFilteredPage.value = target
        } else {
            if (tickets.value[target]) { currentPage.value = target; return }
            currentPage.value = target
        }

        await fetchTickets()
    }

    async function loadCommercialTickets(commercialId, loadMore = false) {
        // reset cache if switching commercial
        if (commercialId !== selectedCommercialId.value) {
            selectedCommercialTickets.value = {}
            filteredCommercialTickets.value = {}
            commercialTicketsFetched.value = false
            commercialFetchedAll.value = false
            commercialCurrentPage.value = 1
            commercialTotalPages.value = 1
            commercialTotal.value = 0
            selectedCommercialId.value = commercialId
        }

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
                selectedCommercialTickets.value = [...(selectedCommercialTickets.value[commercialCurrentPage.value] || []), ...data.tickets]
            } else {
                selectedCommercialTickets.value = { ...selectedCommercialTickets.value, [data.page]: data.tickets }
            }
            commercialCurrentPage.value = data.page
            commercialTotalPages.value = data.totalPages
            commercialTotal.value = data.total
            commercialTicketsFetched.value = true
            if (!filtersActive.value && data.page === data.totalPages) {
                commercialFetchedAll.value = true
            }
        } catch (err) {
            if (err.name === 'AbortError') return
            if (!loadMore) {
                error.value = err.message
                selectedCommercialTickets.value = {}
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
        filteredTickets.value = {}
        currentFilteredPage.value = 1
        totalFilteredPages.value = 1
        totalFiltered.value = 0
        // snap to last cached unfiltered page
        const cachedPages = Object.keys(tickets.value).map(Number)
        if (cachedPages.length) currentPage.value = Math.max(...cachedPages)
    }

    function filterTicket(t) {
        if (filterStatus.value && filterStatus.value !== t.status) return false
        if (filterCategory.value && filterCategory.value !== t.category) return false
        const date = String(t.created_at).slice(0, 10)
        if (filterDateFrom.value && date < filterDateFrom.value) return false
        if (filterDateTo.value && date > filterDateTo.value) return false
        return true
    }

    function buildQuery(page) {
        const params = new URLSearchParams()
        if (filterStatus.value) params.set('status', filterStatus.value)
        if (filterCategory.value) params.set('category', filterCategory.value)
        if (filterDateFrom.value) params.set('dateFrom', filterDateFrom.value)
        if (filterDateTo.value) params.set('dateTo', filterDateTo.value)
        const p = page ?? (filtersActive.value ? currentFilteredPage.value : currentPage.value)
        params.set('page', p)
        params.set('limit', PAGE_SIZE)
        return `?${params.toString()}`
    }

    return {
        tickets,
        filteredTickets,
        isLoading,
        isLoadingMore,
        error,
        fetched,
        fetchedAll,
        filterStatus,
        filterCategory,
        filterDateFrom,
        filterDateTo,
        filtersActive,
        currentPage,
        totalPages,
        total,
        currentFilteredPage,
        totalFilteredPages,
        totalFiltered,
        activePage,
        activeTotalPages,
        currentPageTickets,
        selectedCommercialId,
        selectedCommercialTickets,
        filteredCommercialTickets,
        commercialTicketsFetched,
        commercialFetchedAll,
        commercialCurrentPage,
        commercialTotalPages,
        commercialTotal,
        fetchTickets,
        goToPage,
        loadCommercialTickets,
        clearFilters,
        abortPending,
        abortPendingCommercial,
    }
})
