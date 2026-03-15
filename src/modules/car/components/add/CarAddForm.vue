<template>
    <Form :initial-values="carForm" class="grid grid-cols-12 gap-2 w-full" @submit="onSubmit">
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="text" fieldName="brand" title="Marca" rules="required|max:100" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="text" fieldName="model" title="Modelo" rules="required|max:150" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="number" fieldName="year" title="Año" rules="required|numeric" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="text" fieldName="drivetrain" title="Tracción" rules="max:100" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <StatusSelect fieldName="status" title="Estado" rules="required" />
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
import { Form } from 'vee-validate'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

import { setupValidation } from '@/shared/utils/setup-validation'
import { applyApiErrors } from '@/shared/utils/apply-api-errors'
import InputTextCommon from '@/shared/components/form-common/InputTextCommon.vue'

import StatusSelect from '../commons/StatusSelect.vue'
import { useCreateCar } from '../../composables/create-car.composable'

const emit = defineEmits(['created', 'close'])

const toast = useToast()

setupValidation()

const carForm = ref({
    brand: null,
    model: null,
    year: new Date().getFullYear(),
    drivetrain: null,
    status: 'ACTIVE',
})

const { car, createCar, loading, errorState } = useCreateCar({
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
    const payload = {
        ...values,
        drivetrain: values.drivetrain || null,
        year: values.year ? Number(values.year) : null,
    }

    await createCar(payload)

    if (car.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Exito',
            detail: `Auto agregado correctamente ${car.value.brand} ${car.value.model}`,
            life: 3000,
        })
        emit('created', car.value)
        return
    }

    applyApiErrors(errorState.value, setFieldError)
}
</script>
