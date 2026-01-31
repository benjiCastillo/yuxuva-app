<template>
  <RouterView />
  <Toast position="top-right" />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { setToast } from '@/services/toast'

const toast = useToast()

onMounted(() => {
  setToast(toast)
})
</script>
