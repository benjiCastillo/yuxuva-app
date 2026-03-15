<template>
    <Select
        :modelValue="modelValue"
        :options="formattedCars"
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

import { useSelectDataCar } from '../composables/select-data-car.composable'

defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const { cars, selectData } = useSelectDataCar({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const formattedCars = computed(() => {
    return cars.value.map((car) => ({
        ...car,
        label: [car.brand, car.model, car.year].filter(Boolean).join(' '),
    }))
})

onMounted(() => {
    selectData()
})
</script>
