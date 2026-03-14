<template>
    <Dialog
        v-model:visible="visible"
        modal
        header="Eliminar asociacion departamental"
        class="w-full md:w-1/3 lg:w-1/4 m-2">
        <section v-if="loading && !departmentAssociation" class="flex flex-row items-center align-center h-[20vh]">
            <ProgressSpinner
                style="width: 50px; height: 50px"
                strokeWidth="4"
                fill="transparent"
                animationDuration=".8s"
                aria-label="Cargando.." />
        </section>
        <section v-else-if="departmentAssociation?.id">
            <p>
                ¿Esta seguro de eliminar la asociacion departamental
                <b>{{ departmentAssociation.name }}</b>
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
                    @click="deleteDepartmentAssociationById()" />
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

import { useGetDepartmentAssociation } from '../../composables/get-department-association.composable'
import { useDeleteDepartmentAssociation } from '../../composables/delete-department-association.composable'

const toast = useToast()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    departmentAssociationId: {
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

const { findOne, departmentAssociation, loading } = useGetDepartmentAssociation({
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
    departmentAssociation: deletedDepartmentAssociation,
    deleteDepartmentAssociation,
    loading: loadingDelete,
} = useDeleteDepartmentAssociation({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const deleteDepartmentAssociationById = async () => {
    await deleteDepartmentAssociation(props.departmentAssociationId)
    if (deletedDepartmentAssociation.value) {
        onDeleted()
    }
}

const onDeleted = () => {
    closeModal()
    emit('success')
}

onMounted(() => {
    findOne(props.departmentAssociationId)
})
</script>
