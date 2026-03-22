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
    CONFIRMED: 'CONFIRMADO',
    CANCELLED: 'CANCELADO',
    STARTED: 'EN CURSO',
    FINISHED: 'FINALIZADO',
}

const statusLabel = computed(() => {
    return labels[props.status] ?? props.status
})
</script>
