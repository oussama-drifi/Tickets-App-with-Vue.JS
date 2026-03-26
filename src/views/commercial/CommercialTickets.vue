<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { commercialApi } from '@/services/api'
import TicketCard from '@/components/tickets/TicketCard.vue'
import ImageModal from '@/components/ui/ImageModal.vue'
import StatusFilter from '@/components/ui/StatusFilter.vue'
import CategoryFilter from '@/components/ui/CategoryFilter.vue'

const PAGE_SIZE = 5

const tickets = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const hasMore = computed(() => currentPage.value < totalPages.value)

// Filters
const filterStatus = ref('')
const filterCategory = ref('')
const filterDateFrom = ref('')
const filterDateTo = ref('')

const hasActiveFilters = computed(() => filterStatus.value || filterCategory.value || filterDateFrom.value || filterDateTo.value)

function clearFilters() {
    filterStatus.value = ''
    filterCategory.value = ''
    filterDateFrom.value = ''
    filterDateTo.value = ''
}

// Abort controller
let abortController = null

// get tickets
async function fetchTickets(loadMore = false) {
    if (abortController) {
        abortController.abort()
        abortController = null
    }
    abortController = new AbortController()
    const { signal } = abortController

    const page = loadMore ? currentPage.value + 1 : 1

    if (loadMore) {
        loadingMore.value = true
    } else {
        loading.value = true
    }

    const params = new URLSearchParams()
    if (filterStatus.value) params.set('status', filterStatus.value)
    if (filterCategory.value) params.set('category', filterCategory.value)
    if (filterDateFrom.value) params.set('dateFrom', filterDateFrom.value)
    if (filterDateTo.value) params.set('dateTo', filterDateTo.value)
    params.set('page', page)
    params.set('limit', PAGE_SIZE)
    const qs = params.toString()
    try {
        const data = await commercialApi.get(`/tickets?${qs}`, { signal })
        if (loadMore) {
            tickets.value = [...tickets.value, ...data.tickets]
        } else {
            tickets.value = data.tickets
        }
        currentPage.value = data.page
        totalPages.value = data.totalPages
    } catch (err) {
        if (err.name === 'AbortError') return
        if (!loadMore) tickets.value = []
    } finally {
        loading.value = false
        loadingMore.value = false
        abortController = null
    }
}

// Image modal state
const modalOpen = ref(false)
const modalLoading = ref(false)
const modalImage = ref(null)
const modalDescription = ref('')
const modalTitle = ref('')

async function openImageModal(ticket) {
    modalOpen.value = true
    modalLoading.value = true
    modalDescription.value = ticket.description || ''
    modalTitle.value = ticket.title || ''
    modalImage.value = null

    try {
        const data = await commercialApi.get(`/tickets/${ticket.id}/image`)
        modalImage.value = data.imagePath || null
    } catch {
        modalImage.value = null
    } finally {
        modalLoading.value = false
    }
}
function closeModal() {
    modalOpen.value = false
}

watch([filterStatus, filterCategory, filterDateFrom, filterDateTo], () => {
    fetchTickets()
})
onMounted(() => fetchTickets())
</script>

