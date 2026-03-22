<template>
    <Form
        v-if="rallyStageScheduleForm"
        v-slot="{ values, setFieldValue }"
        :initial-values="rallyStageScheduleForm"
        class="grid grid-cols-12 gap-2 w-full"
        @submit="onSubmit">
        <div class="col-span-12 md:col-span-6">
            <RallyStageSelect
                fieldName="stageId"
                title="Etapa"
                rules="required"
                @update:modelValue="handleScheduleContextChange(setFieldValue)" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <CategorySelect
                fieldName="categoryId"
                title="Categoria"
                rules="required"
                @update:modelValue="handleScheduleContextChange(setFieldValue)" />
        </div>
        <div class="col-span-12">
            <TeamSelect
                fieldName="teamId"
                title="Equipo"
                rules="required"
                :disabled="!values.stageId || !values.categoryId"
                :query="buildEditTeamsQuery(values.stageId, values.categoryId)" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <InputTextCommon
                type="number"
                fieldName="startOrder"
                title="Orden de partida en categoria"
                rules="required|numeric" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <StatusSelect fieldName="status" title="Estado" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <Field v-slot="{ field, errors }" name="scheduledStartTime">
                <label for="scheduledStartTime" class="block truncate-1 font-bold mb-1">Hora programada</label>
                <DatePicker
                    inputId="scheduledStartTime"
                    :modelValue="field.value"
                    showTime
                    showSeconds
                    hourFormat="24"
                    showIcon
                    iconDisplay="input"
                    fluid
                    showButtonBar
                    @update:modelValue="field.onChange" />
                <small v-if="errors.length" class="text-red-500">
                    {{ errors[0] }}
                </small>
            </Field>
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
import CategorySelect from '@/modules/category/components/CategorySelect.vue'
import TeamSelect from '@/modules/team/components/TeamSelect.vue'

import StatusSelect from '../commons/StatusSelect.vue'
import { useUpdateRallyStageSchedule } from '../../composables/update-rally-stage-schedule.composable'

const emit = defineEmits(['updated', 'close'])

const props = defineProps({
    rallyStageSchedule: {
        type: Object,
        default: null,
    },
})

const toast = useToast()

setupValidation()

const rallyStageScheduleForm = ref({
    stageId: props.rallyStageSchedule?.stageId,
    categoryId: props.rallyStageSchedule?.categoryId,
    teamId: props.rallyStageSchedule?.teamId,
    startOrder: props.rallyStageSchedule?.startOrder,
    scheduledStartTime: props.rallyStageSchedule?.scheduledStartTime
        ? new Date(props.rallyStageSchedule.scheduledStartTime)
        : null,
    status: props.rallyStageSchedule?.status,
})

const buildEditTeamsQuery = (stageId, categoryId) => {
    if (!stageId || !categoryId) {
        return {}
    }

    return {
        stageId,
        categoryId,
    }
}

const handleScheduleContextChange = (setFieldValue) => {
    setFieldValue('teamId', null)
}

const {
    rallyStageSchedule: updatedRallyStageSchedule,
    updateRallyStageSchedule,
    loading,
    errorState,
} = useUpdateRallyStageSchedule({
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
    categoryId: values.categoryId,
    teamId: values.teamId,
    startOrder: Number(values.startOrder),
    scheduledStartTime: values.scheduledStartTime ? new Date(values.scheduledStartTime).toISOString() : null,
    status: values.status,
})

const onSubmit = async (values, { setTouched, setFieldError }) => {
    setTouched(true, true)

    if (!values.stageId || !values.categoryId) {
        if (!values.stageId) {
            setFieldError('stageId', 'Debe seleccionar una etapa')
        }
        if (!values.categoryId) {
            setFieldError('categoryId', 'Debe seleccionar una categoria')
        }
        return
    }

    await updateRallyStageSchedule(props.rallyStageSchedule.id, serializeValues(values))

    if (updatedRallyStageSchedule.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Programacion de etapa modificada correctamente',
            life: 3000,
        })
        emit('updated', updatedRallyStageSchedule.value)
        return
    }

    applyApiErrors(errorState.value, setFieldError)
}
</script>
