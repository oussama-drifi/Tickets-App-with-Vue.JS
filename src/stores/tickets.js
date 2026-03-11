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

    function toggleSort(field) {
        if (sortBy.value === field) {
            sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortBy.value = field
            sortDir.value = 'asc'
        }
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

    return { tickets, isLoading, error, fetched, sortBy, sortDir, sortedTickets, selectedCommercialTickets, sortedCommercialTickets, toggleSort, fetchTickets, loadCommercialTickets }
})