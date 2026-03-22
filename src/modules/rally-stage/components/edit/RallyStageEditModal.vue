<template>
    <Dialog v-model:visible="visible" modal header="Editar etapa del rally" class="w-full md:w-2/3 lg:w-1/2 m-2">
        <RallyStageEditForm v-if="rallyStage?.id" :rallyStage="rallyStage" @updated="onUpdated" @close="closeModal" />

        <section v-if="loading && !rallyStage" class="flex flex-row items-center align-center h-[20vh]">
            <ProgressSpinner
                style="width: 50px; height: 50px"
                strokeWidth="4"
                fill="transparent"
                animationDuration=".8s"
                aria-label="Cargando.." />
        </section>
    </Dialog>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'

import { useGetRallyStage } from '../../composables/get-rally-stage.composable'
import RallyStageEditForm from './RallyStageEditForm.vue'

const toast = useToast()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    rallyStageId: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const { findOne, rallyStage, loading } = useGetRallyStage({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const closeModal = () => {
    visible.value = false
}

const onUpdated = () => {
    closeModal()
    emit('success')
}

onMounted(() => {
    findOne(props.rallyStageId)
})
</script>
