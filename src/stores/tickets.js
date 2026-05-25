import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/services/api'

const PAGE_SIZE = 8

export const useTicketsStore = defineStore('tickets', () => {
    const tickets = ref({})
    const filteredTickets = ref({})
    const fetched = ref(false)
    const fetchedAll = ref(false)

    const selectedCommercialTickets = ref({})
    const filteredCommercialTickets = ref({})
    const commercialTicketsFetched = ref(false)
    const commercialFetchedAll = ref(false)

    const isLoading = ref(false)
    const error = ref(null)

    // Pagination of all tickets
    const currentPage = ref(1) // always start from first page
    const totalPages = ref(1) // initialy
    const total = ref(0) // initialy
    // pagination of a commercial's tickets
    const commercialCurrentPage = ref(1)
    const commercialTotalPages = ref(1)
    const commercialTotal = ref(0)

    // Pagination of filtered tickets
    const currentFilteredPage = ref(1)
    const totalFilteredPages = ref(1)
    const totalFiltered = ref(0)

    // Filters
    const filterStatus = ref('')
    const filterCategory = ref('')
    const filterDateFrom = ref('')
    const filterDateTo= ref('')

    
    // Abort controllers
    let abortController = null
    let commercialAbortController = null
    function abortPending() {
        if (abortController) {
            abortController.abort()
            abortController = null
        }
    }
    function abortPendingCommercial() {
        if (commercialAbortController) {
            commercialAbortController.abort()
            commercialAbortController = null
        }
    }

    const filtersActive = computed(() =>
        filterStatus.value || filterCategory.value || filterDateFrom.value || filterDateTo.value
    )

    const currentPageTickets = computed(() => {
        if (filtersActive.value) {
            if (fetchedAll.value) { // all unfiltered tickets are in memory
                return Object.values(tickets.value).flat().filter(filterTickets)
            }
            return filteredTickets.value[currentFilteredPage.value] || []
        }
        return tickets.value[currentPage.value] || []
    })

    async function fetchTickets() {
        // // everything is already in memory; filtering is done in the computed
        // if (fetchedAll.value && filtersActive.value) return

        // // page already cached
        // if (filtersActive.value) {
        //     if (filteredTickets.value[currentFilteredPage.value]) return
        // } else {
        //     if (tickets.value[currentPage.value]) return
        // }

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
                filteredTickets.value = { ...filteredTickets.value, [currentFilteredPage.value]: data.tickets }
            } else {
                currentPage.value = data.page
                totalPages.value = data.totalPages
                total.value = data.total
                tickets.value = { ...tickets.value, [currentPage.value]: data.tickets }
                fetched.value = true
                // mark fetchedAll once every unfiltered page is cached
                if (Object.keys(tickets.value).length === totalPages.value) {
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

    async function loadCommercialTickets(commercialId, loadMore = false) {
        abortPendingCommercial()
        commercialAbortController = new AbortController()
        const { signal } = commercialAbortController

        const page = loadMore ? commercialCurrentPage.value + 1 : 1

        if (loadMore) {
            // isLoadingMore.value = true
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
        // filters
        filterStatus.value = ''
        filterCategory.value = ''
        filterDateFrom.value = ''
        filterDateTo.value = ''
        // pagination
        currentFilteredPage.value = 1
        totalFilteredPages.value = 1
        totalFiltered.value = 0
        // tickets
        filteredTickets.value = {}
        // snap to last cached unfiltered page
        const cachedPages = Object.keys(tickets.value).map(Number)
        if (cachedPages.length) {
            currentPage.value = Math.max(...cachedPages)
        }
    }

    function filterTickets(t) {
        if (filterStatus.value && filterStatus.value !== t.status) return false
        if (filterCategory.value && filterCategory.value !== t.category) return false
        const date = String(t.created_at).slice(0, 10)
        if (filterDateFrom.value && date < filterDateFrom.value) return false
        if (filterDateTo.value && date > filterDateTo.value) return false
        return true
    }

    function buildQuery() {
        const params = new URLSearchParams()
        if (filterStatus.value) params.set('status', filterStatus.value)
        if (filterCategory.value) params.set('category', filterCategory.value)
        if (filterDateFrom.value) params.set('dateFrom', filterDateFrom.value)
        if (filterDateTo.value) params.set('dateTo', filterDateTo.value)
        params.set('page', filtersActive.value ? currentFilteredPage.value : currentPage.value)
        params.set('limit', PAGE_SIZE)
        return `?${params.toString()}`
    }

    return {
        tickets,
        filteredTickets,
        isLoading,
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
        currentPageTickets,
        fetchTickets,
        clearFilters,
        abortPending,
        abortPendingCommercial
    }
})