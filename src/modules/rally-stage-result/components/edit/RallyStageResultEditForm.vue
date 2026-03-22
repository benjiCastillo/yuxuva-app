<template>
    <Form
        v-if="rallyStageResultForm"
        :initial-values="rallyStageResultForm"
        class="grid grid-cols-12 gap-2 w-full"
        @submit="onSubmit">
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
        <div class="col-span-12 md:col-span-4">
            <InputTextCommon
                type="number"
                step="0.001"
                fieldName="penaltyValue"
                title="Penalización"
                rules="required|decimal|min_value:0" />
        </div>
        <div class="col-span-12 md:col-span-2">
            <PenaltyUnitSelect fieldName="penaltyUnit" title="Unidad de penalización" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <StatusSelect fieldName="status" title="Estado" rules="required" />
        </div>
        <div class="col-span-12 flex justify-between mt-4">
            <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" @click="emit('close')" />
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
import { useUpdateRallyStageResult } from '../../composables/update-rally-stage-result.composable'

const emit = defineEmits(['updated', 'close'])

const props = defineProps({
    rallyStageResult: {
        type: Object,
        default: null,
    },
})

const toast = useToast()

setupValidation()

const splitDateTimeMs = (value) => {
    if (!value) {
        return {
            date: null,
            milliseconds: '000',
        }
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return {
            date: null,
            milliseconds: '000',
        }
    }

    const milliseconds = String(date.getMilliseconds()).padStart(3, '0')
    date.setMilliseconds(0)

    return {
        date,
        milliseconds,
    }
}

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

const splitPenalty = (value) => {
    const numericValue = Number(value ?? 0)

    if (Number.isNaN(numericValue) || numericValue < 0) {
        return {
            value: 0,
            unit: 'ms',
        }
    }

    if (numericValue !== 0 && numericValue % 60000 === 0) {
        return {
            value: numericValue / 60000,
            unit: 'm',
        }
    }

    if (numericValue !== 0 && numericValue % 1000 === 0) {
        return {
            value: numericValue / 1000,
            unit: 's',
        }
    }

    return {
        value: numericValue,
        unit: 'ms',
    }
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

const startTimeParts = splitDateTimeMs(props.rallyStageResult?.startTime)
const endTimeParts = splitDateTimeMs(props.rallyStageResult?.endTime)
const penaltyParts = splitPenalty(props.rallyStageResult?.penalty)

const rallyStageResultForm = ref({
    stageId: props.rallyStageResult?.stageId,
    teamId: props.rallyStageResult?.teamId,
    startTime: startTimeParts.date,
    endTime: endTimeParts.date,
    startTimeMs: startTimeParts.milliseconds,
    endTimeMs: endTimeParts.milliseconds,
    penaltyValue: penaltyParts.value,
    penaltyUnit: penaltyParts.unit,
    status: props.rallyStageResult?.status,
})

const {
    rallyStageResult: updatedRallyStageResult,
    updateRallyStageResult,
    loading,
    errorState,
} = useUpdateRallyStageResult({
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

    await updateRallyStageResult(props.rallyStageResult.id, serializeValues(values))

    if (updatedRallyStageResult.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Resultado de etapa modificado correctamente',
            life: 3000,
        })
        emit('updated', updatedRallyStageResult.value)
        return
    }

    applyApiErrors(errorState.value, setFieldError)
}
</script>
