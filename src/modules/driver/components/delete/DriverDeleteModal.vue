<template>
    <Dialog v-model:visible="visible" modal header="Eliminar piloto" class="w-full md:w-1/3 lg:w-1/4 m-2">
        <section v-if="loading && !driver" class="flex flex-row items-center align-center h-[20vh]">
            <ProgressSpinner
                style="width: 50px; height: 50px"
                strokeWidth="4"
                fill="transparent"
                animationDuration=".8s"
                aria-label="Cargando.." />
        </section>
        <section v-else-if="driver?.id">
            <p>
                ¿Esta seguro de eliminar al piloto
                <b>{{ driver.firstName }} {{ driver.lastName }}</b>
                ?
            </p>
            <p>Esta accion no se puede deshacer.</p>
            <div class="col-span-12 flex justify-between mt-4">
                <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="closeModal()" />
                <Button
                    type="button"
                    label="Eliminar"
                    icon="pi pi-trash"
                    severity="danger"
                    :loading="loadingDelete"
                    :disabled="loadingDelete"
                    @click="deleteDriverById()" />
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

import { useGetDriver } from '../../composables/get-driver.composable'
import { useDeleteDriver } from '../../composables/delete-driver.composable'

const toast = useToast()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    driverId: {
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

const { findOne, driver, loading } = useGetDriver({
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
    driver: deletedDriver,
    deleteDriver,
    loading: loadingDelete,
} = useDeleteDriver({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const deleteDriverById = async () => {
    await deleteDriver(props.driverId)
    if (deletedDriver.value) {
        onDeleted()
    }
}

const onDeleted = () => {
    closeModal()
    emit('success')
}

onMounted(() => {
    findOne(props.driverId)
})
</script>
