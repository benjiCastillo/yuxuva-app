<template>
    <Dialog v-model:visible="visible" modal header="Eliminar resultado de etapa" class="w-full md:w-1/3 lg:w-1/4 m-2">
        <section v-if="loading && !rallyStageResult" class="flex flex-row items-center align-center h-[20vh]">
            <ProgressSpinner
                style="width: 50px; height: 50px"
                strokeWidth="4"
                fill="transparent"
                animationDuration=".8s"
                aria-label="Cargando.." />
        </section>
        <section v-else-if="rallyStageResult?.id">
            <p>
                ¿Esta seguro de eliminar el resultado de la etapa
                <b>{{ resultLabel }}</b>
                ?
            </p>
            <p>Esta accion no se puede deshacer.</p>
            <div class="col-span-12 flex justify-between mt-4">
                <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" @click="closeModal()" />
                <Button
                    type="button"
                    label="Eliminar"
                    icon="pi pi-trash"
                    severity="danger"
                    :loading="loadingDelete"
                    :disabled="loadingDelete"
                    @click="deleteRallyStageResultById()" />
            </div>
        </section>
    </Dialog>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

import { formatStageLabel, formatTeamLabel } from '@/modules/rally-stage/utils/rally-stage-flow'

import { useGetRallyStageResult } from '../../composables/get-rally-stage-result.composable'
import { useDeleteRallyStageResult } from '../../composables/delete-rally-stage-result.composable'

const toast = useToast()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    rallyStageResultId: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const { findOne, rallyStageResult, loading } = useGetRallyStageResult({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const {
    rallyStageResult: deletedRallyStageResult,
    deleteRallyStageResult,
    loading: loadingDelete,
} = useDeleteRallyStageResult({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const resultLabel = computed(() => {
    return [
        formatStageLabel(rallyStageResult.value?.schedule?.stage),
        formatTeamLabel(rallyStageResult.value?.schedule?.team),
        rallyStageResult.value?.schedule?.startOrder ? `Orden ${rallyStageResult.value.schedule.startOrder}` : null,
    ]
        .filter(Boolean)
        .join(' - ')
})

const closeModal = () => {
    visible.value = false
}

const deleteRallyStageResultById = async () => {
    await deleteRallyStageResult(props.rallyStageResultId)
    if (deletedRallyStageResult.value) {
        onDeleted()
    }
}

const onDeleted = () => {
    closeModal()
    emit('success')
}

onMounted(() => {
    findOne(props.rallyStageResultId)
})
</script>
