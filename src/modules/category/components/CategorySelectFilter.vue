<template>
    <Select
        :modelValue="modelValue"
        :options="categories"
        optionLabel="name"
        optionValue="id"
        fluid
        filter
        autoFilterFocus
        showClear
        @update:modelValue="emit('update:modelValue', $event)" />
</template>

<script setup>
import { onMounted } from 'vue'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'

import { useSelectDataCategory } from '../composables/select-data-category.composable'

defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const { categories, selectData } = useSelectDataCategory({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

onMounted(() => {
    selectData()
})
</script>
