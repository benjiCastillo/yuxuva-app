<template>
    <Form
        v-if="championshipForm"
        :initial-values="championshipForm"
        class="grid grid-cols-12 gap-2 w-full"
        @submit="onSubmit">
        <div class="col-span-12">
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
import { setupValidation } from '@/shared/utils/setup-validation'

import InputTextCommon from '@/shared/components/form-common/InputTextCommon.vue'
import FederationSelect from '@/modules/federation/components/FederationSelect.vue'
import ModalitySelect from '../commons/ModalitySelect.vue'
import StatusSelect from '../commons/StatusSelect.vue'

import { useToast } from 'primevue/usetoast'

import { useUpdateChampionship } from '../../composables/update-championship.composable'
import { applyApiErrors } from '@/shared/utils/apply-api-errors'

const emit = defineEmits(['updated', 'close'])

const toast = useToast()

const props = defineProps({
    championship: {
        type: Object,
        default: null,
    },
})

setupValidation()

const championshipForm = ref({
    name: props.championship?.name,
    modality: props.championship?.modality,
    season: props.championship?.season,
    status: props.championship?.status,
    federationId: props.championship?.federationId,
})

const {
    championship: championshipUpdated,
    updateChampionship,
    loading,
    errorState,
} = useUpdateChampionship({
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
    await updateChampionship(props.championship.id, values)
    if (championshipUpdated.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Campeonato modificado correctamente ${championshipUpdated.value.name}`,
            life: 3000,
        })
        emit('updated', championshipUpdated.value)
        return
    }
    applyApiErrors(errorState.value, setFieldError)
}
</script>
