<script setup>
import CommercialsTable from '@/components/commercials/CommercialsTable.vue'
import { useCommercialsStore } from '@/stores/commercials';
import { storeToRefs } from 'pinia';

const {error} = storeToRefs(useCommercialsStore())


</script>

<template>
    <CommercialsTable/>
    <div v-if="error" class="error-message">
        sorry! there has been an issue fetching the Data from server
    </div>
</template>