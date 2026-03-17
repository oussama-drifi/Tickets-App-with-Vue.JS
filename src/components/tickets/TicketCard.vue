<script setup>
defineProps({
    ticket: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['image-click'])

const categoryIcon = {
    restaurant: 'bi bi-cup-hot',
    hotel: 'bi bi-building',
    work: 'bi bi-briefcase',
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>

<template>
    <div class="ticket-card">
        <div class="card-header">
            <div class="image-icon" @click="emit('image-click')">
                <i class="bi bi-image"></i>
            </div>
            <div class="header">
                <h3>{{ ticket.title }}</h3>
                <span>{{ formatDate(ticket.ticketDate) }}</span>
            </div>
        </div>
        <div class="card-body">
            <div class="description">
                {{ ticket.description }}
            </div>
        </div>
        <div class="card-footer">
            <span><i class="bi bi-currency-dollar"></i> {{ ticket.amount }} DHs</span>
            <div class="badges">
                <span class="category-badge">
                    <i :class="categoryIcon[ticket.category]"></i>
                    {{ ticket.category }}
                </span>
                <span class="status-badge" :class="ticket.status">
                    <span class="status-dot"></span>
                    {{ ticket.status }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.ticket-card {
    border: 3px dashed var(--border);
    border-radius: 15px;
    padding: 10px;
    background: var(--surface);
    display: flex;
    flex-direction: column;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 14px;
}

.image-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: var(--bg);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-size: 16px;
    flex-shrink: 0;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
}

.image-icon:hover {
    border-color: var(--primary);
    color: var(--primary);
}

.header h3 {
    line-height: 1.2;
}

.header span {
    font-size: 14px;
    color: var(--text-muted);
    display: inline-block;
}

.card-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
}

.description {
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-muted);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: calc(2 * 1.6em);
}

.card-footer {
    margin-top: 7px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card-footer > span:first-child {
    font-weight: 600;
    font-size: 14px;
    color: var(--text);
}

.badges {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* ---- Category Badge ---- */
.category-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    text-transform: capitalize;
    white-space: nowrap;
    color: var(--text-muted);
    background: var(--bg);
    border: 1px solid var(--border);
}

/* ---- Status Badge ---- */
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 8px;
    border: 1px solid var(--border);
    font-size: 12px;
    font-weight: 500;
    text-transform: capitalize;
    white-space: nowrap;
}

.status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
}

.pending .status-dot { background: #F59E0B; }
.verified .status-dot { background: #3B82F6; }
.paid .status-dot { background: var(--success); }
.rejected .status-dot { background: var(--danger); }

.pending.status-badge { color: #B45309; border-color: #FDE68A; background: #FFFBEB; }
.verified.status-badge { color: #1D4ED8; border-color: #BFDBFE; background: #EFF6FF; }
.paid.status-badge { color: #15803D; border-color: #BBF7D0; background: #F0FDF4; }
.rejected.status-badge { color: #B91C1C; border-color: #FECACA; background: #FEF2F2; }

[data-theme="dark"] .pending.status-badge { color: #FCD34D; border-color: #78350F; background: rgba(245, 158, 11, 0.1); }
[data-theme="dark"] .verified.status-badge { color: #93C5FD; border-color: #1E3A5F; background: rgba(59, 130, 246, 0.1); }
[data-theme="dark"] .paid.status-badge { color: #86EFAC; border-color: #14532D; background: rgba(34, 197, 94, 0.1); }
[data-theme="dark"] .rejected.status-badge { color: #FCA5A5; border-color: #7F1D1D; background: rgba(239, 68, 68, 0.1); }
</style>