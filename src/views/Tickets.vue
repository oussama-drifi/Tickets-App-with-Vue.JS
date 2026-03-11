<script setup>
import { useTicketsStore } from '@/stores/tickets';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import TicketsTable from '@/components/tickets/TicketsTable.vue';

const store = useTicketsStore()
const { isLoading, error, tickets, sortedTickets, sortBy, sortDir, fetched } = storeToRefs(store)
const { fetchTickets, toggleSort } = store

function onStatusChange(ticket, status) {
    ticket.status = status
}

onMounted(() => {
    if (!fetched.value) fetchTickets()
})
</script>

<template>
    <div class="tickets-page">
        <div class="page-header">
            <h1>Tickets</h1>
            <span class="ticket-count" v-if="!isLoading">{{ tickets.length }} total</span>
        </div>

        <div class="filters">
            <!-- later -->
        </div>

        <!-- Error state -->
        <div v-if="error" class="error-state">
            <i class="bi bi-exclamation-triangle"></i>
            <p>{{ error }}</p>
            <button @click="fetchTickets">Try again</button>
        </div>

        <!-- Empty state -->
        <div v-else-if="!isLoading && !tickets.length" class="empty-state">
            <i class="bi bi-ticket-perforated"></i>
            <p>No tickets found</p>
        </div>

        <!-- Table (handles its own loading skeleton) -->
        <TicketsTable
            v-else
            :tickets="sortedTickets"
            :loading="isLoading"
            :sort-by="sortBy"
            :sort-dir="sortDir"
            @status-change="onStatusChange"
            @sort="toggleSort"
        />
    </div>
</template>

<style scoped>
.tickets-page {
    padding-right: 20px;
}

.page-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 20px;
}

.page-header h1 {
    color: var(--text);
    font-weight: 700;
}

.ticket-count {
    font-size: 14px;
    color: var(--text-muted);
    opacity: 0.6;
}

/* ---- Error / Empty ---- */
.error-state, .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 12px;
    color: var(--text-muted);
    opacity: 0.6;
}

.error-state i, .empty-state i {
    font-size: 40px;
}

.error-state button {
    margin-top: 8px;
    padding: 8px 20px;
    border-radius: 8px;
    border: none;
    background: var(--primary);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
}

@media (max-width: 768px) {
    .tickets-page {
        padding: 10px;
    }
}
</style>