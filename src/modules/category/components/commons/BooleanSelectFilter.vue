<template>
    <Select
        :modelValue="normalizedValue"
        :options="options"
        optionLabel="name"
        optionValue="value"
        fluid
        filter
        autoFilterFocus
        showClear
        @update:modelValue="emit('update:modelValue', $event)" />
</template>

<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'

const props = defineProps({
    modelValue: {
        type: [Boolean, String, null],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

const options = [
    { name: 'Si', value: 'true' },
    { name: 'No', value: 'false' },
]

const normalizedValue = computed(() => {
    if (typeof props.modelValue === 'boolean') {
        return String(props.modelValue)
    }

    return props.modelValue
})
</script>
