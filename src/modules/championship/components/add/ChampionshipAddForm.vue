<template>
    <Form :initial-values="championshipForm" class="grid grid-cols-12 gap-2 w-full" @submit="onSubmit">
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="text" fieldName="name" title="Nombre" rules="required|max:200" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <ModalitySelect fieldName="modality" title="Modalidad" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="number" fieldName="season" title="Temporada" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <StatusSelect fieldName="status" title="Estado" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <FederationSelect fieldName="federationId" title="Federación" rules="required" />
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
import { setupValidation } from '@/shared/utils/setup-validation'

import InputTextCommon from '@/shared/components/form-common/InputTextCommon.vue'
import FederationSelect from '@/modules/federation/components/FederationSelect.vue'
import ModalitySelect from '../commons/ModalitySelect.vue'
import StatusSelect from '../commons/StatusSelect.vue'

import { useToast } from 'primevue/usetoast'

import { useCreateChampionship } from '../../composables/create-championship.composable'
import { applyApiErrors } from '@/shared/utils/apply-api-errors'

const emit = defineEmits(['created', 'close'])

const toast = useToast()

setupValidation()

const championshipForm = ref({
    name: null,
    modality: 'RALLY',
    season: new Date().getFullYear(),
    status: 'PLANNED',
    federationId: null,
})

const { championship, createChampionship, loading, errorState } = useCreateChampionship({
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
    await createChampionship(values)

    if (championship.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Campeonato agregado correctamente ${championship.value.name}`,
            life: 3000,
        })
        emit('created', championship.value)
        return
    }
    applyApiErrors(errorState.value, setFieldError)
}
</script>
