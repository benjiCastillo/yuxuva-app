<template>
    <Dialog v-model:visible="visible" modal header="Agregar resultado de etapa" class="w-full md:w-2/3 lg:w-1/2 m-2">
        <RallyStageResultAddForm :scheduleId="scheduleId" :stageId="stageId" @created="onCreated" @close="closeModal" />
    </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'

import RallyStageResultAddForm from './RallyStageResultAddForm.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    scheduleId: {
        type: String,
        default: null,
    },
    stageId: {
        type: String,
        default: null,
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
