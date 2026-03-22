<template>
    <Field v-slot="{ field, errors }" :name="fieldName" :rules="rules">
        <label :for="fieldName" :class="className">{{ title }}</label>
        <Select
            :modelValue="field.value"
            :options="units"
            optionLabel="name"
            optionValue="value"
            fluid
            @update:modelValue="field.onChange" />
        <small v-if="errors.length" class="text-red-500">
            {{ errors[0] }}
        </small>
    </Field>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Field } from 'vee-validate'
import Select from 'primevue/select'

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

const units = ref([
    { name: 'Milisegundos', value: 'ms' },
    { name: 'Segundos', value: 's' },
    { name: 'Minutos', value: 'm' },
])

const isRequired = computed(() => {
    return props.rules.includes('required')
})

const className = computed(() => {
    return ['block truncate-1 font-bold mb-1', isRequired.value ? 'required' : '']
})
</script>
