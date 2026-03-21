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
    INSCRIBED: 'INSCRITO',
    CONFIRMED: 'CONFIRMADO',
    WITHDRAWN: 'RETIRADO',
    DISQUALIFIED: 'DESCALIFICADO',
}

const statusLabel = computed(() => {
    return labels[props.status] ?? props.status
})
</script>
