<template>
    <Field v-slot="{ field, errors }" :name="fieldName" :rules="rules">
        <label :for="fieldName" :class="className">{{ title }}</label>
        <InputText v-bind="field" :type="type" :class="uppercase ? 'uppercase' : ''" :maxLength="maxLength" fluid />
        <small v-if="errors.length" class="text-red-500">
            {{ errors[0] }}
        </small>
    </Field>
</template>
<script setup>
import { computed } from 'vue'
import { Field } from 'vee-validate'
import InputText from 'primevue/inputtext'
import { getRuleValue } from '@/shared/utils/get-rule-value'

const props = defineProps({
    atcPaso: {
        type: Object,
        default: {},
    },
    fieldName: {
        type: String,
        default: '',
    },
    rules: {
        type: String,
        default: '',
    },
    title: {
        type: String,
        default: '',
    },
    uppercase: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'text',
    },
})

const isRequired = computed(() => {
    return props.rules.includes('required')
})

const maxLength = computed(() => {
    return getRuleValue(props.rules, 'max')
})

const className = computed(() => {
    return [
        'block truncate-1 font-bold mb-1 text-slate-700 dark:text-slate-200',
        isRequired.value ? 'required' : '',
    ]
})
</script>
