<template>
    <Field v-slot="{ field, errors }" :name="fieldName" :rules="rules">
        <label :for="fieldName" :class="className">{{ title }}</label>
        <Select
            :modelValue="field.value"
            :options="formattedSchedules"
            optionLabel="label"
            optionValue="id"
            fluid
            filter
            @update:modelValue="field.onChange" />
        <small v-if="errors.length" class="text-red-500">
            {{ errors[0] }}
        </small>
    </Field>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Field } from 'vee-validate'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'

import {
    formatCategoryLabel,
    formatStageEventLabel,
    formatStageLabel,
    formatTeamLabel,
} from '@/modules/rally-stage/utils/rally-stage-flow'

import { useSelectDataRallyStageSchedule } from '../composables/select-data-rally-stage-schedule.composable'

const props = defineProps({
    fieldName: {
        type: String,
        default: '',
    },
    title: {
        type: String,
        default: '',
    },
    rules: {
        type: String,
        default: '',
    },
    query: {
        type: Object,
        default: () => ({}),
    },
})

const toast = useToast()

const isRequired = computed(() => {
    return props.rules.includes('required')
})

const className = computed(() => {
    return ['block truncate-1 font-bold mb-1', isRequired.value ? 'required' : '']
})

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
            formatCategoryLabel(schedule.category),
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
