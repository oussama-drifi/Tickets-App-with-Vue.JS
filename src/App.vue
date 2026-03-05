<script setup>
import { ref } from 'vue'
import Card from '@/components/Card.vue';

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <Card />
</template>