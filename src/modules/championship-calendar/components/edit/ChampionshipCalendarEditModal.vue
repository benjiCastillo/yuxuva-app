<template>
    <Dialog v-model:visible="visible" modal header="Editar fecha del calendario" class="w-full md:w-2/3 lg:w-1/2 m-2">
        <ChampionshipCalendarEditForm
            v-if="championshipCalendar?.id"
            :championshipCalendar="championshipCalendar"
            @updated="onUpdated"
            @close="closeModal" />

        <section v-if="loading && !championshipCalendar" class="flex flex-row items-center align-center h-[20vh]">
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
import { useToast } from 'primevue/usetoast'

import { useGetChampionshipCalendar } from '../../composables/get-championship-calendar.composable'
import ChampionshipCalendarEditForm from './ChampionshipCalendarEditForm.vue'

const toast = useToast()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    championshipCalendarId: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const { findOne, championshipCalendar, loading } = useGetChampionshipCalendar({
    onError: (title, error) => {
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
    findOne(props.championshipCalendarId)
})
</script>
