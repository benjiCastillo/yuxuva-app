<template>
    <Select
        :modelValue="modelValue"
        :options="formattedTeams"
        optionLabel="label"
        optionValue="id"
        fluid
        filter
        autoFilterFocus
        showClear
        @update:modelValue="emit('update:modelValue', $event)" />
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'

import { useSelectDataTeam } from '../composables/select-data-team.composable'

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

const { teams, selectData } = useSelectDataTeam({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const formattedTeams = computed(() => {
    return teams.value.map((team) => ({
        ...team,
        label: [
            team.competitionNo ? `#${team.competitionNo}` : null,
            [team.driver?.firstName, team.driver?.lastName].filter(Boolean).join(' '),
            [team.carBrand, team.carModel, team.carYear].filter(Boolean).join(' '),
        ]
            .filter(Boolean)
            .join(' - '),
    }))
})

onMounted(() => {
    selectData(props.query)
})

watch(
    () => props.query,
    (query) => {
        selectData(query)
    },
    { deep: true }
)
</script>
