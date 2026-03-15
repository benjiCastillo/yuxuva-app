<template>
    <Form :initial-values="categoryForm" class="grid grid-cols-12 gap-2 w-full" @submit="onSubmit">
        <div class="col-span-12 md:col-span-6">
            <InputTextCommon type="text" fieldName="name" title="Nombre" rules="required|max:100" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <ChampionshipSelect fieldName="championshipId" title="Campeonato" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6">
            <ModalitySelect fieldName="modality" title="Modalidad" rules="required" />
        </div>
        <div class="col-span-12 md:col-span-6 grid gap-4 pt-6">
            <Field v-slot="{ field }" name="allowsCodriver">
                <div class="flex items-center gap-2">
                    <Checkbox
                        inputId="allowsCodriver"
                        :modelValue="field.value"
                        binary
                        @update:modelValue="field.onChange" />
                    <label for="allowsCodriver">Permite copiloto</label>
                </div>
            </Field>
            <Field v-slot="{ field }" name="pointsApply">
                <div class="flex items-center gap-2">
                    <Checkbox
                        inputId="pointsApply"
                        :modelValue="field.value"
                        binary
                        @update:modelValue="field.onChange" />
                    <label for="pointsApply">Aplica puntaje</label>
                </div>
            </Field>
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
import Checkbox from 'primevue/checkbox'
import { useToast } from 'primevue/usetoast'

import { setupValidation } from '@/shared/utils/setup-validation'
import { applyApiErrors } from '@/shared/utils/apply-api-errors'
import InputTextCommon from '@/shared/components/form-common/InputTextCommon.vue'
import ChampionshipSelect from '@/modules/championship/components/ChampionshipSelect.vue'
import ModalitySelect from '@/modules/championship/components/commons/ModalitySelect.vue'

import { useCreateCategory } from '../../composables/create-category.composable'

const emit = defineEmits(['created', 'close'])

const toast = useToast()

setupValidation()

const categoryForm = ref({
    name: null,
    modality: 'RALLY',
    allowsCodriver: true,
    pointsApply: true,
    championshipId: null,
})

const { category, createCategory, loading, errorState } = useCreateCategory({
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
    await createCategory(values)

    if (category.value?.id) {
        toast.add({
            severity: 'success',
            summary: 'Exito',
            detail: `Categoria agregada correctamente ${category.value.name}`,
            life: 3000,
        })
        emit('created', category.value)
        return
    }

    applyApiErrors(errorState.value, setFieldError)
}
</script>
