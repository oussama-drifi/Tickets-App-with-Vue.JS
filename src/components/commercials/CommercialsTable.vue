<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCommercialsStore } from '@/stores/commercials'
import { storeToRefs } from 'pinia'
import CustomSelect from '@/components/ui/CustomSelect.vue'

const commercialsStore = useCommercialsStore()
const router = useRouter()

const { fetchCommercials } = commercialsStore
const { filteredCommercials,
        isLoading, 
        isLoadingMore, 
        hasMore,
        fetched, 
        fetchedAll,
        filterSearch, 
        filterStatus 
    } = storeToRefs(commercialsStore)

const statusOptions = [
    { value: 'all', label: 'all' },
    { value: 'active', label: 'active' },
    { value: 'suspended', label: 'suspended' },
]

// debounced search
let debounceTimer = null
watch([filterSearch, filterStatus], () => {
    if (fetchedAll.value) return
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => fetchCommercials(), 300)
})

onMounted(() => {
    if (!fetched.value) fetchCommercials()
})

</script>

<template>
    <!-- Skeleton -->
    <div v-if="isLoading" class="table-wrapper">
        <table class="commercials-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Tickets</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in 8" :key="i" class="skeleton-row">
                    <td>
                        <div class="name-cell">
                            <div class="skeleton skeleton-avatar"></div>
                            <div class="skeleton skeleton-text"></div>
                        </div>
                    </td>
                    <td><div class="skeleton skeleton-email"></div></td>
                    <td><div class="skeleton skeleton-badge"></div></td>
                    <td><div class="skeleton skeleton-short"></div></td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Data -->
    <div v-else>
        <div class="filters">
            <input
                class="search-input"
                type="text"
                placeholder="Search for commercial"
                v-model="filterSearch"
            />
            <CustomSelect
                v-model="filterStatus"
                :options="statusOptions"
                placeholder="Filter by status"
            />
        </div>

        <div class="table-wrapper">
            <table class="commercials-table">
                <thead>
                    <tr>
                        <th>Commercial</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Tickets</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="commercial in filteredCommercials"
                        :key="commercial.id"
                        class="clickable-row"
                        @click="router.push({ name: 'commercial-details', params: { id: commercial.id } })"
                    >
                        <td>
                            <div class="name-cell">
                                <img
                                    v-if="commercial.profileImagePath"
                                    :src="commercial.profileImagePath"
                                    alt="profile"
                                    class="profile-img"
                                    @error="$event.target.src = '/defaultProfile.png'"
                                >
                                <img
                                    v-else
                                    src="/defaultProfile.png"
                                    alt="profile"
                                    class="profile-img"
                                >
                                <span class="commercial-name">{{ commercial.name }}</span>
                            </div>
                        </td>
                        <td>
                            <span class="commercial-email"><i class="bi bi-envelope"></i> {{ commercial.email }}</span>
                        </td>
                        <td>
                            <span class="status-badge" :class="commercial.status">
                                <i class="bi bi-activity"></i>
                                {{ commercial.status }}
                            </span>
                        </td>
                        <td>
                            <span class="ticket-count"><i class="bi bi-ticket"></i> {{ commercial.ticketsCount ?? 0 }}</span>
                        </td>
                    </tr>
                    <!-- Loading more skeletons -->
                    <tr v-if="isLoadingMore" v-for="i in 5" :key="'skeleton-' + i" class="skeleton-row">
                        <td>
                            <div class="name-cell">
                                <div class="skeleton skeleton-avatar"></div>
                                <div class="skeleton skeleton-text"></div>
                            </div>
                        </td>
                        <td><div class="skeleton skeleton-email"></div></td>
                        <td><div class="skeleton skeleton-badge"></div></td>
                        <td><div class="skeleton skeleton-short"></div></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Show more button -->
        <button v-if="hasMore && !isLoadingMore" class="show-more-btn" @click="fetchCommercials(true)">
            Show more
        </button>
    </div>
</template>

<style scoped>
.filters {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 14px;
    margin-bottom: 14px;
    width: fit-content;
}

.search-input {
    background-color: var(--surface);
    border: 2px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    outline: none;
    color: var(--text);
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.2s;
}

.search-input:focus {
    border-color: var(--primary);
}

.filters :deep(.custom-select) {
    width: 180px;
}

.table-wrapper {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    max-height: 85vh;
    overflow-y: auto;
    overflow-x: auto;
    margin-top: 15px;
}

.table-wrapper > table thead tr:first-child th:first-child {
    border-top-left-radius: 14px;
}
.table-wrapper > table thead tr:first-child th:last-child {
    border-top-right-radius: 14px;
}
.table-wrapper > table tbody tr:last-child td:first-child {
    border-bottom-left-radius: 14px;
}
.table-wrapper > table tbody tr:last-child td:last-child {
    border-bottom-right-radius: 14px;
}

.commercials-table {
    width: 100%;
    border-collapse: collapse;
}

.commercials-table thead {
    background: var(--bg);
    position: sticky;
    top: 0;
    z-index: 10;
}

.commercials-table th {
    padding: 14px 18px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    opacity: 0.6;
    text-align: left;
    white-space: nowrap;
}

.commercials-table td {
    padding: 14px 18px;
    font-size: 14px;
    color: var(--text);
    border-top: 1px solid var(--border);
    vertical-align: middle;
    white-space: nowrap;
}

.commercials-table tbody tr {
    transition: background 0.15s;
}

.clickable-row {
    cursor: pointer;
}

.clickable-row:hover {
    background: var(--bg);
}

/* Name cell */
.name-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.profile-img {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    object-fit: cover;
    flex-shrink: 0;
}

.commercial-name {
    font-weight: 500;
    text-transform: lowercase;
    overflow: hidden;
    text-overflow: ellipsis;
}

.commercial-email {
    color: var(--text-muted);
    font-size: 13px;
}

/* Status */
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
    font-size: 13px;
    font-weight: 500;
    text-transform: capitalize;
    white-space: nowrap;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.active .status-dot { background: var(--success); }
.suspended .status-dot { background: var(--danger); }

.active.status-badge { color: #15803D; border-color: #BBF7D0; background: #F0FDF4; }
.suspended.status-badge { color: #B91C1C; border-color: #FECACA; background: #FEF2F2; }

[data-theme="dark"] .active.status-badge { color: #86EFAC; border-color: #14532D; background: rgba(34, 197, 94, 0.1); }
[data-theme="dark"] .suspended.status-badge { color: #FCA5A5; border-color: #7F1D1D; background: rgba(239, 68, 68, 0.1); }

/* Ticket count */
.ticket-count {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

/* Skeleton */
.skeleton {
    border-radius: 6px;
    background: var(--skeleton-gradient);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.skeleton-avatar { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; }
.skeleton-text { width: 120px; height: 18px; }
.skeleton-email { width: 180px; height: 18px; }
.skeleton-badge { width: 90px; height: 34px; border-radius: 8px; }
.skeleton-short { width: 40px; height: 18px; }

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.skeleton-row td {
    border-top: 1px solid var(--border);
}

/* Show more */
.show-more-btn {
    display: block;
    margin: 18px auto 0;
    padding: 10px 32px;
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-size: 14px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
}

.show-more-btn:hover {
    border-color: var(--primary);
    background: var(--bg);
}

/* Responsive */
@media (max-width: 768px) {
    .table-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    .commercials-table {
        min-width: 500px;
    }
    .commercials-table th,
    .commercials-table td {
        padding: 12px 14px;
    }
}
</style>