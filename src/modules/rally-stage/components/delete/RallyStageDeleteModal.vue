<template>
    <Dialog v-model:visible="visible" modal header="Eliminar etapa del rally" class="w-full md:w-1/3 lg:w-1/4 m-2">
        <section v-if="loading && !rallyStage" class="flex flex-row items-center align-center h-[20vh]">
            <ProgressSpinner
                style="width: 50px; height: 50px"
                strokeWidth="4"
                fill="transparent"
                animationDuration=".8s"
                aria-label="Cargando.." />
        </section>
        <section v-else-if="rallyStage?.id">
            <p>
                ¿Esta seguro de eliminar la etapa del rally
                <b>{{ rallyStage.name }}</b>
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
                    @click="deleteRallyStageById()" />
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

import { useGetRallyStage } from '../../composables/get-rally-stage.composable'
import { useDeleteRallyStage } from '../../composables/delete-rally-stage.composable'

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

const {
    rallyStage: deletedRallyStage,
    deleteRallyStage,
    loading: loadingDelete,
} = useDeleteRallyStage({
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

const deleteRallyStageById = async () => {
    await deleteRallyStage(props.rallyStageId)
    if (deletedRallyStage.value) {
        onDeleted()
    }
}

const onDeleted = () => {
    closeModal()
    emit('success')
}

onMounted(() => {
    findOne(props.rallyStageId)
})
</script>
