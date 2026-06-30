<script setup>
import { onMounted, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, Search } from '@lucide/vue'
import { usePaymentsStore } from '@/stores/payments'
import PaymentsTable from '@/components/payments/PaymentsTable.vue'

const store = usePaymentsStore()

const {
    isLoading,
    error,
    currentPagePayments,
    fetched,
    fetchedAll,
    filterLabel,
    currentPage,
    activeTotalPages,
} = storeToRefs(store)

const { fetchPayments, goToPage, clearFilter } = store

// Action error banner (shown when approve/reject/cancel fails)
const actionError = ref(null)

onMounted(() => {
    if (!fetched.value) fetchPayments()
})

// Debounced label search — wipe cache when filter changes (same as tickets pattern)
let debounceTimer = null
watch(filterLabel, () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        // Reset to page 1 and wipe page cache so fresh filtered results are fetched
        store.currentPage = 1
        store.payments = {}
        store.fetched = false
        if (!fetchedAll.value) fetchPayments()
    }, 350)
})

async function onApprove(payment) {
    actionError.value = null
    try {
        await store.approvePayment(payment)
    } catch (err) {
        actionError.value = err.message || 'Failed to approve payment'
    }
}

async function onReject(payment) {
    actionError.value = null
    try {
        await store.rejectPayment(payment)
    } catch (err) {
        actionError.value = err.message || 'Failed to reject payment'
    }
}

async function onCancel(payment) {
    actionError.value = null
    try {
        await store.cancelPayment(payment)
    } catch (err) {
        actionError.value = err.message || 'Failed to cancel payment'
    }
}
</script>

<template>
    <div class="payments-page">
        <div class="page-header">
            <h1>Payments</h1>
        </div>

        <div class="payments-options">
            <!-- Search filter -->
            <div class="filters">
                <div class="search-wrapper">
                    <Search size="15" class="search-icon" />
                    <input
                        type="text"
                        class="search-input"
                        placeholder="Search by label..."
                        v-model="filterLabel"
                    />
                    <button v-if="filterLabel" class="clear-search" @click="clearFilter">
                        <X size="14" />
                    </button>
                </div>
            </div>

            <!-- Paginator -->
            <div class="paginator">
                <button :disabled="currentPage <= 1" @click="goToPage(1)"><ChevronsLeft /></button>
                <button :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)"><ChevronLeft /></button>
                <span class="page">{{ currentPage }} of {{ activeTotalPages }}</span>
                <button :disabled="currentPage >= activeTotalPages" @click="goToPage(currentPage + 1)"><ChevronRight /></button>
                <button :disabled="currentPage >= activeTotalPages" @click="goToPage(activeTotalPages)"><ChevronsRight /></button>
            </div>
        </div>

        <!-- Action error banner -->
        <div v-if="actionError" class="action-error">
            <span>{{ actionError }}</span>
            <button @click="actionError = null"><X size="14" /></button>
        </div>

        <!-- Fetch error state -->
        <div v-if="error && !isLoading" class="error-state">
            <i class="bi bi-exclamation-triangle"></i>
            <p>{{ error }}</p>
            <button @click="fetchPayments">Try again</button>
        </div>

        <!-- Table -->
        <template v-else>
            <PaymentsTable
                :payments="currentPagePayments"
                :loading="isLoading"
                :skeleton-rows="8"
                @approve="onApprove"
                @reject="onReject"
                @cancel="onCancel"
            />
        </template>
    </div>
</template>

<style scoped>
.payments-page {
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
    }
}

/* ---- Options bar ---- */
.payments-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

/* ---- Search ---- */
.filters {
    display: flex;
    align-items: center;
    gap: 10px;
}

.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 10px;
    color: var(--text-muted);
    opacity: 0.5;
    pointer-events: none;
}

.search-input {
    padding: 7px 32px 7px 32px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text);
    font-size: 13px;
    font-family: inherit;
    width: 220px;
    transition: border-color 0.15s;

    &:focus {
        outline: none;
        border-color: var(--primary);
    }
}

.clear-search {
    position: absolute;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    opacity: 0.5;
    padding: 2px;
    border-radius: 4px;
    transition: opacity 0.15s;

    &:hover {
        opacity: 1;
    }
}

/* ---- Paginator ---- */
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
        white-space: nowrap;
        font-size: 13px;
    }

    button {
        background-color: var(--surface);
        border: 1.5px solid var(--border);
        border-radius: 8px;
        color: var(--text-muted);
        height: 35px;
        width: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:disabled {
            opacity: 0.35;
            cursor: not-allowed;
        }
    }
}

/* ---- Action error banner ---- */
.action-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    margin-bottom: 10px;
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 10px;
    color: #B91C1C;
    font-size: 13px;
    font-weight: 500;

    button {
        background: none;
        border: none;
        cursor: pointer;
        color: #B91C1C;
        display: flex;
        align-items: center;
        opacity: 0.7;
        transition: opacity 0.15s;

        &:hover { opacity: 1; }
    }
}

[data-theme="dark"] .action-error {
    background: rgba(239,68,68,0.1);
    border-color: #7F1D1D;
    color: #FCA5A5;

    button { color: #FCA5A5; }
}

/* ---- Fetch error state ---- */
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 12px;
    color: var(--text-muted);
    opacity: 0.6;

    i { font-size: 40px; }

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
</style>
