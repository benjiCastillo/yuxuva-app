<template>
    <Select
        :modelValue="modelValue"
        :options="stageTypes"
        optionLabel="name"
        optionValue="value"
        fluid
        filter
        autoFilterFocus
        showClear
        @update:modelValue="emit('update:modelValue', $event)" />
</template>

<script setup>
import { ref } from 'vue'
import Select from 'primevue/select'

defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

const stageTypes = ref([
    { name: 'ESPECIAL', value: 'ES' },
    { name: 'ENLACE', value: 'ENLACE' },
])
</script>
