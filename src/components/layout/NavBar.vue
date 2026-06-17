<script setup lang="ts">

type link = {
    label: string
    icon?: string
    path: string
}

defineProps({
    links: Array<link>
})

</script>
<template>
    <header>
        <nav class="nav-bar">
            <RouterLink v-for="link in links" :to="{ name: link.path }" class="nav-link">
                <i v-if="link.icon" :class="link.icon"></i> <span>{{ link.label }}</span>
            </RouterLink>
        </nav>
    </header>
</template>


<style scoped>
.nav-bar {
    width: fit-content;
    border-radius: 10px;
    padding: 2px;
    display: flex;
    border: 1px solid var(--border);
    background-color: var(--surface);
}
.nav-link {
    font-size: 14px;
    text-decoration: none;
    padding: 6px 10px;
    border: 5px;
    font-weight: 600;
    color: var(--text-muted);
    border-radius: 8px;
    position: relative;
    color: var(--text-extra-muted);

    &.router-link-active {
        color: var(--primary);
        background-color: var(--active);
    }
}
</style>