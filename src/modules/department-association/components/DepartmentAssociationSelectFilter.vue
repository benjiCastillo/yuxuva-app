<template>
    <Select
        :modelValue="modelValue"
        :options="departmentAssociations"
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

import { useSelectDataDepartmentAssociation } from '../composables/select-data-department-association.composable'

defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const { departmentAssociations, selectData } = useSelectDataDepartmentAssociation({
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
