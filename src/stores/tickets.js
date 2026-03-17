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

    const filteredTickets = computed(() => {
        let result = tickets.value
        if (filterStatus.value) {
            result = result.filter(t => t.status === filterStatus.value)
        }
        if (filterCategory.value) {
            result = result.filter(t => t.category === filterCategory.value)
        }
        if (filterDateFrom.value) {
            const from = new Date(filterDateFrom.value)
            result = result.filter(t => new Date(t.ticketDate) >= from)
        }
        if (filterDateTo.value) {
            const to = new Date(filterDateTo.value)
            to.setHours(23, 59, 59, 999)
            result = result.filter(t => new Date(t.ticketDate) <= to)
        }
        return result
    })

    const sortedTickets = computed(() => {
        const base = filteredTickets.value
        if (!sortBy.value) return base
        const dir = sortDir.value === 'asc' ? 1 : -1
        return [...base].sort((a, b) => {
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
            tickets.value = await adminApi.get('/tickets')
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
        if (fetched.value) {
            selectedCommercialTickets.value = tickets.value.filter(t => t.userId === commercialId)
            return
        }
        isLoading.value = true
        error.value = null
        try {
            selectedCommercialTickets.value = await adminApi.get(`/commercials/${commercialId}/tickets`)
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

    return { tickets, isLoading, error, fetched, sortBy, sortDir, filterStatus, filterCategory, filterDateFrom, filterDateTo, filteredTickets, sortedTickets, selectedCommercialTickets, sortedCommercialTickets, toggleSort, fetchTickets, loadCommercialTickets, clearFilters }
})