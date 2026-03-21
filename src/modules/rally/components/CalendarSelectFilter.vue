<template>
    <Select
        :modelValue="modelValue"
        :options="formattedCalendars"
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

import { useSelectDataChampionshipCalendar } from '@/modules/championship-calendar/composables/select-data-championship-calendar.composable'

defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const { championshipCalendars, selectData } = useSelectDataChampionshipCalendar({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const formattedCalendars = computed(() => {
    return championshipCalendars.value.map((calendar) => ({
        ...calendar,
        label: [
            calendar.roundNumber ? `Fecha ${calendar.roundNumber}` : null,
            calendar.eventName,
            [calendar.championship?.name, calendar.championship?.season].filter(Boolean).join(' - '),
        ]
            .filter(Boolean)
            .join(' - '),
    }))
})

onMounted(() => {
    selectData()
})
</script>
