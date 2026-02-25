<template>
    <Dialog v-model:visible="visible" modal header="Eliminar campeonato" class="w-full md:w-1/3 lg:w-1/4 m-2">
        <section v-if="loading && !championship" class="flex flex-row items-center align-center h-[20vh]">
            <ProgressSpinner
                style="width: 50px; height: 50px"
                strokeWidth="4"
                fill="transparent"
                animationDuration=".8s"
                aria-label="Cargando.." />
        </section>
        <section v-else-if="championship?.id">
            <p>
                ¿Está seguro de eliminar el campeonato
                <b>{{ championship.name }}</b>
                ?
            </p>
            <p>Esta acción no se puede deshacer.</p>
            <div class="col-span-12 flex justify-between mt-4">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="closeModal()" />
                <Button
                    type="button"
                    label="Eliminar"
                    icon="pi pi-trash"
                    severity="danger"
                    :loading="loadingDelete"
                    :disabled="loadingDelete"
                    @click="deleteChampionshipById()" />
            </div>
        </section>
    </Dialog>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'

import { useGetChampionship } from '../../composables/get-championship.composable'
import { useDeleteChampionship } from '../../composables/delete-championship.composable'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    championshipId: {
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

const { findOne, championship, loading } = useGetChampionship({
    onError: (error, title) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const {
    championship: deletedChampionship,
    deleteChampionship,
    loading: loadingDelete,
} = useDeleteChampionship({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const deleteChampionshipById = async () => {
    await deleteChampionship(props.championshipId)
    if (deletedChampionship.value) {
        onDeleted()
    }
}

const onDeleted = () => {
    closeModal()
    emit('success')
}

onMounted(() => {
    findOne(props.championshipId)
})
</script>
