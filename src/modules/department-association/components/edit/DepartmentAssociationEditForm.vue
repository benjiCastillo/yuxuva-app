<template>
    <Form
        v-if="departmentAssociationForm"
        :initial-values="departmentAssociationForm"
        class="grid grid-cols-12 gap-2 w-full"
        @submit="onSubmit">
        <div class="col-span-12">
            <InputTextCommon type="text" fieldName="name" title="Nombre" rules="required|max:200" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <DepartmentSelect fieldName="department" title="Departamento" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <StatusSelect fieldName="status" title="Estado" rules="required" />
        </div>
        <div class="col-span-12">
            <FederationSelect fieldName="federationId" title="Federación" rules="required" />
        </div>
        <div class="col-span-12 flex justify-between mt-4">
            <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="emit('close')" />
            <Button
                type="submit"
                label="Modificar"
                icon="pi pi-pencil"
                severity="warn"
                :loading="loading"
                :disabled="loading" />
        </div>
    </Form>
</template>

<script setup>
import { ref } from 'vue'
import { Form } from 'vee-validate'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

import { setupValidation } from '@/shared/utils/setup-validation'
import { applyApiErrors } from '@/shared/utils/apply-api-errors'
import InputTextCommon from '@/shared/components/form-common/InputTextCommon.vue'
import FederationSelect from '@/modules/federation/components/FederationSelect.vue'

import DepartmentSelect from '../commons/DepartmentSelect.vue'
import StatusSelect from '../commons/StatusSelect.vue'
import { useUpdateDepartmentAssociation } from '../../composables/update-department-association.composable'

const emit = defineEmits(['updated', 'close'])

const props = defineProps({
    departmentAssociation: {
        type: Object,
        default: null,
    },
})

const toast = useToast()

setupValidation()

const normalizeDepartment = (department) => {
    if (!department) {
        return null
    }

    return department
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
}

const departmentAssociationForm = ref({
    name: props.departmentAssociation?.name,
    department: normalizeDepartment(props.departmentAssociation?.department),
    status: props.departmentAssociation?.status,
    federationId: props.departmentAssociation?.federationId,
})

const {
    departmentAssociation: departmentAssociationUpdated,
    updateDepartmentAssociation,
    loading,
    errorState,
} = useUpdateDepartmentAssociation({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const onSubmit = async (values, { setTouched, setFieldError }) => {
    setTouched(true, true)
    await updateDepartmentAssociation(props.departmentAssociation.id, values)

    if (departmentAssociationUpdated.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Exito',
            detail: `Asociacion departamental modificada correctamente ${departmentAssociationUpdated.value.name}`,
            life: 3000,
        })
        emit('updated', departmentAssociationUpdated.value)
        return
    }

    applyApiErrors(errorState.value, setFieldError)
}
</script>
