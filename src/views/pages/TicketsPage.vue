<script setup>
import { useTicketsStore } from '@/stores/tickets';
import { storeToRefs } from 'pinia';
import { onMounted, computed, watch } from 'vue';
import { useSorting } from '@/composables/useSorting';
import { ChevronLeft, ChevronRight } from '@lucide/vue';
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
        currentPage,
        totalPages,
        currentFilteredPage,
        totalFilteredPages,
        } = storeToRefs(store);

const { fetchTickets, clearFilters, goToPage, applyNewFilters } = store
const { sortBy, sortDir, toggleSort, sortedItems: sortedTickets } = useSorting(currentPageTickets)

const pageCount = computed(() => {
    // when filtered + everything cached, we dump all matches with no pager
    if (filtersActive.value && fetchedAll.value) return 1
    return filtersActive.value ? totalFilteredPages.value : totalPages.value
})
const activePage = computed(() => filtersActive.value ? currentFilteredPage.value : currentPage.value)

// active is leftmost; last page anchors the right; ellipsis only when there's a gap
const pageItems = computed(() => {
    const last = pageCount.value
    const cur = activePage.value
    if (last <= 1) return []
    const items = [cur]
    if (cur + 1 <= last) items.push(cur + 1)
    if (cur + 2 < last) items.push('...')
    if (cur + 1 < last) items.push(last)
    return items
})

function onStatusChange(ticket, status) {
    ticket.status = status
}

function goPrev() {
    if (activePage.value > 1) goToPage(activePage.value - 1)
}
function goNext() {
    if (activePage.value < pageCount.value) goToPage(activePage.value + 1)
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
        applyNewFilters()
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
                <i class="bi bi-x-circle"></i> Clear
            </button>
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

            <div v-if="pageCount > 1" class="pager">
                <button
                    class="page-btn page-arrow"
                    :disabled="isLoading || activePage === 1"
                    @click="goPrev"
                    aria-label="Previous page"
                >
                    <ChevronLeft :size="16" />
                </button>
                <template v-for="(item, i) in pageItems" :key="i">
                    <span v-if="item === '...'" class="page-ellipsis">…</span>
                    <button
                        v-else
                        class="page-btn"
                        :class="{ active: item === activePage }"
                        :disabled="isLoading"
                        @click="goToPage(item)"
                    >{{ item }}</button>
                </template>
                <button
                    class="page-btn page-arrow"
                    :disabled="isLoading || activePage === pageCount"
                    @click="goNext"
                    aria-label="Next page"
                >
                    <ChevronRight :size="16" />
                </button>
            </div>
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

/* ---- Filters ---- */
.filters {
    display: flex;
    align-items: flex-end;
    gap: 14px;
    margin-bottom: 18px;
    flex-wrap: wrap;
    
    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 4px;

        label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted);
            opacity: 0.6;
        }

        input[type="date"] {
            padding: 7px 12px;
            border: 1px solid var(--border);
            border-radius: 8px;
            background: var(--surface);
            color: var(--text);
            font-size: 13px;
            font-family: inherit;
            min-width: 150px;
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

/* ---- Pager ---- */
.pager {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 18px;
}

.page-btn {
    min-width: 36px;
    height: 36px;
    padding: 0 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
}

.page-btn:hover:not(:disabled) {
    border-color: var(--primary);
    color: var(--primary);
}

.page-btn.active {
    background: var(--primary);
    border-color: var(--primary);
    color: #fff;
}

.page-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.page-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.page-arrow:disabled {
    opacity: 0.35;
}

.page-arrow:hover:not(:disabled) {
    border-color: var(--primary);
    color: var(--primary);
}

.page-ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 36px;
    color: var(--text-muted);
    opacity: 0.5;
    font-size: 14px;
    user-select: none;
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