<template>
    <Select
        :modelValue="modelValue"
        :options="formattedCategories"
        optionLabel="label"
        optionValue="id"
        fluid
        filter
        autoFilterFocus
        showClear
        @update:modelValue="
            (value) => {
                emit('update:modelValue', value)
            }
        " />
</template>

<script setup>
import { computed, onMounted } from 'vue'
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

const formattedCategories = computed(() => {
    return categories.value.map((category) => ({
        ...category,
        label: [category.name, category.modality].filter(Boolean).join(' - '),
    }))
})

onMounted(() => {
    selectData()
})
</script>
