<template>
    <Form
        v-if="rallyStageForm"
        :initial-values="rallyStageForm"
        class="grid grid-cols-12 gap-2 w-full"
        @submit="onSubmit">
        <div class="col-span-12">
            <RallySelect fieldName="rallyId" title="Rally" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-8">
            <InputTextCommon type="text" fieldName="name" title="Nombre de la etapa" rules="required|max:200" />
        </div>
        <div class="col-span-12 md:col-span-4">
            <InputTextCommon type="number" fieldName="stageOrder" title="Orden de etapa" rules="required|numeric" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <StageTypeSelect fieldName="stageType" title="Tipo de etapa" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon
                type="number"
                step="0.1"
                fieldName="distanceKm"
                title="Distancia (km)"
                rules="required|decimal" />
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
import { Form } from 'vee-validate'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

import { setupValidation } from '@/shared/utils/setup-validation'
import { applyApiErrors } from '@/shared/utils/apply-api-errors'
import InputTextCommon from '@/shared/components/form-common/InputTextCommon.vue'
import RallySelect from '@/modules/rally/components/RallySelect.vue'

import StageTypeSelect from '../commons/StageTypeSelect.vue'
import { useUpdateRallyStage } from '../../composables/update-rally-stage.composable'

const emit = defineEmits(['updated', 'close'])

const props = defineProps({
    rallyStage: {
        type: Object,
        default: null,
    },
})

const toast = useToast()

setupValidation()

const rallyStageForm = ref({
    rallyId: props.rallyStage?.rallyId,
    name: props.rallyStage?.name,
    stageType: props.rallyStage?.stageType,
    stageOrder: props.rallyStage?.stageOrder,
    distanceKm: props.rallyStage?.distanceKm,
})

const {
    rallyStage: updatedRallyStage,
    updateRallyStage,
    loading,
    errorState,
} = useUpdateRallyStage({
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
    stageOrder: Number(values.stageOrder),
    distanceKm: Number(values.distanceKm),
})

const onSubmit = async (values, { setTouched, setFieldError }) => {
    setTouched(true, true)
    await updateRallyStage(props.rallyStage.id, serializeValues(values))

    if (updatedRallyStage.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Exito',
            detail: `Etapa modificada correctamente ${updatedRallyStage.value.name}`,
            life: 3000,
        })
        emit('updated', updatedRallyStage.value)
        return
    }

    applyApiErrors(errorState.value, setFieldError)
}
</script>
