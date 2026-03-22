<template>
    <Select
        :modelValue="modelValue"
        :options="formattedRallyStages"
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

import { useSelectDataRallyStage } from '../composables/select-data-rally-stage.composable'

defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const { rallyStages, selectData } = useSelectDataRallyStage({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const formattedRallyStages = computed(() => {
    return rallyStages.value.map((rallyStage) => ({
        ...rallyStage,
        label: [
            rallyStage.stageOrder ? `ET ${rallyStage.stageOrder}` : null,
            rallyStage.name,
            rallyStage.rally?.calendar?.eventName,
        ]
            .filter(Boolean)
            .join(' - '),
    }))
})

onMounted(() => {
    selectData()
})
</script>
