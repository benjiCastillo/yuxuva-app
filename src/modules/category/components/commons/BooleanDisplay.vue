<template>
    <span>{{ value ? 'Si' : 'No' }}</span>
</template>

<script setup>
defineProps({
    value: {
        type: Boolean,
        default: false,
    },
})
</script>
