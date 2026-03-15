<template>
    <Form :initial-values="driverForm" class="grid grid-cols-12 gap-2 w-full" @submit="onSubmit">
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="text" fieldName="firstName" title="Nombres" rules="required|max:100" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="text" fieldName="lastName" title="Apellidos" rules="required|max:100" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <DocumentTypeSelect fieldName="documentType" title="Tipo de documento" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <InputTextCommon type="text" fieldName="documentNumber" title="Nro. documento" rules="required|max:30" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <InputTextCommon type="text" fieldName="licenseNumber" title="Nro. licencia" rules="required|max:60" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <InputTextCommon type="text" fieldName="nationality" title="Nacionalidad" rules="required|max:80" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <Field v-slot="{ field, errors }" name="birthDate" rules="required">
                <label for="birthDate" class="block truncate-1 font-bold mb-1 required">Fecha de nacimiento</label>
                <DatePicker
                    inputId="birthDate"
                    :modelValue="field.value"
                    dateFormat="yy-mm-dd"
                    showIcon
                    fluid
                    @update:modelValue="field.onChange" />
                <small v-if="errors.length" class="text-red-500">
                    {{ errors[0] }}
                </small>
            </Field>
        </div>
        <div class="col-span-12 md:col-span-4">
            <InputTextCommon type="text" fieldName="phone" title="Telefono" rules="required|max:30" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="email" fieldName="email" title="Correo" rules="required|max:120" />
        </div>
        <div class="col-span-12 md:col-span-3">
            <BloodTypeSelect fieldName="bloodType" title="Grupo sanguineo" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-3">
            <StatusSelect fieldName="status" title="Estado" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="text" fieldName="photoUrl" title="Foto URL" rules="max:255" />
        </div>
        <div class="col-span-12">
            <InputTextCommon type="text" fieldName="address" title="Direccion" rules="max:255" />
        </div>
        <div class="col-span-12 flex justify-between mt-4">
            <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="emit('close')" />
            <Button
                type="submit"
                label="Agregar"
                icon="pi pi-plus"
                severity="success"
                :loading="loading"
                :disabled="loading" />
        </div>
    </Form>
</template>

<script setup>
import { ref } from 'vue'
import { Field, Form } from 'vee-validate'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import { useToast } from 'primevue/usetoast'

import { setupValidation } from '@/shared/utils/setup-validation'
import { applyApiErrors } from '@/shared/utils/apply-api-errors'
import InputTextCommon from '@/shared/components/form-common/InputTextCommon.vue'

import StatusSelect from '../commons/StatusSelect.vue'
import DocumentTypeSelect from '../commons/DocumentTypeSelect.vue'
import BloodTypeSelect from '../commons/BloodTypeSelect.vue'
import { useCreateDriver } from '../../composables/create-driver.composable'

const emit = defineEmits(['created', 'close'])

const toast = useToast()

setupValidation()

const driverForm = ref({
    firstName: null,
    lastName: null,
    documentType: 'CI',
    documentNumber: null,
    licenseNumber: null,
    nationality: 'Boliviana',
    birthDate: null,
    phone: null,
    email: null,
    bloodType: 'O+',
    address: null,
    photoUrl: null,
    status: 'ACTIVE',
})

const { driver, createDriver, loading, errorState } = useCreateDriver({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const serializeValues = (values) => ({
    ...values,
    birthDate: values.birthDate instanceof Date ? values.birthDate.toISOString().split('T')[0] : values.birthDate,
    address: values.address || null,
    photoUrl: values.photoUrl || null,
})

const onSubmit = async (values, { setTouched, setFieldError }) => {
    setTouched(true, true)
    await createDriver(serializeValues(values))

    if (driver.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Exito',
            detail: `Piloto agregado correctamente ${driver.value.firstName} ${driver.value.lastName}`,
            life: 3000,
        })
        emit('created', driver.value)
        return
    }

    applyApiErrors(errorState.value, setFieldError)
}
</script>
