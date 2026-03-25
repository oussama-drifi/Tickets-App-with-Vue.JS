<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
onMounted(() => {
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  const theme = localStorage.getItem('theme') || systemTheme
  document.documentElement.setAttribute('data-theme', theme);
})
</script>

<template>
  <RouterView />
</template>