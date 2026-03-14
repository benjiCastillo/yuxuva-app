<template>
    <span>{{ statusLabel }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    status: {
        type: String,
        default: '',
    },
})

const labels = {
    SCHEDULED: 'PROGRAMADO',
    ONGOING: 'EN CURSO',
    COMPLETED: 'COMPLETADO',
    CANCELLED: 'CANCELADO',
}

const statusLabel = computed(() => {
    return labels[props.status] ?? props.status
})
</script>
