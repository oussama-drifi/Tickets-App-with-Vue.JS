<script setup lang="ts">
import CardSkeleton from '@/components/commercials/CardSkeleton.vue';

</script>

<template>
    <div class="commercials-skeleon">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
    </div>
</template>


<style scoped>
.commercials-skeleon {
    margin-top: 15px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
}

@media (max-width: 768px) {
    .commercials-skeleon {
        grid-template-columns: 1fr;
    }
}

</style>