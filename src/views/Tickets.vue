<script setup>
import { useTicketsStore } from '@/stores/tickets';
import { storeToRefs } from 'pinia';
import { onMounted, computed } from 'vue';
import TicketsTable from '@/components/tickets/TicketsTable.vue';

const store = useTicketsStore()
const { isLoading, error, tickets, sortedTickets, sortBy, sortDir, fetched, filterStatus, filterCategory, filterDateFrom, filterDateTo } = storeToRefs(store)
const { fetchTickets, toggleSort, clearFilters } = store

const hasActiveFilters = computed(() => filterStatus.value || filterCategory.value || filterDateFrom.value || filterDateTo.value)

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
            <span class="ticket-count" v-if="!isLoading">
                {{ sortedTickets.length }}<template v-if="hasActiveFilters"> / {{ tickets.length }}</template> total
            </span>
        </div>

        <div class="filters">
            <div class="filter-group">
                <label>Status</label>
                <select v-model="filterStatus">
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="paid">Paid</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Category</label>
                <select v-model="filterCategory">
                    <option value="">All categories</option>
                    <option value="transport">Transport</option>
                    <option value="food">Food</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="filter-group">
                <label>From</label>
                <input type="date" v-model="filterDateFrom" />
            </div>
            <div class="filter-group">
                <label>To</label>
                <input type="date" v-model="filterDateTo" />
            </div>
            <button v-if="hasActiveFilters" class="clear-filters" @click="clearFilters">
                <i class="bi bi-x-circle"></i> Clear
            </button>
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

/* ---- Filters ---- */
.filters {
    display: flex;
    align-items: flex-end;
    gap: 14px;
    margin-bottom: 18px;
    flex-wrap: wrap;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.filter-group label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    opacity: 0.6;
}

.filter-group select,
.filter-group input[type="date"] {
    padding: 7px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text);
    font-size: 13px;
    font-family: inherit;
    min-width: 150px;
    transition: border-color 0.15s;
}

.filter-group select:focus,
.filter-group input[type="date"]:focus {
    outline: none;
    border-color: var(--primary);
}

.clear-filters {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text-muted);
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
}

.clear-filters:hover {
    border-color: var(--danger);
    color: var(--danger);
}

@media (max-width: 768px) {
    .tickets-page {
        padding: 10px;
    }

    .filters {
        gap: 10px;
    }

    .filter-group select,
    .filter-group input[type="date"] {
        min-width: 120px;
    }
}
</style>