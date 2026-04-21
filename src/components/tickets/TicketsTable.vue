<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { adminApi } from '@/services/api';
import ImageModal from '@/components/ui/ImageModal.vue';
import { formatDate } from '@/utils';

const props = defineProps({
    tickets: { type: Array, required: true },
    loading: { type: Boolean, default: false },
    loadingMore: { type: Boolean, default: false },
    // hasMore: { type: Boolean, default: false },
    skeletonRows: { type: Number, default: 5 },
    sortBy: { type: String, default: null },
    sortDir: { type: String, default: 'asc'},
    api: { type: Object, default: () => adminApi },
    readonly: { type: Boolean, default: false }
})

const categoryIcon = {
    restaurant: 'bi bi-cup-hot',
    hotel: 'bi bi-building',
    work: 'bi bi-briefcase',
}
const statuses = ['pending', 'verified', 'rejected']

const emit = defineEmits(['status-change', 'sort', 'load-more']);

function sortIcon(field) {
    if (props.sortBy !== field) return 'bi-arrow-down-up'
    return props.sortDir === 'asc' ? 'bi-sort-up' : 'bi-sort-down'
}

const openDropdown = ref(null)
const dropdownPos = ref({ top: 0, left: 0 })
const tableWrapper = ref(null)

function closeDropdowns(e) {
    if (!e.target.closest('.status-select') && !e.target.closest('.status-dropdown')) {
        openDropdown.value = null
    }
}

function onScroll() {
    openDropdown.value = null
}

// Column resize state
const resizing = ref(null)
const columnWidths = ref({
    image: 70,
    title: null,
    amount: 120,
    date: 160,
    publisher: null,
    category: 130,
    status: 150,
})

function onResizeStart(col, e) {
    e.preventDefault()
    const startX = e.clientX
    const th = e.target.closest('th')
    const startWidth = th.offsetWidth

    function onMouseMove(e) {
        const diff = e.clientX - startX
        columnWidths.value[col] = Math.max(60, startWidth + diff)
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        resizing.value = null
    }

    resizing.value = col
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}
function colStyle(col) {
    const w = columnWidths.value[col]
    return w ? { width: w + 'px', minWidth: w + 'px' } : {}
}

function toggleDropdown(ticketId, e) {
    if (openDropdown.value === ticketId) {
        openDropdown.value = null
        return
    }
    const trigger = e.currentTarget
    const rect = trigger.getBoundingClientRect()
    const dropdownHeight = 180
    const spaceBelow = window.innerHeight - rect.bottom

    if (spaceBelow < dropdownHeight) {
        dropdownPos.value = {
            top: (rect.top - dropdownHeight - 6) + 'px',
            left: rect.left + 'px',
        }
    } else {
        dropdownPos.value = {
            top: rect.bottom + 6 + 'px',
            left: rect.left + 'px',
        }
    }
    openDropdown.value = ticketId
}

