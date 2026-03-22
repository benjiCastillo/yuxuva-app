<template>
    <Select
        :modelValue="modelValue"
        :options="formattedDrivers"
        optionLabel="label"
        optionValue="id"
        fluid
        filter
        autoFilterFocus
        showClear
        @update:modelValue="emit('update:modelValue', $event)" />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'

import { useSelectDataDriver } from '../composables/select-data-driver.composable'

defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const { drivers, selectData } = useSelectDataDriver({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const formattedDrivers = computed(() => {
    return drivers.value.map((driver) => ({
        ...driver,
        label: [driver.firstName, driver.lastName].filter(Boolean).join(' '),
    }))
})

onMounted(() => {
    selectData()
})
</script>
