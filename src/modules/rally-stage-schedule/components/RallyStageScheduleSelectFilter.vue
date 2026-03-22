<template>
    <Select
        :modelValue="modelValue"
        :options="formattedSchedules"
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

import { formatStageEventLabel, formatStageLabel, formatTeamLabel } from '@/modules/rally-stage/utils/rally-stage-flow'

import { useSelectDataRallyStageSchedule } from '../composables/select-data-rally-stage-schedule.composable'

const props = defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
    query: {
        type: Object,
        default: () => ({}),
    },
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const { rallyStageSchedules, selectData } = useSelectDataRallyStageSchedule({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const formattedSchedules = computed(() => {
    return rallyStageSchedules.value.map((schedule) => ({
        ...schedule,
        label: [
            formatStageLabel(schedule.stage),
            formatTeamLabel(schedule.team),
            schedule.startOrder ? `Orden ${schedule.startOrder}` : null,
            formatStageEventLabel(schedule.stage),
        ]
            .filter(Boolean)
            .join(' - '),
    }))
})

onMounted(() => {
    selectData(props.query)
})
</script>