async function selectStatus(ticket, status) {
    const previousStatus = ticket.status
    ticket.status = status
    openDropdown.value = null

    try {
        await props.api.patch(`/tickets/${ticket.id}/status`, { status })
    } catch {
        ticket.status = previousStatus
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
        const data = await props.api.get(`/tickets/${ticket.id}/image`)
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

onMounted(() => {
    document.addEventListener('click', closeDropdowns)
    tableWrapper.value?.addEventListener('scroll', onScroll)
})
onUnmounted(() => {
    document.removeEventListener('click', closeDropdowns)
    tableWrapper.value?.removeEventListener('scroll', onScroll)
})
</script>

<template>
    <!-- Loading skeleton -->
    <div v-if="loading" class="table-wrapper">
        <table class="tickets-table">
            <thead>
                <tr>
                    <th :style="colStyle('image')">Image<span class="resize-handle" @mousedown="onResizeStart('image', $event)"></span></th>
                    <th :style="colStyle('title')">Title<span class="resize-handle" @mousedown="onResizeStart('title', $event)"></span></th>
                    <th :style="colStyle('amount')">Amount<span class="resize-handle" @mousedown="onResizeStart('amount', $event)"></span></th>
                    <th :style="colStyle('date')">Date<span class="resize-handle" @mousedown="onResizeStart('date', $event)"></span></th>
                    <th :style="colStyle('publisher')">Publisher<span class="resize-handle" @mousedown="onResizeStart('publisher', $event)"></span></th>
                    <th :style="colStyle('category')">Category<span class="resize-handle" @mousedown="onResizeStart('category', $event)"></span></th>
                    <th :style="colStyle('status')">Status<span class="resize-handle" @mousedown="onResizeStart('status', $event)"></span></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in skeletonRows" :key="i" class="skeleton-row">
                    <td><div class="skeleton skeleton-icon"></div></td>
                    <td><div class="skeleton skeleton-text"></div></td>
                    <td><div class="skeleton skeleton-short"></div></td>
                    <td><div class="skeleton skeleton-medium"></div></td>
                    <td><div class="skeleton skeleton-text"></div></td>
                    <td><div class="skeleton skeleton-short"></div></td>
                    <td><div class="skeleton skeleton-badge"></div></td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Data table -->
    <div v-else ref="tableWrapper" class="table-wrapper" :class="{ resizing: resizing }">
        <table class="tickets-table">
            <thead>
                <tr>
                    <th :style="colStyle('image')">Image<span class="resize-handle" @mousedown="onResizeStart('image', $event)"></span></th>
                    <th :style="colStyle('title')">Title<span class="resize-handle" @mousedown="onResizeStart('title', $event)"></span></th>
                    <th :style="colStyle('amount')" class="sortable" @click="emit('sort', 'amount')"><i :class="['bi sort-icon', sortIcon('amount'), { active: sortBy === 'amount' }]"></i>Amount<span class="resize-handle" @mousedown.stop="onResizeStart('amount', $event)"></span></th>
                    <th :style="colStyle('date')" class="sortable" @click="emit('sort', 'date')"><i :class="['bi sort-icon', sortIcon('date'), { active: sortBy === 'date' }]"></i>Date<span class="resize-handle" @mousedown.stop="onResizeStart('date', $event)"></span></th>
                    <th :style="colStyle('publisher')">Publisher<span class="resize-handle" @mousedown="onResizeStart('publisher', $event)"></span></th>
                    <th :style="colStyle('category')">Category<span class="resize-handle" @mousedown="onResizeStart('category', $event)"></span></th>
                    <th :style="colStyle('status')">Status<span class="resize-handle" @mousedown="onResizeStart('status', $event)"></span></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ticket in tickets" :key="ticket.id">
                    <td>
                        <div class="ticket-image clickable" @click="openImageModal(ticket)">
                            <i class="bi bi-image"></i>
                        </div>
                    </td>
                    <td>
                        <span class="ticket-title">{{ ticket.title }}</span>
                    </td>
                    <td>
                        <span class="ticket-amount">{{ ticket.amount }} <small>MAD</small></span>
                    </td>
                    <td>
                        <span class="ticket-date">{{ formatDate(ticket.ticketDate) }}</span>
                    </td>
                    <td>
                        <span class="ticket-publisher">{{ ticket.owner?.email || '—' }}</span>
                    </td>
                    <td>
                        <span class="ticket-category">
                            <i :class="categoryIcon[ticket.category]"></i> {{ ticket.category }}
                        </span>
                    </td>
                    <td>
                        <div v-if="!readonly" class="status-select" :class="{ open: openDropdown === ticket.id }">
                            <button class="status-trigger" :class="ticket.status" @click="toggleDropdown(ticket.id, $event)">
                                <span class="status-dot"></span>
                                {{ ticket.status }}
                                <i class="bi bi-chevron-down chevron"></i>
                            </button>
                        </div>
                        <span v-else class="status-badge" :class="ticket.status">
                            <span class="status-dot"></span>
                            {{ ticket.status }}
                        </span>
                    </td>
                </tr>
                <!-- Loading more skeleton rows -->
                <tr v-if="loadingMore" v-for="i in skeletonRows" :key="'more-' + i" class="skeleton-row">
                    <td><div class="skeleton skeleton-icon"></div></td>
                    <td><div class="skeleton skeleton-text"></div></td>
                    <td><div class="skeleton skeleton-short"></div></td>
                    <td><div class="skeleton skeleton-medium"></div></td>
                    <td><div class="skeleton skeleton-text"></div></td>
                    <td><div class="skeleton skeleton-short"></div></td>
                    <td><div class="skeleton skeleton-badge"></div></td>
                </tr>
            </tbody>
        </table>
        <!-- Show More button -->
        <!-- <div v-if="hasMore && !loadingMore" class="show-more-wrapper">
            <button class="show-more-btn" @click="emit('load-more')">
                <i class="bi bi-arrow-down-circle"></i> Show More
            </button>
        </div> -->

        
    </div>

    <!-- Fixed-position dropdown (outside scroll container) -->
    <Teleport to="body">
        <div
            v-if="openDropdown !== null"
            class="status-dropdown"
            :style="{ top: dropdownPos.top, left: dropdownPos.left }"
        >
            <button
                v-for="status in statuses"
                :key="status"
                class="status-option"
                :class="[status, { active: tickets.find(t => t.id === openDropdown)?.status === status }]"
                @click="selectStatus(tickets.find(t => t.id === openDropdown), status)"
            >
                <span class="status-dot"></span>
                {{ status }}
                <i v-if="tickets.find(t => t.id === openDropdown)?.status === status" class="bi bi-check2"></i>
            </button>
        </div>
    </Teleport>

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
/* ---- Table ---- */
.table-wrapper {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    max-height: 85vh;
    overflow-y: auto;
    overflow-x: auto;
}

.table-wrapper > table thead tr:first-child th:first-child {
    border-top-left-radius: 14px;
}

.table-wrapper > table thead tr:first-child th:last-child {
    border-top-right-radius: 14px;
}

.table-wrapper > table tbody tr:last-child td:first-child {
    border-bottom-left-radius: 14px;
}

.table-wrapper > table tbody tr:last-child td:last-child {
    border-bottom-right-radius: 14px;
}

.tickets-table {
    width: 100%;
    border-collapse: collapse;
}

.table-wrapper.resizing {
    user-select: none;
    cursor: col-resize;
}

.tickets-table thead {
    background: var(--bg);
    position: sticky;
    top: 0;
    z-index: 10;
}

.tickets-table th {
    position: relative;
    padding: 14px 18px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    opacity: 0.6;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sortable {
    cursor: pointer;
    user-select: none;
}

.sortable:hover {
    opacity: 0.8;
}

.sort-icon {
    font-size: 11px;
    margin-right: 5px;
    opacity: 0.3;
    transition: opacity 0.15s;
    vertical-align: middle;
}

.sort-icon.active {
    opacity: 1;
    color: var(--primary);
}

.sortable:hover .sort-icon {
    opacity: 0.6;
}

.resize-handle {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    cursor: col-resize;
    background: transparent;
    transition: background 0.15s;
    z-index: 2;
}

.resize-handle:hover,
.table-wrapper.resizing .resize-handle {
    background: var(--primary);
    opacity: 0.4;
}

.tickets-table td {
    padding: 14px 18px;
    font-size: 14px;
    color: var(--text);
    border-top: 1px solid var(--border);
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tickets-table tbody tr {
    transition: background 0.15s;
}

.tickets-table tbody tr:hover {
    background: var(--bg);
}

/* ---- Cells ---- */
.ticket-image {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: var(--bg);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    opacity: 0.5;
    font-size: 16px;
    transition: opacity 0.15s, border-color 0.15s;
}

.ticket-image.clickable {
    cursor: pointer;
}
.ticket-image.clickable:hover {
    opacity: 0.8;
    border-color: var(--primary);
    color: var(--primary);
}

.ticket-title {
    font-weight: 500;
    color: var(--text);
}

.ticket-amount {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.ticket-amount small {
    font-size: 11px;
    font-weight: 500;
    opacity: 0.5;
}

.ticket-date {
    color: var(--text-muted);
    opacity: 0.7;
    font-size: 13px;
}

.ticket-publisher {
    font-size: 13px;
    color: var(--text-muted);
}

.ticket-category {
    font-size: 13px;
    font-weight: 500;
    text-transform: capitalize;
    color: var(--text-muted);
}

/* ---- Status Select ---- */
.status-select {
    position: relative;
    display: inline-block;
}

.status-trigger {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-transform: capitalize;
    transition: all 0.15s;
    font-family: inherit;
    color: var(--text);
    white-space: nowrap;
}

.status-trigger:hover {
    border-color: var(--primary);
}

.status-trigger .chevron {
    font-size: 11px;
    transition: transform 0.2s;
    opacity: 0.4;
    margin-left: 2px;
}

.status-select.open .chevron {
    transform: rotate(180deg);
}

/* Status colors */
.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.pending .status-dot { background: #F59E0B; }
.verified .status-dot { background: #3B82F6; }
.paid .status-dot { background: var(--success); }
.rejected .status-dot { background: var(--danger); }

.pending.status-trigger { color: #B45309; border-color: #FDE68A; background: #FFFBEB; }
.verified.status-trigger { color: #1D4ED8; border-color: #BFDBFE; background: #EFF6FF; }
.paid.status-trigger { color: #15803D; border-color: #BBF7D0; background: #F0FDF4; }
.rejected.status-trigger { color: #B91C1C; border-color: #FECACA; background: #FEF2F2; }

[data-theme="dark"] .pending.status-trigger { color: #FCD34D; border-color: #78350F; background: rgba(245, 158, 11, 0.1); }
[data-theme="dark"] .verified.status-trigger { color: #93C5FD; border-color: #1E3A5F; background: rgba(59, 130, 246, 0.1); }
[data-theme="dark"] .paid.status-trigger { color: #86EFAC; border-color: #14532D; background: rgba(34, 197, 94, 0.1); }
[data-theme="dark"] .rejected.status-trigger { color: #FCA5A5; border-color: #7F1D1D; background: rgba(239, 68, 68, 0.1); }

/* Read-only status badge */
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
    font-size: 13px;
    font-weight: 500;
    text-transform: capitalize;
    white-space: nowrap;
}

.pending.status-badge { color: #B45309; border-color: #FDE68A; background: #FFFBEB; }
.verified.status-badge { color: #1D4ED8; border-color: #BFDBFE; background: #EFF6FF; }
.paid.status-badge { color: #15803D; border-color: #BBF7D0; background: #F0FDF4; }
.rejected.status-badge { color: #B91C1C; border-color: #FECACA; background: #FEF2F2; }

[data-theme="dark"] .pending.status-badge { color: #FCD34D; border-color: #78350F; background: rgba(245, 158, 11, 0.1); }
[data-theme="dark"] .verified.status-badge { color: #93C5FD; border-color: #1E3A5F; background: rgba(59, 130, 246, 0.1); }
[data-theme="dark"] .paid.status-badge { color: #86EFAC; border-color: #14532D; background: rgba(34, 197, 94, 0.1); }
[data-theme="dark"] .rejected.status-badge { color: #FCA5A5; border-color: #7F1D1D; background: rgba(239, 68, 68, 0.1); }

/* ---- Skeleton ---- */
.skeleton {
    border-radius: 6px;
    background: var(--skeleton-gradient);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.skeleton-icon { width: 42px; height: 42px; border-radius: 10px; }
.skeleton-text { width: 90%; height: 18px; }
.skeleton-short { width: 80%; height: 18px; }
.skeleton-medium { width: 85%; height: 18px; }
.skeleton-badge { width: 90%; height: 34px; border-radius: 8px; }

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.skeleton-row td {
    border-top: 1px solid var(--border);
}

/* ---- Show More ---- */
.show-more-wrapper {
    display: flex;
    justify-content: center;
    padding: 16px;
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

/* ---- Responsive ---- */
@media (max-width: 768px) {
    .table-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .tickets-table {
        min-width: 640px;
    }

    .tickets-table th,
    .tickets-table td {
        padding: 12px 14px;
    }
}
</style>

<!-- Non-scoped styles for teleported dropdown -->
<style>
.status-dropdown {
    position: fixed;
    min-width: 160px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 5px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    z-index: 1000;
    animation: dropdown-in 0.15s ease;
}

@keyframes dropdown-in {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
}

.status-option {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: none;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    cursor: pointer;
    border-radius: 7px;
    text-transform: capitalize;
    transition: background 0.1s;
    font-family: inherit;
}

.status-option:hover {
    background: var(--bg);
}

.status-option.active {
    background: var(--bg);
}

.status-option .bi-check2 {
    margin-left: auto;
    font-size: 14px;
    color: var(--primary);
}
</style>