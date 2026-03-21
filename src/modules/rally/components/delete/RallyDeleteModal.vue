<template>
    <Dialog v-model:visible="visible" modal header="Eliminar rally" class="w-full md:w-1/3 lg:w-1/4 m-2">
        <section v-if="loading && !rally" class="flex flex-row items-center align-center h-[20vh]">
            <ProgressSpinner
                style="width: 50px; height: 50px"
                strokeWidth="4"
                fill="transparent"
                animationDuration=".8s"
                aria-label="Cargando.." />
        </section>
        <section v-else-if="rally?.id">
            <p>
                ¿Esta seguro de eliminar el rally
                <b>{{ rallyLabel }}</b>
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
                    @click="deleteRallyById()" />
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

import { useGetRally } from '../../composables/get-rally.composable'
import { useDeleteRally } from '../../composables/delete-rally.composable'

const toast = useToast()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    rallyId: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const { findOne, rally, loading } = useGetRally({
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
    rally: deletedRally,
    deleteRally,
    loading: loadingDelete,
} = useDeleteRally({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const rallyLabel = computed(() => {
    return [
        rally.value?.calendar?.roundNumber ? `Fecha ${rally.value.calendar.roundNumber}` : null,
        rally.value?.calendar?.eventName,
    ]
        .filter(Boolean)
        .join(' - ')
})

const closeModal = () => {
    visible.value = false
}

const deleteRallyById = async () => {
    await deleteRally(props.rallyId)
    if (deletedRally.value) {
        onDeleted()
    }
}

const onDeleted = () => {
    closeModal()
    emit('success')
}

onMounted(() => {
    findOne(props.rallyId)
})
</script>
