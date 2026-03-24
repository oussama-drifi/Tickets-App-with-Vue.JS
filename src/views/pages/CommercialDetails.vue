<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCommercialsStore } from '@/stores/commercials'
import { useTicketsStore } from '@/stores/tickets'
import TicketsTable from '@/components/tickets/TicketsTable.vue'
import StatusFilter from '@/components/ui/StatusFilter.vue'
import CategoryFilter from '@/components/ui/CategoryFilter.vue'
import EditCommercialModal from '@/components/commercials/EditCommercialModal.vue'

const route = useRoute()
const commercialsStore = useCommercialsStore()
const ticketsStore = useTicketsStore()

const { isLoading, isLoadingMore, sortBy, sortDir, sortedCommercialTickets, commercialHasMore, filterStatus, filterCategory, filterDateFrom, filterDateTo } = storeToRefs(ticketsStore)
const { commercials } = storeToRefs(commercialsStore)

const editModalOpen = ref(false)

function onCommercialUpdated(updated) {
    const idx = commercials.value.findIndex(c => c.id === updated.id)
    if (idx !== -1) Object.assign(commercials.value[idx], updated)
    editModalOpen.value = false
}

const selectedId = computed(() => {
    return route.params.id ? Number(route.params.id) : null
})

const commercial = computed(() => {
    if (!selectedId.value) return null
    return commercials.value.find(c => c.id === selectedId.value) || null
})

const hasActiveFilters = computed(() => filterStatus.value || filterCategory.value || filterDateFrom.value || filterDateTo.value)

function onStatusChange(ticket, status) {
    ticket.status = status
}

onMounted(() => {
    if (!commercials.value.length) commercialsStore.fetchCommercials()
})

onUnmounted(() => {
    ticketsStore.clearFilters()
})

watch(selectedId, (id) => {
    if (!id) return
    ticketsStore.loadCommercialTickets(id)
}, { immediate: true })

watch([filterStatus, filterCategory, filterDateFrom, filterDateTo], () => {
    if (selectedId.value) ticketsStore.loadCommercialTickets(selectedId.value)
})

</script>

<template>
    <div v-if="!selectedId" class="select-prompt">
        <i class="bi bi-person-badge"></i>
        <h3>No commercial selected</h3>
        <p>Choose a commercial from the dropdown above to view their details & Tickets.</p>
    </div>

    <div v-else-if="commercial" class="commercial-details">
        <div class="profile-section">
            <img
                v-if="commercial.profileImagePath"
                :src="commercial.profileImagePath"
                alt="profile"
                class="profile-image"
                @error="$event.target.src = '/defaultProfile.png'"
            />
            <img v-else src="/defaultProfile.png" alt="profile" class="profile-image" />
            <div class="profile-info">
                <div class="name-row">
                    <h2>{{ commercial.name }}</h2>
                    <span class="status" :class="commercial.status"><i class="bi bi-activity"></i> {{ commercial.status }}</span>
                    <button class="edit-btn" @click="editModalOpen = true"><i class="bi bi-pencil-square"></i> Edit</button>
                </div>
                <span class="email"><i class="bi bi-envelope"></i> <b>Email:</b> {{ commercial.email }}</span>        
                <p><i class="bi bi-highlighter"></i> <b>Bio:</b> {{ commercial.bio || '_' }}</p>
            </div>
        </div>

        <div class="tickets-section">
            <h4>Tickets</h4>
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
                <button v-if="hasActiveFilters" class="clear-filters" @click="ticketsStore.clearFilters()">
                    <i class="bi bi-x-circle"></i> Clear
                </button>
            </div>
            <TicketsTable
                v-if="sortedCommercialTickets.length || isLoading"
                :tickets="sortedCommercialTickets"
                :loading="isLoading"
                :loading-more="isLoadingMore"
                :has-more="commercialHasMore"
                :sort-by="sortBy"
                :sort-dir="sortDir"
                @status-change="onStatusChange"
                @sort="ticketsStore.toggleSort"
                @load-more="ticketsStore.loadCommercialTickets(selectedId, true)"
            />
            <p v-else class="no-tickets">
                <i class="bi bi-ticket"></i>
                No tickets found for this commercial.
            </p>
        </div>

        <EditCommercialModal
            :open="editModalOpen"
            :commercial="commercial"
            @close="editModalOpen = false"
            @updated="onCommercialUpdated"
        />
    </div>

    <div v-else class="not-found">
        <i class="bi bi-exclamation-circle"></i>
        <h3>Not found</h3>
        <p>This commercial doesn't exist or may have been removed.</p>
    </div>
</template>

<style scoped>


.select-prompt, .not-found, .no-tickets {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 40px;
    padding: 48px 24px;
    border: 2px dashed var(--border);
    border-radius: 14px;
    background: var(--surface);
    gap: 8px;

    i {
        font-size: 40px;
        color: var(--primary);
        opacity: 0.6;
        margin-bottom: 4px;
    }
}

.select-prompt, .not-found {
    h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text);
    }
    p {
        font-size: 14px;
        color: var(--text-muted);
        opacity: 0.7;
        max-width: 320px;
        line-height: 1.5;
    }
}

.commercial-details {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;

    /* profile section */
    .profile-section {
        display: flex;
        align-items: center;

        .profile-image {
            width: 80px;
            height: 80px;
            border-radius: 15px;
            object-fit: cover;
            margin-right: 10px;
        }

        .profile-info {
            display: flex;
            flex-direction: column;

            .name-row {
                display: flex;
                align-items: center;
                gap: 10px;

                h2 {
                    font-size: 25px;
                    color: var(--text-muted);
                }
            }
            .email {
                color: var(--text-muted);
                font-size: 14px;
            }
            .status {
                font-size: 13px;
                font-weight: 600;
                text-transform: capitalize;
                white-space: nowrap;
                padding: 3px 6px;
                border-width: 1px;
                border-style: solid;
                border-radius: 4px;
            }
        }
    }


    /* tickets section */
    .tickets-section {
        margin-top: 28px;
        h4 {
            margin-bottom: 12px;
        }
    }
}

/* edit button */
.edit-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    transition: all 0.15s;
}

.edit-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
}

/* status states */
.suspended { color: #B91C1C; border-color: #FECACA; background: #FEF2F2; }
.active { color: #15803D; border-color: #BBF7D0; background: #d6ffe4; }
[data-theme="dark"] .suspended { color: #FCA5A5; border-color: #7F1D1D; background: rgba(239, 68, 68, 0.1); }
[data-theme="dark"] .active { color: #86EFAC; border-color: #14532D; background: rgba(34, 197, 94, 0.1); }

.no-tickets {
    color: var(--text-muted);
    font-size: 14px;
}

/* ---- Filters ---- */
.filters {
    display: flex;
    align-items: flex-end;
    gap: 14px;
    margin-bottom: 14px;
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
.not-found i {
    color: var(--danger);
}
</style>