<template>
    <div class="commercial-details-skeleton">
        <!-- Profile section skeleton -->
        <div class="profile-section">
            <div class="skeleton avatar"></div>
            <div class="profile-info">
                <div class="name-row">
                    <div class="skeleton name"></div>
                    <div class="skeleton badge"></div>
                    <div class="skeleton btn"></div>
                </div>
                <div class="skeleton email"></div>
                <div class="skeleton bio"></div>
            </div>
        </div>

        <!-- Tickets section skeleton -->
        <div class="tickets-section">
            <div class="skeleton section-title"></div>
            <div class="filters-row">
                <div class="skeleton filter"></div>
                <div class="skeleton filter"></div>
                <div class="skeleton filter-date"></div>
                <div class="skeleton filter-date"></div>
            </div>
            <!-- Table skeleton -->
            <div class="table-skeleton">
                <div class="table-head">
                    <div class="skeleton th" v-for="n in 5" :key="'th-' + n"></div>
                </div>
                <div class="table-row" v-for="n in 6" :key="'row-' + n">
                    <div class="skeleton td-short"></div>
                    <div class="skeleton td-long"></div>
                    <div class="skeleton td-medium"></div>
                    <div class="skeleton td-badge"></div>
                    <div class="skeleton td-short"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.skeleton {
    border-radius: 6px;
    background: linear-gradient(90deg, var(--border) 25%, color-mix(in srgb, var(--border) 60%, transparent) 50%, var(--border) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Profile */
.profile-section {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 20px;
}

.avatar {
    width: 80px;
    height: 80px;
    border-radius: 15px;
    flex-shrink: 0;
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
}

.name-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.name   { width: 160px; height: 24px; }
.badge  { width: 72px;  height: 24px; border-radius: 4px; }
.btn    { width: 60px;  height: 24px; border-radius: 6px; }
.email  { width: 220px; height: 16px; }
.bio    { width: 300px; height: 16px; }

/* Tickets section */
.tickets-section {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.section-title { width: 70px; height: 18px; }

.filters-row {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
}

.filter      { width: 130px; height: 36px; border-radius: 8px; }
.filter-date { width: 150px; height: 36px; border-radius: 8px; }

/* Table */
.table-skeleton {
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--surface);
    overflow: hidden;
}

.table-head {
    display: flex;
    gap: 0;
    padding: 14px 18px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    gap: 24px;
}

.th { height: 12px; border-radius: 4px; }
.table-head .th:nth-child(1) { width: 120px; }
.table-head .th:nth-child(2) { width: 160px; }
.table-head .th:nth-child(3) { width: 100px; }
.table-head .th:nth-child(4) { width: 80px; }
.table-head .th:nth-child(5) { width: 60px; }

.table-row {
    display: flex;
    align-items: center;
    padding: 14px 18px;
    gap: 24px;
    border-top: 1px solid var(--border);
}

.table-row:first-child { border-top: none; }

.td-short  { width: 60px;  height: 16px; flex-shrink: 0; }
.td-medium { width: 100px; height: 16px; flex-shrink: 0; }
.td-long   { width: 200px; height: 16px; flex-shrink: 0; }
.td-badge  { width: 80px;  height: 28px; border-radius: 6px; flex-shrink: 0; }
</style>
