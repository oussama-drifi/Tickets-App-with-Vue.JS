<script setup>
import { onMounted } from 'vue'
import { useCommercialsStore } from '@/stores/commercials'
import { storeToRefs } from 'pinia'
// import CommercialCard from '@/components/commercials/CommercialCard.vue'
// import CommercialsSkeleton from '@/components/commercials/CommercialsSkeleton.vue'
import CommercialsTable from '@/components/commercials/CommercialsTable.vue'

const commercialsStore = useCommercialsStore()

const { fetchCommercials } = commercialsStore
const {isLoading, commercials, error, fetched} = storeToRefs(commercialsStore)

onMounted(() => {
    if (!fetched.value) {
        fetchCommercials()
    }
})

</script>

<template>
    <!-- <CommercialsSkeleton v-if="isLoading" />
    <div v-else class="commercials">
        <CommercialCard
            v-for="commercial in commercials"
            :key="commercial.id"
            :commercialId="commercial.id"
            :name="commercial.name"
            :email="commercial.email"
            :bio="commercial.bio"
            :status="commercial.status"
            :image="commercial.profileImagePath"
        />
    </div> -->
    <CommercialsTable
        :commercials="commercials"
        :loading="isLoading"
    />
    <div v-if="error" class="error-message">
        sorry! there has been an issue fetching the Data from server
    </div>
</template>

<style scoped>
/* .commercials {
    margin-top: 15px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
}

@media (max-width: 768px) {
    .commercials {
        grid-template-columns: 1fr;
    }
} */

.search-input {
    background-color: var(--surface);
    border: 2px solid var(--border);
    border-radius: 6px;
    padding: 10px;
    outline: none;
    color: var(--text-muted);
    &:focus {
        border-color: var(--primary);
    }
}
</style>