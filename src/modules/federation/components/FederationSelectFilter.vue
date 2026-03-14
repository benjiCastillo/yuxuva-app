<template>
    <Select
        :modelValue="modelValue"
        :options="federations"
        optionLabel="acronym"
        optionValue="id"
        fluid
        filter
        @update:modelValue="emit('update:modelValue', $event)" />
</template>

<script setup>
import { onMounted } from 'vue'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'

import { useSelectDataFederation } from '../composables/select-data-federation.composable'

defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const { federations, selectData } = useSelectDataFederation({
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
