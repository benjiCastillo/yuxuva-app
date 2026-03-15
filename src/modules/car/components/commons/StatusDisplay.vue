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
    ACTIVE: 'ACTIVO',
    INACTIVE: 'INACTIVO',
}

const statusLabel = computed(() => {
    return labels[props.status] ?? props.status
})
</script>
