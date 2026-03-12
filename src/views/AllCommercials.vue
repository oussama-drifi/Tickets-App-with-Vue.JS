<script setup>
import { onMounted } from 'vue'
import { useCommercialsStore } from '@/stores/commercials'
import { storeToRefs } from 'pinia'
import CommercialCard from '@/components/commercials/CommercialCard.vue'
import CommercialsSkeleton from '@/components/commercials/CommercialsSkeleton.vue'

const commercialsStore = useCommercialsStore()

const { fetchCommercials } = commercialsStore
const {isLoading, commercials, error} = storeToRefs(commercialsStore)

onMounted(() => {
    if (!commercials.value.length) {
        fetchCommercials()
    }
})

</script>

<template>
    <div class="filters">
        <!-- later -->
    </div>
    <CommercialsSkeleton v-if="isLoading" />
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
    </div>
    <div v-if="error" class="error-message">
        sorry! there has been an issue fetching the Data from server
    </div>
</template>

<style scoped>
.commercials {
    margin-top: 15px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
}

@media (max-width: 768px) {
    .commercials {
        grid-template-columns: 1fr;
    }
}
</style>