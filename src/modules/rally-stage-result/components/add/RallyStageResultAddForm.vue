<template>
    <Form :initial-values="rallyStageResultForm" class="grid grid-cols-12 gap-2 w-full" @submit="onSubmit">
        <div class="col-span-12 md:col-span-6">
            <RallyStageSelect fieldName="stageId" title="Etapa" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <TeamSelect fieldName="teamId" title="Equipo" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <Field v-slot="{ field, errors }" name="startTime" rules="required">
                <label for="startTime" class="block truncate-1 font-bold mb-1 required">Hora de salida</label>
                <DatePicker
                    inputId="startTime"
                    :modelValue="field.value"
                    showTime
                    showSeconds
                    hourFormat="24"
                    fluid
                    @update:modelValue="field.onChange" />
                <small v-if="errors.length" class="text-red-500">
                    {{ errors[0] }}
                </small>
            </Field>
        </div>
        <div class="col-span-12 md:col-span-2">
            <InputTextCommon type="text" fieldName="startTimeMs" title="Ms. salida" rules="required|numeric|max:3" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <Field v-slot="{ field, errors }" name="endTime" rules="required">
                <label for="endTime" class="block truncate-1 font-bold mb-1 required">Hora de llegada</label>
                <DatePicker
                    inputId="endTime"
                    :modelValue="field.value"
                    showTime
                    showSeconds
                    hourFormat="24"
                    fluid
                    @update:modelValue="field.onChange" />
                <small v-if="errors.length" class="text-red-500">
                    {{ errors[0] }}
                </small>
            </Field>
        </div>

        <div class="col-span-12 md:col-span-2">
            <InputTextCommon type="text" fieldName="endTimeMs" title="Ms. llegada" rules="required|numeric|max:3" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon
                type="number"
                step="0.001"
                fieldName="penaltyValue"
                title="Penalización"
                rules="required|decimal|min_value:0" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <PenaltyUnitSelect fieldName="penaltyUnit" title="Unidad de penalización" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-2">
            <StatusSelect fieldName="status" title="Estado" rules="required" />
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
import { Field, Form } from 'vee-validate'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import { useToast } from 'primevue/usetoast'

import { setupValidation } from '@/shared/utils/setup-validation'
import { applyApiErrors } from '@/shared/utils/apply-api-errors'
import InputTextCommon from '@/shared/components/form-common/InputTextCommon.vue'
import RallyStageSelect from '@/modules/rally-stage/components/RallyStageSelect.vue'
import TeamSelect from '@/modules/team/components/TeamSelect.vue'

import PenaltyUnitSelect from '../commons/PenaltyUnitSelect.vue'
import StatusSelect from '../commons/StatusSelect.vue'
import { useCreateRallyStageResult } from '../../composables/create-rally-stage-result.composable'

const emit = defineEmits(['created', 'close'])

const toast = useToast()

setupValidation()

const combineDateTimeMs = (value, milliseconds) => {
    if (!(value instanceof Date)) {
        return null
    }

    const parsedMs = Number(String(milliseconds ?? '').padStart(3, '0'))
    if (Number.isNaN(parsedMs) || parsedMs < 0 || parsedMs > 999) {
        return null
    }

    const nextDate = new Date(value)
    nextDate.setMilliseconds(parsedMs)
    return nextDate
}

const convertPenaltyToMilliseconds = (value, unit) => {
    const numericValue = Number(value)

    if (Number.isNaN(numericValue) || numericValue < 0) {
        return null
    }

    const factors = {
        ms: 1,
        s: 1000,
        m: 60000,
    }

    const factor = factors[unit]

    if (!factor) {
        return null
    }

    return Math.round(numericValue * factor)
}

const rallyStageResultForm = ref({
    stageId: null,
    teamId: null,
    startTime: null,
    endTime: null,
    startTimeMs: '000',
    endTimeMs: '000',
    penaltyValue: 0,
    penaltyUnit: 'ms',
    status: 'OK',
})

const { rallyStageResult, createRallyStageResult, loading, errorState } = useCreateRallyStageResult({
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
    stageId: values.stageId,
    teamId: values.teamId,
    startTime: combineDateTimeMs(values.startTime, values.startTimeMs)?.toISOString() ?? values.startTime,
    endTime: combineDateTimeMs(values.endTime, values.endTimeMs)?.toISOString() ?? values.endTime,
    penalty: convertPenaltyToMilliseconds(values.penaltyValue, values.penaltyUnit),
    status: values.status,
})

const onSubmit = async (values, { setTouched, setFieldError }) => {
    setTouched(true, true)

    const startTimeDate = combineDateTimeMs(values.startTime, values.startTimeMs)
    const endTimeDate = combineDateTimeMs(values.endTime, values.endTimeMs)

    if (!startTimeDate) {
        setFieldError('startTimeMs', 'Los milisegundos de salida deben estar entre 000 y 999')
        return
    }

    if (!endTimeDate) {
        setFieldError('endTimeMs', 'Los milisegundos de llegada deben estar entre 000 y 999')
        return
    }

    if (convertPenaltyToMilliseconds(values.penaltyValue, values.penaltyUnit) === null) {
        setFieldError('penaltyValue', 'La penalización debe ser un número válido')
        return
    }

    if (startTimeDate && endTimeDate && endTimeDate < startTimeDate) {
        setFieldError('endTime', 'La hora de llegada debe ser mayor o igual a la de salida')
        return
    }

    await createRallyStageResult(serializeValues(values))

    if (rallyStageResult.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Resultado de etapa agregado correctamente',
            life: 3000,
        })
        emit('created', rallyStageResult.value)
        return
    }

    applyApiErrors(errorState.value, setFieldError)
}
</script>
