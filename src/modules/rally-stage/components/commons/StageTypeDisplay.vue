<template>
    <span>{{ stageTypeLabel }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    stageType: {
        type: String,
        default: '',
    },
})

const labels = {
    ES: 'ESPECIAL',
    ENLACE: 'ENLACE',
}

const stageTypeLabel = computed(() => {
    return labels[props.stageType] ?? props.stageType
})
</script>
