import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/services/api'


export const useTicketsStore = defineStore('tickets', () => {
    const tickets = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const sortBy = ref(null)    // 'amount' | 'date'
    const sortDir = ref('asc')  // 'asc' | 'desc'

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
        } catch (err) {
            error.value = err.message
        } finally {
            isLoading.value = false
        }
    }
    
    function ticketsForCommercial(commercialId) {
        return computed(() => tickets.value.filter(t => t.userId === commercialId))
    }

    async function fetchTicketsForCommercial(commercialId) {
        isLoading.value = true
        error.value = null
        try {
            const data = await adminApi.get(`/commercials/${commercialId}/tickets`)
            // Merge fetched tickets into the store without duplicates
            const existingIds = new Set(tickets.value.map(t => t.id))
            const newTickets = data.filter(t => !existingIds.has(t.id))
            if (newTickets.length) {
                tickets.value = [...tickets.value, ...newTickets]
            }
        } catch (err) {
            error.value = err.message
        } finally {
            isLoading.value = false
        }
    }

    return {tickets, isLoading, error, sortBy, sortDir, sortedTickets, toggleSort, fetchTickets, fetchTicketsForCommercial, ticketsForCommercial}
})