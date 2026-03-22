<template>
    <Dialog
        v-model:visible="visible"
        modal
        header="Eliminar programacion de etapa"
        class="w-full md:w-1/3 lg:w-1/4 m-2">
        <section v-if="loading && !rallyStageSchedule" class="flex flex-row items-center align-center h-[20vh]">
            <ProgressSpinner
                style="width: 50px; height: 50px"
                strokeWidth="4"
                fill="transparent"
                animationDuration=".8s"
                aria-label="Cargando.." />
        </section>
        <section v-else-if="rallyStageSchedule?.id">
            <p>
                ¿Esta seguro de eliminar la programacion
                <b>{{ scheduleLabel }}</b>
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
                    @click="deleteRallyStageScheduleById()" />
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

import { useGetRallyStageSchedule } from '../../composables/get-rally-stage-schedule.composable'
import { useDeleteRallyStageSchedule } from '../../composables/delete-rally-stage-schedule.composable'

const toast = useToast()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    rallyStageScheduleId: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const { findOne, rallyStageSchedule, loading } = useGetRallyStageSchedule({
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
    rallyStageSchedule: deletedRallyStageSchedule,
    deleteRallyStageSchedule,
    loading: loadingDelete,
} = useDeleteRallyStageSchedule({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const scheduleLabel = computed(() => {
    return [
        formatStageLabel(rallyStageSchedule.value?.stage),
        formatTeamLabel(rallyStageSchedule.value?.team),
        rallyStageSchedule.value?.startOrder ? `Orden ${rallyStageSchedule.value.startOrder}` : null,
    ]
        .filter(Boolean)
        .join(' - ')
})

const closeModal = () => {
    visible.value = false
}

const deleteRallyStageScheduleById = async () => {
    await deleteRallyStageSchedule(props.rallyStageScheduleId)
    if (deletedRallyStageSchedule.value) {
        closeModal()
        emit('success')
    }
}

onMounted(() => {
    findOne(props.rallyStageScheduleId)
})
</script>
