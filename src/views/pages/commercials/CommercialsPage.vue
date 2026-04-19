<script setup>
import CommercialsTable from '@/components/commercials/CommercialsTable.vue'
import { useCommercialsStore } from '@/stores/commercials';
import { storeToRefs } from 'pinia';
import CustomSelect from '@/components/ui/CustomSelect.vue'
import { watch } from 'vue';

const commercialsStore = useCommercialsStore()

const {
    filterSearch, 
    filterStatus,
    error,
    fetchedAll
} = storeToRefs(commercialsStore)

const { fetchCommercials } = commercialsStore

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

</script>

<template>
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
    <CommercialsTable/>
    <div v-if="error" class="error-message">
        sorry! there has been an issue fetching the Data from server
    </div>
</template>


<style>


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


</style>