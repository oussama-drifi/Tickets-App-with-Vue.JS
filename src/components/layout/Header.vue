<script setup>
</script>
<template>
    <header>
        <nav class="nav-bar">
            <RouterLink :to="{ name: 'commercial-all' }" class="nav-link">
                <i class="bi bi-card-list"></i> all <span>commercials</span>
            </RouterLink>
            <RouterLink :to="{ name: 'commercial-details' }" class="nav-link">
                <i class="bi bi-info-circle"></i> <span>commercial details</span>
            </RouterLink>
        </nav>
    </header>
</template>


<style scoped>
.nav-bar {
    background-color: var(--surface);
    border: 2px solid var(--border);
    width: fit-content;
    border-radius: 8px;
    padding: 2px;
    display: flex;
    gap: 5px;
}
.nav-link {
    font-size: 16px;
    text-decoration: none;
    padding: 6px 10px;
    border: 5px;
    font-weight: 600;
    color: var(--text-muted);
    border-radius: 6px;
}
.nav-link.router-link-active {
    background-color: var(--primary);
    color: var(--bg);
}
</style>