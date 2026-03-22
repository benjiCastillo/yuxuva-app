<template>
    <Field v-slot="{ field, errors }" :name="fieldName" :rules="rules">
        <label :for="fieldName" :class="className">{{ title }}</label>
        <Select
            :modelValue="field.value"
            :options="formattedTeams"
            optionLabel="label"
            optionValue="id"
            :disabled="disabled"
            fluid
            filter
            @update:modelValue="
                (value) => {
                    field.onChange(value)
                    emit('update:modelValue', value)
                }
            " />
        <small v-if="errors.length" class="text-red-500">
            {{ errors[0] }}
        </small>
    </Field>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { Field } from 'vee-validate'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'

import { useSelectDataTeam } from '../composables/select-data-team.composable'

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
    disabled: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const isRequired = computed(() => {
    return props.rules.includes('required')
})

const className = computed(() => {
    return ['block truncate-1 font-bold mb-1', isRequired.value ? 'required' : '']
})

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

watch(
    () => props.disabled,
    (disabled) => {
        if (disabled) {
            selectData({})
        }
    }
)
</script>
