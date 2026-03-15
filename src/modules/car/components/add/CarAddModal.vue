<template>
    <Dialog v-model:visible="visible" modal header="Agregar auto" class="w-full md:w-2/3 lg:w-1/2 m-2">
        <CarAddForm @created="onCreated" @close="closeModal" />
    </Dialog>
</template>
<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'

import CarAddForm from './CarAddForm.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const closeModal = () => {
    visible.value = false
}

const onCreated = () => {
    closeModal()
    emit('success')
}
</script>
