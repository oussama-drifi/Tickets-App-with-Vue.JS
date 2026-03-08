<template>
  <div class="preview">
    <div class="controls">
      <h1>Color Palette</h1>
      <button @click="toggleTheme">
        <i :class="isDark ? 'bi-sun' : 'bi-moon-stars'"></i>
        {{ isDark ? 'Light' : 'Dark' }}
      </button>
    </div>

    <h2>{{ isDark ? 'Dark' : 'Light' }} Theme</h2>
    <div class="grid">
      <div v-for="color in colors" :key="color.var" class="swatch">
        <div class="rect" :style="{ background: `var(${color.var})` }"></div>
        <span class="label">{{ color.var }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isDark = ref(false)

const colors = [
  { var: '--primary' },
  { var: '--primary-hover' },
  { var: '--bg' },
  { var: '--surface' },
  { var: '--text' },
  { var: '--text-muted' },
  { var: '--border' },
  { var: '--danger' },
  { var: '--success' },
]

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}
</script>

<style scoped>
.preview {
  padding: 40px;
  min-height: 100vh;
  background: var(--bg);
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 17px;
  margin: 10px;
  color: var(--text);
  transition: background 0.3s, color 0.3s;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.controls button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: var(--primary);
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.controls button:hover {
  background: var(--primary-hover);
}

h2 {
  margin-bottom: 16px;
  font-size: 18px;
  color: var(--text-muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.swatch {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rect {
  width: 100%;
  height: 80px;
  border-radius: 12px;
  border: 2px solid var(--border);
  transition: background 0.3s, border-color 0.3s;
}

.label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
}
</style>
