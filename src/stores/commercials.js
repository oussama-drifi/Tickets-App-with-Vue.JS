import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminApi } from '@/services/api'

export const useCommercialsStore = defineStore('commercials', () => {
  const commercials = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchCommercials() {
    isLoading.value = true
    error.value = null
    try {
      commercials.value = await adminApi.get('/commercials')
      console.log(commercials.value)
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  return { commercials, isLoading, error, fetchCommercials }
})
