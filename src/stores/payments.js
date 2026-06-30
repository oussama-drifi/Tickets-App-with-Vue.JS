import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/services/api'

const PAGE_SIZE = 10

export const usePaymentsStore = defineStore('payments', () => {
    // Page cache: { 1: [...payments], 2: [...payments], ... }
    const payments = ref({})
    const fetched = ref(false)
    const fetchedAll = ref(false)

    const isLoading = ref(false)
    const error = ref(null)

    // Pagination
    const currentPage = ref(1)
    const totalPages = ref(1)
    const total = ref(0)

    // Filter — label search only (matches backend ?label= partial search)
    const filterLabel = ref('')

    // Abort controller
    let abortController = null

    function abortPending() {
        if (abortController) { abortController.abort(); abortController = null }
    }

    // In-memory label filter (used when fetchedAll = true)
    const allPaymentsFlat = computed(() => Object.values(payments.value).flat())

    const allFilteredInMemory = computed(() => {
        if (!filterLabel.value) return allPaymentsFlat.value
        const q = filterLabel.value.toLowerCase()
        return allPaymentsFlat.value.filter(p =>
            (p.label || '').toLowerCase().includes(q)
        )
    })

    // What to show on current page
    const currentPagePayments = computed(() => {
        if (filterLabel.value && fetchedAll.value) {
            const start = (currentPage.value - 1) * PAGE_SIZE
            return allFilteredInMemory.value.slice(start, start + PAGE_SIZE)
        }
        return payments.value[currentPage.value] || []
    })

    const activeTotalPages = computed(() => {
        if (filterLabel.value && fetchedAll.value) {
            return Math.ceil(allFilteredInMemory.value.length / PAGE_SIZE) || 1
        }
        return totalPages.value
    })

    function buildQuery(page = currentPage.value) {
        const params = new URLSearchParams()
        params.set('page', page)
        params.set('limit', PAGE_SIZE)
        if (filterLabel.value) params.set('label', filterLabel.value)
        return `?${params.toString()}`
    }

    async function fetchPayments() {
        abortPending()
        abortController = new AbortController()
        const { signal } = abortController
        isLoading.value = true
        error.value = null

        try {
            const data = await adminApi.get(`/payments${buildQuery()}`, { signal })
            const { payments: rows, pagination } = data

            payments.value = { ...payments.value, [pagination.page]: rows }
            currentPage.value = pagination.page
            totalPages.value = pagination.totalPages
            total.value = pagination.total
            fetched.value = true

            // Mark fetchedAll when no filter and all pages cached
            if (!filterLabel.value && Object.keys(payments.value).length === pagination.totalPages) {
                fetchedAll.value = true
            }
        } catch (err) {
            if (err.name === 'AbortError') return
            error.value = err.message
        } finally {
            if (signal === abortController?.signal) {
                isLoading.value = false
                abortController = null
            }
        }
    }

    async function goToPage(page) {
        const target = Math.max(1, Math.min(page, activeTotalPages.value))

        // In-memory mode: just move the page pointer, computed handles slicing
        if (filterLabel.value && fetchedAll.value) {
            currentPage.value = target
            return
        }

        // Cache hit
        if (payments.value[target]) {
            currentPage.value = target
            return
        }

        currentPage.value = target
        await fetchPayments()
    }

    function clearFilter() {
        filterLabel.value = ''
        // Snap back to the highest cached page
        const cachedPages = Object.keys(payments.value).map(Number)
        if (cachedPages.length) currentPage.value = Math.max(...cachedPages)
    }

    // Optimistic action helpers — mutate the cached payment in place
    function updatePaymentInCache(id, changes) {
        for (const page of Object.values(payments.value)) {
            const p = page.find(p => p.id === id)
            if (p) { Object.assign(p, changes); break }
        }
    }

    async function approvePayment(payment) {
        const previous = { status: payment.status }
        updatePaymentInCache(payment.id, { status: 'success' })
        // also update the nested ticket status
        if (payment.ticket) updatePaymentInCache(payment.id, {})

        try {
            await adminApi.patch(`/payments/${payment.id}/approve`, {})
            // Reflect ticket status change returned by server
            updatePaymentInCache(payment.id, {
                status: 'success',
                ticket: payment.ticket ? { ...payment.ticket, status: 'paid' } : null
            })
        } catch (err) {
            updatePaymentInCache(payment.id, previous)
            throw err
        }
    }

    async function rejectPayment(payment) {
        const previous = { status: payment.status }
        updatePaymentInCache(payment.id, { status: 'failed' })

        try {
            await adminApi.patch(`/payments/${payment.id}/reject`, {})
        } catch (err) {
            updatePaymentInCache(payment.id, previous)
            throw err
        }
    }

    async function cancelPayment(payment) {
        const previous = {
            status: payment.status,
            ticket: payment.ticket ? { ...payment.ticket } : null,
            card: payment.card ? { ...payment.card } : null
        }
        updatePaymentInCache(payment.id, { status: 'cancelled' })

        try {
            await adminApi.delete(`/payments/${payment.id}`)
            // Reflect ticket revert and card balance restore
            const updatedCard = payment.card
                ? { ...payment.card, balance: (parseFloat(payment.card.balance) + parseFloat(payment.amount)).toFixed(2) }
                : null
            updatePaymentInCache(payment.id, {
                status: 'cancelled',
                ticket: payment.ticket ? { ...payment.ticket, status: 'verified' } : null,
                card: updatedCard
            })
        } catch (err) {
            updatePaymentInCache(payment.id, previous)
            throw err
        }
    }

    return {
        payments,
        fetched,
        fetchedAll,
        isLoading,
        error,
        currentPage,
        totalPages,
        total,
        filterLabel,
        currentPagePayments,
        activeTotalPages,
        fetchPayments,
        goToPage,
        clearFilter,
        approvePayment,
        rejectPayment,
        cancelPayment,
        abortPending,
    }
})
