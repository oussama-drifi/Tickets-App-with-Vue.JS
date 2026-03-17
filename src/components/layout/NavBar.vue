<script setup>
</script>
<template>
    <header>
        <nav class="nav-bar">
            <RouterLink :to="{ name: 'commercial-all' }" class="nav-link">
                <i class="bi bi-card-list"></i> <span>all commercials</span>
            </RouterLink>
            <RouterLink :to="{ name: 'commercial-details' }" class="nav-link">
                <i class="bi bi-info-circle"></i> <span>commercial details</span>
            </RouterLink>
        </nav>
    </header>
</template>


<style scoped>
.nav-bar {
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
    position: relative;

    &::after {
        content: "";
        position: absolute;
        display: block;
        width: 100%;
        height: 3px;
        left: 0;
        bottom: 0;
        border-radius: 90px;
        background-color: var(--primary);
        opacity: 0;
        transition-duration: 0.3s;
    }
}
.nav-link.router-link-active {
    color: var(--primary);

    &::after {
        opacity: 1;
    }
    
}
</style>