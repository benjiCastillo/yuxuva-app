<template>
    <Dialog
        v-model:visible="visible"
        modal
        header="Editar asociacion departamental"
        class="w-full md:w-1/3 lg:w-1/4 m-2">
        <DepartmentAssociationEditForm
            v-if="departmentAssociation?.id"
            :departmentAssociation="departmentAssociation"
            @updated="onUpdated"
            @close="closeModal" />

        <section v-if="loading && !departmentAssociation" class="flex flex-row items-center align-center h-[20vh]">
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

import { useGetDepartmentAssociation } from '../../composables/get-department-association.composable'
import DepartmentAssociationEditForm from './DepartmentAssociationEditForm.vue'

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

const closeModal = () => {
    visible.value = false
}

const onUpdated = () => {
    closeModal()
    emit('success')
}

onMounted(() => {
    findOne(props.departmentAssociationId)
})
</script>
