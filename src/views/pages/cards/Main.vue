<script setup>
import NavBar from '@/components/layout/NavBar.vue';
import { RouterView } from 'vue-router';

const cardsPageLinks = [
    {
        icon: "bi bi-card-list",
        label: "all",
        path: "all"
    },
    {
        icon: "bi bi-ui-checks-grid",
        label: "categories",
        path: "categories"
    },
    {
        icon: "bi bi-currency-dollar",
        label: "payments",
        path: "payments"
    }
]
</script>

<template>
    <h2>this is the page for all about cards & payments</h2>
    <NavBar :links="cardsPageLinks"/>
    <RouterView />
</template>


<style scoped>

.nav-link {
    color: var(--text-muted);
    
    &.router-link-active{
        color: var(--primary);
    }
}

</style>