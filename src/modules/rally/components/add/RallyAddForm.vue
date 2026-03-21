<template>
    <Form :initial-values="rallyForm" class="grid grid-cols-12 gap-2 w-full" @submit="onSubmit">
        <div class="col-span-12">
            <CalendarSelect fieldName="calendarId" title="Fecha del calendario" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="number" fieldName="totalKm" title="Kilometraje total" rules="required|numeric" />
        </div>
        <div class="col-span-12 flex justify-between mt-4">
            <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" @click="emit('close')" />
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

import CalendarSelect from '../CalendarSelect.vue'
import { useCreateRally } from '../../composables/create-rally.composable'

const emit = defineEmits(['created', 'close'])

const toast = useToast()

setupValidation()

const rallyForm = ref({
    calendarId: null,
    totalKm: null,
})

const { rally, createRally, loading, errorState } = useCreateRally({
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
    totalKm: Number(values.totalKm),
})

const onSubmit = async (values, { setTouched, setFieldError }) => {
    setTouched(true, true)
    await createRally(serializeValues(values))

    if (rally.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Rally agregado correctamente',
            life: 3000,
        })
        emit('created', rally.value)
        return
    }

    applyApiErrors(errorState.value, setFieldError)
}
</script>
