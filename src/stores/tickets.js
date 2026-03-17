import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/services/api'


export const useTicketsStore = defineStore('tickets', () => {
    const tickets = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const sortBy = ref(null)    // 'amount' | 'date'
    const sortDir = ref('asc')  // 'asc' | 'desc'
    const fetched = ref(false)

    // Filters
    const filterStatus = ref('')
    const filterCategory = ref('')
    const filterDateFrom = ref('')
    const filterDateTo = ref('')

    function toggleSort(field) {
        if (sortBy.value === field) {
            sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortBy.value = field
            sortDir.value = 'asc'
        }
    }

    function buildQuery() {
        const params = new URLSearchParams()
        if (filterStatus.value) params.set('status', filterStatus.value)
        if (filterCategory.value) params.set('category', filterCategory.value)
        if (filterDateFrom.value) params.set('dateFrom', filterDateFrom.value)
        if (filterDateTo.value) params.set('dateTo', filterDateTo.value)
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


    async function fetchTickets() {
        isLoading.value = true
        error.value = null
        try {
            tickets.value = await adminApi.get(`/tickets${buildQuery()}`)
            fetched.value = true
        } catch (err) {
            error.value = err.message
        } finally {
            isLoading.value = false
        }
    }

    const selectedCommercialTickets = ref([])

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

    async function loadCommercialTickets(commercialId) {
        isLoading.value = true
        error.value = null
        try {
            selectedCommercialTickets.value = await adminApi.get(`/commercials/${commercialId}/tickets${buildQuery()}`)
        } catch (err) {
            error.value = err.message
            selectedCommercialTickets.value = []
        } finally {
            isLoading.value = false
        }
    }

    function clearFilters() {
        filterStatus.value = ''
        filterCategory.value = ''
        filterDateFrom.value = ''
        filterDateTo.value = ''
    }

    return { tickets, isLoading, error, fetched, sortBy, sortDir, filterStatus, filterCategory, filterDateFrom, filterDateTo, sortedTickets, selectedCommercialTickets, sortedCommercialTickets, toggleSort, fetchTickets, loadCommercialTickets, clearFilters }
})