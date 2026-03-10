<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCommercialsStore } from '@/stores/commercials'
import { storeToRefs } from 'pinia'

const route = useRoute()
const commercialsStore = useCommercialsStore()
const { commercials } = storeToRefs(commercialsStore)

const selectedId = computed(() => {
    return route.params.id ? Number(route.params.id) : null
})

const commercial = computed(() => {
    if (!selectedId.value) return null
    return commercials.value.find(c => c.id === selectedId.value) || null
})
</script>

<template>
    <div v-if="!selectedId" class="select-prompt">
        <p>Please select a commercial from the dropdown above.</p>
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
    </div>

    <div v-else class="not-found">
        <p>Commercial not found.</p>
    </div>
</template>

<style scoped>
.select-prompt {
    margin-top: 20px;
    color: var(--text-muted);
}

.commercial-details {
    margin-top: 20px;
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

.not-found {
    margin-top: 20px;
    color: var(--text-muted);
}
</style>
