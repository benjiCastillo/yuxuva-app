<template>
    <Select
        :modelValue="modelValue"
        :options="formattedRallies"
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

import { useSelectDataRally } from '../composables/select-data-rally.composable'

defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const { rallies, selectData } = useSelectDataRally({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const formattedRallies = computed(() => {
    return rallies.value.map((rally) => ({
        ...rally,
        label: [
            rally.calendar?.roundNumber ? `Fecha ${rally.calendar.roundNumber}` : null,
            rally.calendar?.eventName,
            rally.totalKm ? `${rally.totalKm} km` : null,
        ]
            .filter(Boolean)
            .join(' - '),
    }))
})

onMounted(() => {
    selectData()
})
</script>
