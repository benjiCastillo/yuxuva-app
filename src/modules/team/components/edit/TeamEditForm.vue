<template>
    <Form v-if="teamForm" :initial-values="teamForm" class="grid grid-cols-12 gap-2 w-full" @submit="onSubmit">
        <div class="col-span-12 md:col-span-6">
            <ChampionshipSelect fieldName="championshipId" title="Campeonato" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <CategorySelect fieldName="categoryId" title="Categoria" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="text" fieldName="carBrand" title="Marca del auto" rules="required|max:120" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon
                type="number"
                fieldName="competitionNo"
                title="Nro. de competicion"
                rules="required|numeric" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="text" fieldName="carModel" title="Modelo del auto" rules="max:120" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="number" fieldName="carYear" title="Año del auto" rules="numeric" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <DriverSelect fieldName="driverId" title="Piloto" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <DriverSelect fieldName="codriverId" title="Copiloto" />
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
import { Form } from 'vee-validate'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

import { setupValidation } from '@/shared/utils/setup-validation'
import { applyApiErrors } from '@/shared/utils/apply-api-errors'
import InputTextCommon from '@/shared/components/form-common/InputTextCommon.vue'
import ChampionshipSelect from '@/modules/championship/components/ChampionshipSelect.vue'
import CategorySelect from '@/modules/category/components/CategorySelect.vue'
import DriverSelect from '@/modules/driver/components/DriverSelect.vue'

import StatusSelect from '../commons/StatusSelect.vue'
import { useUpdateTeam } from '../../composables/update-team.composable'

const emit = defineEmits(['updated', 'close'])

const props = defineProps({
    team: {
        type: Object,
        default: null,
    },
})

const toast = useToast()

setupValidation()

const teamForm = ref({
    championshipId: props.team?.championshipId,
    categoryId: props.team?.categoryId,
    carBrand: props.team?.carBrand,
    carModel: props.team?.carModel,
    carYear: props.team?.carYear,
    driverId: props.team?.driverId,
    codriverId: props.team?.codriverId,
    competitionNo: props.team?.competitionNo,
    status: props.team?.status,
})

const {
    team: updatedTeam,
    updateTeam,
    loading,
    errorState,
} = useUpdateTeam({
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
    codriverId: values.codriverId || null,
    carModel: values.carModel || null,
    carYear: values.carYear ? Number(values.carYear) : null,
    competitionNo: Number(values.competitionNo),
})

const onSubmit = async (values, { setTouched, setFieldError }) => {
    setTouched(true, true)

    if (values.driverId && values.codriverId && values.driverId === values.codriverId) {
        setFieldError('codriverId', 'El copiloto debe ser distinto al piloto')
        return
    }

    await updateTeam(props.team.id, serializeValues(values))

    if (updatedTeam.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Exito',
            detail: `Equipo modificado correctamente #${updatedTeam.value.competitionNo}`,
            life: 3000,
        })
        emit('updated', updatedTeam.value)
        return
    }

    applyApiErrors(errorState.value, setFieldError)
}
</script>
