import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminApi } from '@/services/api'

export const useCommercialsStore = defineStore('commercials', () => {
  const commercials = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const fetched = ref(false);

  const filteredCommercials = (searchQuery, status) => {
    return commercials.value.filter(c => {
      const matchesSearch = c.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      if (status === 'all') {
        return matchesSearch
      }
      return matchesSearch && c.status === status
    })
  }

  async function fetchCommercials() {
    isLoading.value = true
    error.value = null
    try {
      commercials.value = await adminApi.get('/commercials')
      fetched.value = true
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }


  return { commercials, isLoading, error, fetchCommercials, fetched, filteredCommercials }
})
