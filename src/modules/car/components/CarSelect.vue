<template>
    <Field v-slot="{ field, errors }" :name="fieldName" :rules="rules">
        <label :for="fieldName" :class="className">{{ title }}</label>
        <Select
            :modelValue="field.value"
            :options="formattedCars"
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

import { useSelectDataCar } from '../composables/select-data-car.composable'

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

const { cars, selectData } = useSelectDataCar({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const formattedCars = computed(() => {
    return cars.value.map((car) => ({
        ...car,
        label: [car.brand, car.model, car.year].filter(Boolean).join(' '),
    }))
})

onMounted(() => {
    selectData()
})
</script>
