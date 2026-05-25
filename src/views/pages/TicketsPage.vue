<script setup>
import { useTicketsStore } from '@/stores/tickets';
import { storeToRefs } from 'pinia';
import { onMounted, watch } from 'vue';
import { useSorting } from '@/composables/useSorting';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from '@lucide/vue';
// components
import TicketsTable from '@/components/tickets/TicketsTable.vue';
import StatusFilter from '@/components/ui/StatusFilter.vue';
import CategoryFilter from '@/components/ui/CategoryFilter.vue';

const store = useTicketsStore()

const { isLoading,
        error,
        currentPageTickets,
        fetched,
        fetchedAll,
        filterStatus,
        filterCategory,
        filterDateFrom,
        filterDateTo,
        filtersActive,
        } = storeToRefs(store);

const { fetchTickets, clearFilters } = store
const { sortBy, sortDir, toggleSort, sortedItems: sortedTickets } = useSorting(currentPageTickets)

function onStatusChange(ticket, status) {
    ticket.status = status
}

let skipNextWatch = false
onMounted(() => {
    const hadFilters = !!(filterStatus.value || filterCategory.value || filterDateFrom.value || filterDateTo.value)
    if (hadFilters) skipNextWatch = true
    clearFilters()
    if (!fetched.value) fetchTickets()
})

watch([filterStatus, filterCategory, filterDateFrom, filterDateTo], () => {
    if (skipNextWatch) {
        skipNextWatch = false
        return
    }
    if (filtersActive.value && !fetchedAll.value) {
        fetchTickets()
    }
    // if fetchedAll: in-memory filter via computed, no fetch
    // if filters cleared: clearFilters() already snapped currentPage
})

</script>

<template>
    <div class="tickets-page">
        <div class="page-header">
            <h1>Tickets</h1>
            <!-- <span class="ticket-count" v-if="!isLoading">
                {{ tickets.length }}<template v-if="hasActiveFilters"> / {{ total }}</template> total
            </span> -->
        </div>

        <div class="tickets-options">
            <div class="filters">
                <div class="filter-group">
                    <label>Status</label>
                    <StatusFilter v-model="filterStatus" />
                </div>
                <div class="filter-group">
                    <label>Category</label>
                    <CategoryFilter v-model="filterCategory" />
                </div>
                <div class="filter-group">
                    <label>From</label>
                    <input type="date" v-model="filterDateFrom" />
                </div>
                <div class="filter-group">
                    <label>To</label>
                    <input type="date" v-model="filterDateTo" />
                </div>
                <button v-if="filtersActive" class="clear-filters" @click="clearFilters">
                    <X size="15"/> Clear
                </button>
            </div>
            <div class="paginator">
                <button class="double-previous-btn"><ChevronsLeft /></button>
                <button class="previous-btn"><ChevronLeft /></button>
                <span class="page">page: 3 of 7</span>
                <button class="next-btn"><ChevronRight /></button>
                <button class="double-next-btn"><ChevronsRight /></button>
            </div>
        </div>

        <!-- Error state -->
        <div v-if="error" class="error-state">
            <i class="bi bi-exclamation-triangle"></i>
            <p>{{ error }}</p>
            <button @click="fetchTickets">Try again</button>
        </div>

        <!-- Table (handles its own loading skeleton) -->
        <template v-else>
            <TicketsTable
                :tickets="sortedTickets"
                :loading="isLoading"
                :sort-by="sortBy"
                :sort-dir="sortDir"
                :skeletonRows="7"
                @status-change="onStatusChange"
                @sort="toggleSort"
            />
        </template>
    </div>
</template>

<style scoped>

.tickets-page {
    padding-right: 20px;

    .page-header {
        display: flex;
        align-items: baseline;
        gap: 12px;
        margin-bottom: 20px;

        h1 {
            color: var(--text);
            font-weight: 700;
        }

        .ticket-count {
            font-size: 14px;
            color: var(--text-muted);
            opacity: 0.6;
        }
    }
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

    i {
        font-size: 40px;
    }

    button {
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
}

.tickets-options {

    display: flex;
    justify-content: space-between;
    align-items: end;
    margin-bottom: 10px;

    /* filters */
    .filters {
        display: flex;
        align-items: flex-end;
        gap: 10px;
        flex: 1;
        padding-right: 5px;
        
        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex: 1;
            min-width: 0;
    
            label {
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-muted);
                opacity: 0.6;
            }
    
            input[type="date"] {
                padding: 6px 12px;
                border: 1px solid var(--border);
                border-radius: 8px;
                background: var(--surface);
                color: var(--text);
                font-size: 13px;
                font-family: inherit;
                min-width: 150px;
                width: 100%;
                display: inline-block;
                transition: border-color 0.15s;
    
                &:focus {
                    outline: none;
                    border-color: var(--primary);
                }
            }
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
    
            &:hover {
                border-color: var(--danger);
                color: var(--danger);
            }
        }
    }

    /* paginator */
    .paginator {
        display: flex;
        gap: 2px;
    
        .page {
            color: var(--text-muted);
            margin: 0 3px;
            background-color: var(--surface);
            border: 1.5px solid var(--border);
            border-radius: 8px;
            padding: 0 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 35px;
        }
        
        
        button {
            background-color: var(--surface);
            border: none;
            border: 1.5px solid var(--border);
            border-radius: 8px;
            color: var(--text-muted);
            height: 35px;
            width: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
    }
}


@media (max-width: 768px) {
    .tickets-page {
        padding: 10px;
    }

    .filters {
        gap: 10px;
    }

    .filter-group input[type="date"] {
        min-width: 120px;
    }
}
</style>