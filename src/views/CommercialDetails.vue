<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCommercialsStore } from '@/stores/commercials'
import { useTicketsStore } from '@/stores/tickets'
import TicketsTable from '@/components/tickets/TicketsTable.vue'

const route = useRoute()
const commercialsStore = useCommercialsStore()
const ticketsStore = useTicketsStore()

const { isLoading, sortBy, sortDir, sortedCommercialTickets } = storeToRefs(ticketsStore)
const { commercials } = storeToRefs(commercialsStore)

const selectedId = computed(() => {
    return route.params.id ? Number(route.params.id) : null
})

const commercial = computed(() => {
    if (!selectedId.value) return null
    return commercials.value.find(c => c.id === selectedId.value) || null
})

function onStatusChange(ticket, status) {
    ticket.status = status
}

onMounted(() => {
    if (!commercials.value.length) commercialsStore.fetchCommercials()
})

watch(selectedId, (id) => {
    if (!id) return
    ticketsStore.loadCommercialTickets(id)
}, { immediate: true })

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
                :src="`${import.meta.env.VITE_API_URL}/${commercial.profileImagePath}`"
                alt="profile"
                class="profile-image"
            />
            <img v-else src="/defaultProfile.png" alt="profile" class="profile-image" />
            <div class="profile-info">
                <h2>{{ commercial.name }} <span class="status" :class="commercial.status"><i class="bi bi-activity"></i> {{ commercial.status }}</span> </h2>
                <span class="email"><i class="bi bi-envelope"></i> <b>Email:</b> {{ commercial.email }}</span>        
                <p><i class="bi bi-highlighter"></i> <b>Bio:</b> {{ commercial.bio || '_' }}</p>
            </div>
        </div>

        <div class="tickets-section">
            <h4>Tickets</h4>
            <TicketsTable
                v-if="sortedCommercialTickets.length || isLoading"
                :tickets="sortedCommercialTickets"
                :loading="isLoading"
                :sort-by="sortBy"
                :sort-dir="sortDir"
                @status-change="onStatusChange"
                @sort="ticketsStore.toggleSort"
            />
            <p v-else class="no-tickets">No tickets found for this commercial.</p>
        </div>
    </div>

    <div v-else class="not-found">
        <i class="bi bi-exclamation-circle"></i>
        <h3>Not found</h3>
        <p>This commercial doesn't exist or may have been removed.</p>
    </div>
</template>

<style scoped>


.select-prompt, .not-found {
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

            h2 {
                font-size: 25px;
                color: var(--text-muted);
                position: relative;
                width: fit-content;
            }
            .email {
                color: var(--text-muted);
                font-size: 14px;
            }
            .status {
                font-size: 13px;
                font-weight: 600;
                text-transform: capitalize;
                width: fit-content;
                padding: 3px;
                border-radius: 4px;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translate(calc(100% + 15px), -50%);
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

/* status states */
.suspended { color: #B91C1C; border-color: #FECACA; background: #FEF2F2; }
.active { color: #15803D; border-color: #BBF7D0; background: #d6ffe4; }
[data-theme="dark"] .suspended { color: #FCA5A5; border-color: #7F1D1D; background: rgba(239, 68, 68, 0.1); }
[data-theme="dark"] .active { color: #86EFAC; border-color: #14532D; background: rgba(34, 197, 94, 0.1); }

.no-tickets {
    color: var(--text-muted);
    font-size: 14px;
}
.not-found i {
    color: var(--danger);
}
</style>