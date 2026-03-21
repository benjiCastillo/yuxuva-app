<template>
    <Field v-slot="{ field, errors }" :name="fieldName" :rules="rules">
        <label :for="fieldName" :class="className">{{ title }}</label>
        <Select
            :modelValue="field.value"
            :options="formattedRallies"
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

import { useSelectDataRally } from '../composables/select-data-rally.composable'

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
})

const toast = useToast()

const isRequired = computed(() => {
    return props.rules.includes('required')
})

const className = computed(() => {
    return ['block truncate-1 font-bold mb-1', isRequired.value ? 'required' : '']
})

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
