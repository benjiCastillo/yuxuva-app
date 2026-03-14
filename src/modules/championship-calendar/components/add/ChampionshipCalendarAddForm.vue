<template>
    <Form :initial-values="championshipCalendarForm" class="grid grid-cols-12 gap-2 w-full" @submit="onSubmit">
        <div class="col-span-12 md:col-span-6">
            <ChampionshipSelect fieldName="championshipId" title="Campeonato" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <DepartmentAssociationSelect fieldName="associationId" title="Asociacion" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <InputTextCommon type="number" fieldName="roundNumber" title="Nro. de fecha" rules="required|numeric" />
        </div>
        <div class="col-span-12 md:col-span-8">
            <InputTextCommon type="text" fieldName="eventName" title="Nombre del evento" rules="required|max:200" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <Field v-slot="{ field, errors }" name="startDate" rules="required">
                <label for="startDate" class="block truncate-1 font-bold mb-1 required">Fecha de inicio</label>
                <DatePicker
                    inputId="startDate"
                    :modelValue="field.value"
                    showTime
                    hourFormat="24"
                    fluid
                    @update:modelValue="field.onChange" />
                <small v-if="errors.length" class="text-red-500">
                    {{ errors[0] }}
                </small>
            </Field>
        </div>
        <div class="col-span-12 md:col-span-6">
            <Field v-slot="{ field, errors }" name="endDate" rules="required">
                <label for="endDate" class="block truncate-1 font-bold mb-1 required">Fecha de fin</label>
                <DatePicker
                    inputId="endDate"
                    :modelValue="field.value"
                    showTime
                    hourFormat="24"
                    fluid
                    @update:modelValue="field.onChange" />
                <small v-if="errors.length" class="text-red-500">
                    {{ errors[0] }}
                </small>
            </Field>
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
import { Field, Form } from 'vee-validate'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import { useToast } from 'primevue/usetoast'

import { setupValidation } from '@/shared/utils/setup-validation'
import { applyApiErrors } from '@/shared/utils/apply-api-errors'
import InputTextCommon from '@/shared/components/form-common/InputTextCommon.vue'
import ChampionshipSelect from '@/modules/championship/components/ChampionshipSelect.vue'
import DepartmentAssociationSelect from '@/modules/department-association/components/DepartmentAssociationSelect.vue'

import StatusSelect from '../commons/StatusSelect.vue'
import { useCreateChampionshipCalendar } from '../../composables/create-championship-calendar.composable'

const emit = defineEmits(['created', 'close'])

const toast = useToast()

setupValidation()

const championshipCalendarForm = ref({
    championshipId: null,
    associationId: null,
    roundNumber: 1,
    eventName: null,
    startDate: null,
    endDate: null,
    status: 'SCHEDULED',
})

const { championshipCalendar, createChampionshipCalendar, loading, errorState } = useCreateChampionshipCalendar({
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
    roundNumber: Number(values.roundNumber),
    startDate: values.startDate instanceof Date ? values.startDate.toISOString() : values.startDate,
    endDate: values.endDate instanceof Date ? values.endDate.toISOString() : values.endDate,
})

const onSubmit = async (values, { setTouched, setFieldError }) => {
    setTouched(true, true)
    await createChampionshipCalendar(serializeValues(values))

    if (championshipCalendar.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Exito',
            detail: `Fecha del calendario agregada correctamente ${championshipCalendar.value.eventName}`,
            life: 3000,
        })
        emit('created', championshipCalendar.value)
        return
    }

    applyApiErrors(errorState.value, setFieldError)
}
</script>
