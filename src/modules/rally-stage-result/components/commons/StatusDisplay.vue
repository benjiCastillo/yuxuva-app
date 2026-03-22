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
    OK: 'OK',
    DNS: 'NO LARGA',
    DNF: 'NO TERMINA',
    DSQ: 'DESCALIFICADO',
}

const statusLabel = computed(() => {
    return labels[props.status] ?? props.status
})
</script>
