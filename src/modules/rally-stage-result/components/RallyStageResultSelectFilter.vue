<template>
    <Select
        :modelValue="modelValue"
        :options="formattedResults"
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

import { useSelectDataRallyStageResult } from '../composables/select-data-rally-stage-result.composable'

defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const { rallyStageResults, selectData } = useSelectDataRallyStageResult({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const formattedResults = computed(() => {
    return rallyStageResults.value.map((result) => ({
        ...result,
        label: [
            result.stage?.stageOrder ? `ET ${result.stage.stageOrder}` : null,
            result.stage?.name,
            result.team?.competitionNo ? `#${result.team.competitionNo}` : null,
        ]
            .filter(Boolean)
            .join(' - '),
    }))
})

onMounted(() => {
    selectData()
})
</script>
