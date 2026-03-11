<script setup>
import { onMounted, ref, computed } from 'vue'
import { commercialApi } from '@/services/api'
import TicketsTable from '@/components/tickets/TicketsTable.vue'

const tickets = ref([])
const loading = ref(false)
const sortBy = ref(null)
const sortDir = ref('asc')

const sortedTickets = computed(() => {
    if (!sortBy.value) return tickets.value
    return [...tickets.value].sort((a, b) => {
        let valA = a[sortBy.value]
        let valB = b[sortBy.value]
        if (sortBy.value === 'date') {
            valA = new Date(a.ticketDate)
            valB = new Date(b.ticketDate)
        }
        if (valA < valB) return sortDir.value === 'asc' ? -1 : 1
        if (valA > valB) return sortDir.value === 'asc' ? 1 : -1
        return 0
    })
})

function toggleSort(field) {
    if (sortBy.value === field) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortBy.value = field
        sortDir.value = 'asc'
    }
}

async function fetchTickets() {
    loading.value = true
    try {
        const data = await commercialApi.get('/tickets')
        tickets.value = data
    } catch {
        tickets.value = []
    } finally {
        loading.value = false
    }
}

onMounted(() => fetchTickets())
</script>

<template>
    <div class="commercial-tickets">
        <h2>My Tickets</h2>
        <TicketsTable
            v-if="sortedTickets.length || loading"
            :tickets="sortedTickets"
            :loading="loading"
            :sort-by="sortBy"
            :sort-dir="sortDir"
            :api="commercialApi"
            :readonly="true"
            @sort="toggleSort"
        />
        <div v-else class="empty-state">
            <i class="bi bi-ticket-perforated"></i>
            <p>No tickets yet.</p>
        </div>
    </div>
</template>

<style scoped>
.commercial-tickets {
    padding: 0;
}

.commercial-tickets h2 {
    font-size: 20px;
    color: var(--text);
    margin-bottom: 16px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    border: 2px dashed var(--border);
    border-radius: 14px;
    background: var(--surface);
    gap: 8px;
    color: var(--text-muted);
    opacity: 0.6;
}

.empty-state i {
    font-size: 36px;
}

.empty-state p {
    font-size: 14px;
}
</style>