<template>
    <div class="commercial-tickets">
        <div class="page-header">
            <h2>My Tickets</h2>
            <RouterLink :to="{ name: 'commercial-new-ticket' }" class="new-ticket-btn">
                <i class="bi bi-plus-lg"></i> New Ticket
            </RouterLink>
        </div>

        <div class="filters">
            <div class="filter-group">
                <label>Status</label>
                <StatusFilter v-model="filterStatus" />
            </div>
            <div class="filter-group">
                <label>Category</label>
                <CategoryFilter v-model="filterCategory" />
            </div>
            <div class="filter-group">
                <label>From</label>
                <input type="date" v-model="filterDateFrom" />
            </div>
            <div class="filter-group">
                <label>To</label>
                <input type="date" v-model="filterDateTo" />
            </div>
            <button v-if="hasActiveFilters" class="clear-filters" @click="clearFilters">
                <i class="bi bi-x-circle"></i> Clear
            </button>
        </div>

        <!-- Loading skeleton (initial load) -->
        <div v-if="loading" class="cards-grid">
            <div v-for="i in PAGE_SIZE" :key="i" class="skeleton-card">
                <div class="skeleton-header">
                    <div class="skeleton skeleton-icon"></div>
                    <div class="skeleton-header-text">
                        <div class="skeleton skeleton-line wide"></div>
                        <div class="skeleton skeleton-line medium"></div>
                    </div>
                </div>
                <div class="skeleton skeleton-line wide"></div>
                <div class="skeleton skeleton-line short"></div>
                <div class="skeleton-footer">
                    <div class="skeleton skeleton-line short"></div>
                    <div class="skeleton-badges">
                        <div class="skeleton skeleton-badge"></div>
                        <div class="skeleton skeleton-badge"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cards grid -->
        <div v-else-if="tickets.length" class="cards-grid">
            <TicketCard
                v-for="ticket in tickets"
                :key="ticket.id"
                :ticket="ticket"
                @image-click="openImageModal(ticket)"
            />
            <!-- Loading more skeletons -->
            <template v-if="loadingMore">
                <div v-for="i in PAGE_SIZE" :key="'more-' + i" class="skeleton-card">
                    <div class="skeleton-header">
                        <div class="skeleton skeleton-icon"></div>
                        <div class="skeleton-header-text">
                            <div class="skeleton skeleton-line wide"></div>
                            <div class="skeleton skeleton-line medium"></div>
                        </div>
                    </div>
                    <div class="skeleton skeleton-line wide"></div>
                    <div class="skeleton skeleton-line short"></div>
                    <div class="skeleton-footer">
                        <div class="skeleton skeleton-line short"></div>
                        <div class="skeleton-badges">
                            <div class="skeleton skeleton-badge"></div>
                            <div class="skeleton skeleton-badge"></div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Show More button -->
        <div v-if="!loading && hasMore && !loadingMore" class="show-more-wrapper">
            <button class="show-more-btn" @click="fetchTickets(true)">
                <i class="bi bi-arrow-down-circle"></i> Show More
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="!loading && !tickets.length" class="empty-state">
            <i class="bi bi-ticket-perforated"></i>
            <p>No tickets yet.</p>
        </div>
    </div>

    <ImageModal
        :open="modalOpen"
        :loading="modalLoading"
        :title="modalTitle"
        :image="modalImage"
        :description="modalDescription"
        @close="closeModal"
    />
</template>

<style scoped>
.commercial-tickets {
    padding: 0;
}

.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.commercial-tickets h2 {
    font-size: 20px;
    color: var(--text);
    margin: 0;
}

.new-ticket-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    text-decoration: none;
    transition: background 0.2s;
}

.new-ticket-btn:hover {
    background: var(--primary-hover);
}

/* ---- Filters ---- */
.filters {
    display: flex;
    align-items: flex-end;
    gap: 14px;
    margin-bottom: 18px;
    flex-wrap: wrap;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.filter-group label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    opacity: 0.6;
}

.filter-group input[type="date"] {
    padding: 7px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text);
    font-size: 13px;
    font-family: inherit;
    width: 100%;
    min-width: 0;
    transition: border-color 0.15s;
}

.filter-group input[type="date"]:focus {
    outline: none;
    border-color: var(--primary);
}

.clear-filters {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text-muted);
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
}

.clear-filters:hover {
    border-color: var(--danger);
    color: var(--danger);
}

/* ---- Cards Grid ---- */
.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}

/* ---- Skeleton ---- */
.skeleton-card {
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: 15px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.skeleton {
    border-radius: 6px;
    background: var(--skeleton-gradient);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.skeleton-header {
    display: flex;
    align-items: center;
    gap: 14px;
}

.skeleton-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    flex-shrink: 0;
}

.skeleton-header-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.skeleton-footer {
    margin-top: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.skeleton-badges {
    display: flex;
    gap: 6px;
}

.skeleton-badge {
    width: 80px;
    height: 26px;
    border-radius: 8px;
}

.skeleton-line {
    height: 14px;
}

.skeleton-line.wide { width: 80%; }
.skeleton-line.medium { width: 50%; }
.skeleton-line.short { width: 35%; }

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* ---- Show More ---- */
.show-more-wrapper {
    display: flex;
    justify-content: center;
    padding: 20px 0;
}

.show-more-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 24px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
}

.show-more-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
}

/* ---- Empty State ---- */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    border: 2px dashed var(--border);
    border-radius: 14px;
    background: var(--surface);
    gap: 8px;
    color: var(--text-muted);
    opacity: 0.6;
}

.empty-state i {
    font-size: 36px;
}

.empty-state p {
    font-size: 14px;
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
    .filters {
        gap: 10px;
    }

    .filter-group {
        flex: 1 1 calc(50% - 10px);
        min-width: 0;
    }

    .cards-grid {
        grid-template-columns: 1fr;
    }
}
</style>