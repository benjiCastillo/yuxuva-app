<template>
    <Dialog v-model:visible="visible" modal header="Eliminar equipo" class="w-full md:w-1/3 lg:w-1/4 m-2">
        <section v-if="loading && !team" class="flex flex-row items-center align-center h-[20vh]">
            <ProgressSpinner
                style="width: 50px; height: 50px"
                strokeWidth="4"
                fill="transparent"
                animationDuration=".8s"
                aria-label="Cargando.." />
        </section>
        <section v-else-if="team?.id">
            <p>
                ¿Esta seguro de eliminar el equipo
                <b>{{ teamLabel }}</b>
                ?
            </p>
            <p>Esta accion no se puede deshacer.</p>
            <div class="col-span-12 flex justify-between mt-4">
                <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" @click="closeModal()" />
                <Button
                    type="button"
                    label="Eliminar"
                    icon="pi pi-trash"
                    severity="danger"
                    :loading="loadingDelete"
                    :disabled="loadingDelete"
                    @click="deleteTeamById()" />
            </div>
        </section>
    </Dialog>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

import { useGetTeam } from '../../composables/get-team.composable'
import { useDeleteTeam } from '../../composables/delete-team.composable'

const toast = useToast()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    teamId: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const { findOne, team, loading } = useGetTeam({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const {
    team: deletedTeam,
    deleteTeam,
    loading: loadingDelete,
} = useDeleteTeam({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const teamLabel = computed(() => {
    return [
        team.value?.competitionNo ? `#${team.value.competitionNo}` : null,
        [team.value?.driver?.firstName, team.value?.driver?.lastName].filter(Boolean).join(' '),
    ]
        .filter(Boolean)
        .join(' - ')
})

const closeModal = () => {
    visible.value = false
}

const deleteTeamById = async () => {
    await deleteTeam(props.teamId)
    if (deletedTeam.value) {
        onDeleted()
    }
}

const onDeleted = () => {
    closeModal()
    emit('success')
}

onMounted(() => {
    findOne(props.teamId)
})
</script>
