<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCommercialsStore } from '@/stores/commercials'
import { useTicketsStore } from '@/stores/tickets'
import { storeToRefs } from 'pinia'
import TicketsTable from '@/components/tickets/TicketsTable.vue'

const route = useRoute()

const commercialsStore = useCommercialsStore()
const ticketsStore = useTicketsStore()

const { commercials } = storeToRefs(commercialsStore)
const { isLoading, sortBy, sortDir } = storeToRefs(ticketsStore)

const selectedId = computed(() => {
    return route.params.id ? Number(route.params.id) : null
})

const commercial = computed(() => {
    if (!selectedId.value) return null
    return commercials.value.find(c => c.id === selectedId.value) || null
})

const commercialTickets = computed(() => {
    if (!selectedId.value) return []
    return ticketsStore.ticketsForCommercial(selectedId.value).value
})

function onStatusChange(ticket, status) {
    ticket.status = status
}

watch(selectedId, (id) => {
    if (id && commercialTickets.value.length === 0) {
        ticketsStore.fetchTicketsForCommercial(id)
    }
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
                :src="`http://localhost:8000/${commercial.profileImagePath}`"
                alt="profile"
                class="profile-image"
            />
            <img v-else src="/defaultProfile.png" alt="profile" class="profile-image" />
            <div class="profile-info">
                <h2>{{ commercial.name }}</h2>
                <span class="email">{{ commercial.email }}</span>
                <span class="status" :class="commercial.status">{{ commercial.status }}</span>
            </div>
        </div>
        <div class="bio-section">
            <h4>Bio</h4>
            <p>{{ commercial.bio || 'No bio available' }}</p>
        </div>

        <div class="tickets-section">
            <h4>Tickets</h4>
            <TicketsTable
                v-if="commercialTickets.length || isLoading"
                :tickets="commercialTickets"
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
}

.select-prompt i, .not-found i {
    font-size: 40px;
    color: var(--primary);
    opacity: 0.6;
    margin-bottom: 4px;
}

.select-prompt h3, .not-found h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
}

.select-prompt p, .not-found p {
    font-size: 14px;
    color: var(--text-muted);
    opacity: 0.7;
    max-width: 320px;
    line-height: 1.5;
}

.commercial-details {
    margin-top: 20px;
    background-color: red;
    width: 40%;
}

.profile-section {
    display: flex;
    align-items: center;
    gap: 20px;
}

.profile-image {
    width: 100px;
    height: 100px;
    border-radius: 15px;
    object-fit: cover;
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.email {
    color: var(--text-muted);
    font-size: 14px;
}

.status {
    font-size: 13px;
    font-weight: 600;
    text-transform: capitalize;
}

.bio-section {
    margin-top: 20px;
}

.bio-section p {
    color: #555;
    line-height: 1.6;
}

.tickets-section {
    margin-top: 28px;
}

.tickets-section h4 {
    margin-bottom: 12px;
}

.no-tickets {
    color: var(--text-muted);
    font-size: 14px;
}

.not-found i {
    color: var(--danger);
}
</style>
