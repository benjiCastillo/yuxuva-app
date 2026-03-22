<template>
    <Field v-slot="{ field, errors }" :name="fieldName" :rules="rules">
        <label :for="fieldName" :class="className">{{ title }}</label>
        <Select
            :modelValue="field.value"
            :options="formattedCategories"
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

import { useSelectDataCategory } from '../composables/select-data-category.composable'

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

const { categories, selectData } = useSelectDataCategory({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const formattedCategories = computed(() => {
    return categories.value.map((category) => ({
        ...category,
        label: [category.name, category.modality].filter(Boolean).join(' - '),
    }))
})

onMounted(() => {
    selectData()
})
</script>
