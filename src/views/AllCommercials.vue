<script setup>
import { onMounted, ref } from 'vue'
import { useCommercialsStore } from '@/stores/commercials'
import { storeToRefs } from 'pinia'
import Commercial from '@/components/common/Commercial.vue'
import CommercialsSkeleton from './CommercialsSkeleton.vue'

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
        <Commercial 
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
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

</style>