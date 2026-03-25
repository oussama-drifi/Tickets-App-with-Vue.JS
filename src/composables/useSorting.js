import { ref, computed } from 'vue'

export function useSorting(items) {
    const sortBy = ref(null)
    const sortDir = ref('asc')

    function toggleSort(field) {
        if (sortBy.value === field) {
            sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortBy.value = field
            sortDir.value = 'asc'
        }
    }

    const sortedItems = computed(() => {
        if (!sortBy.value) return items.value
        const dir = sortDir.value === 'asc' ? 1 : -1
        return [...items.value].sort((a, b) => {
            if (sortBy.value === 'amount') {
                return (Number(a.amount) - Number(b.amount)) * dir
            }
            if (sortBy.value === 'date') {
                return (new Date(a.ticketDate) - new Date(b.ticketDate)) * dir
            }
            return 0
        })
    })

    return { sortBy, sortDir, toggleSort, sortedItems }
}
