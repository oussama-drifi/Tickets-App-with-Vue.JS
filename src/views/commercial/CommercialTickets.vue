<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { commercialApi } from '@/services/api'
import TicketCard from '@/components/tickets/TicketCard.vue'

const tickets = ref([])
const loading = ref(false)

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

// get tickets
async function fetchTickets() {
    loading.value = true
    const params = new URLSearchParams()
    if (filterStatus.value) params.set('status', filterStatus.value)
    if (filterCategory.value) params.set('category', filterCategory.value)
    if (filterDateFrom.value) params.set('dateFrom', filterDateFrom.value)
    if (filterDateTo.value) params.set('dateTo', filterDateTo.value)
    const qs = params.toString()
    try {
        const data = await commercialApi.get(`/tickets${qs ? `?${qs}` : ''}`)
        tickets.value = data
    } catch {
        tickets.value = []
    } finally {
        loading.value = false
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
                <select v-model="filterStatus">
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="paid">Paid</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Category</label>
                <select v-model="filterCategory">
                    <option value="">All categories</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="hotel">Hotel</option>
                    <option value="work">Work</option>
                </select>
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

        <!-- Loading skeleton -->
        <div v-if="loading" class="cards-grid">
            <div v-for="i in 6" :key="i" class="skeleton-card">
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
        </div>

        <!-- Empty state -->
        <div v-else class="empty-state">
            <i class="bi bi-ticket-perforated"></i>
            <p>No tickets yet.</p>
        </div>
    </div>

    <!-- Image & Description Modal -->
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
                <div class="modal-content">
                    <button class="modal-close" @click="closeModal">
                        <i class="bi bi-x-lg"></i>
                    </button>
                    <h3 class="modal-title">{{ modalTitle }}</h3>

                    <div v-if="modalLoading" class="modal-loading">
                        <div class="spinner"></div>
                    </div>

                    <template v-else>
                        <div class="modal-image-wrapper">
                            <img v-if="modalImage" :src="modalImage" alt="Ticket image" class="modal-image" />
                            <div v-else class="modal-no-image">
                                <i class="bi bi-image"></i>
                                <span>No image available</span>
                            </div>
                        </div>
                        <p v-if="modalDescription" class="modal-description">{{ modalDescription }}</p>
                        <p v-else class="modal-description muted">No description.</p>
                    </template>
                </div>
            </div>
        </Transition>
    </Teleport>
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
    flex: 1 1 150px;
    min-width: 0;
}

.filter-group label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    opacity: 0.6;
}

.filter-group select,
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

.filter-group select:focus,
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
    .cards-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<!-- Non-scoped styles for teleported modal -->
<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease;
}
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
    transition: transform 0.25s ease, opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-content {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    max-width: 520px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
}

.modal-close {
    position: absolute;
    top: 14px;
    right: 14px;
    background: none;
    border: none;
    font-size: 18px;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background 0.15s, color 0.15s;
}
.modal-close:hover {
    background: var(--bg);
    color: var(--text);
}

.modal-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 18px;
    padding-right: 30px;
}

.modal-loading {
    display: flex;
    justify-content: center;
    padding: 40px 0;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.modal-image-wrapper {
    border-radius: 12px;
    overflow: hidden;
    background: var(--bg);
    border: 1px solid var(--border);
    margin-bottom: 16px;
}

.modal-image {
    width: 100%;
    display: block;
    object-fit: contain;
    max-height: 400px;
}

.modal-no-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 48px 0;
    color: var(--text-muted);
    opacity: 0.5;
}
.modal-no-image i {
    font-size: 32px;
}
.modal-no-image span {
    font-size: 14px;
}

.modal-description {
    font-size: 14px;
    line-height: 1.6;
    color: var(--text);
}
.modal-description.muted {
    color: var(--text-muted);
    opacity: 0.6;
    font-style: italic;
}
</style>