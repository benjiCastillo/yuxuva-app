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
    PLANNED: 'PLANIFICADO',
    ACTIVE: 'ACTIVO',
    FINISHED: 'FINALIZADO',
    CANCELLED: 'CANCELADO',
}

const statusLabel = computed(() => {
    return labels[props.status] ?? props.status
})
</script>
