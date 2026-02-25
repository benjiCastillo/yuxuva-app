<template>
    <Dialog v-model:visible="visible" modal header="Agregar campeonato" class="w-full md:w-1/3 lg:w-1/4 m-2">
        <ChampionshipEditForm
            v-if="championship?.id"
            :championship="championship"
            @updated="onUpdated"
            @close="closeModal" />

        <section v-if="loading && !championship" class="flex flex-row items-center align-center h-[20vh]">
            <ProgressSpinner
                style="width: 50px; height: 50px"
                strokeWidth="4"
                fill="transparent"
                animationDuration=".8s"
                aria-label="Cargando.." />
        </section>
    </Dialog>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

import { useGetChampionship } from '../../composables/get-championship.composable'
import ChampionshipEditForm from './ChampionshipEditForm.vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    championshipId: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const { findOne, championship, loading } = useGetChampionship({
    onError: (error, title) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const closeModal = () => {
    visible.value = false
}

const onUpdated = () => {
    closeModal()
    emit('success')
}

onMounted(() => {
    findOne(props.championshipId)
})
</script>
