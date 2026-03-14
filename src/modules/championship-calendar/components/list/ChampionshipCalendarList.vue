<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex justify-end mb-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" size="small" @click="addModalVisible = true" />
        </div>
        <DataTable
            :value="championshipCalendars"
            :loading="loading"
            tableStyle="min-width: 70rem"
            size="small"
            filterDisplay="row"
            showGridlines
            rowHover>
            <template #empty>
                <div class="flex h-40 items-center justify-center">No se encontraron datos.</div>
            </template>
            <Column header="#" style="width: 3rem; max-width: 3rem">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column field="eventName" header="Evento" :showFilterMenu="false" style="width: 18rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.eventName"
                        inputId="eventName"
                        maxlength="245"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
            </Column>
            <Column field="championshipId" header="Campeonato" :showFilterMenu="false" style="width: 16rem">
                <template #filter>
                    <ChampionshipSelectFilter
                        v-model.trim="filters.championshipId"
                        @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ slotProps.data?.championship?.name }}
                </template>
            </Column>
            <Column field="associationId" header="Asociacion" :showFilterMenu="false" style="width: 16rem">
                <template #filter>
                    <DepartmentAssociationSelectFilter
                        v-model.trim="filters.associationId"
                        @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ slotProps.data?.association?.name }}
                </template>
            </Column>
            <Column field="roundNumber" header="Fecha" :showFilterMenu="false" style="width: 6rem"></Column>
            <Column field="startDate" header="Inicio" :showFilterMenu="false" style="width: 10rem">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data?.startDate) }}
                </template>
            </Column>
            <Column field="endDate" header="Fin" :showFilterMenu="false" style="width: 10rem">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data?.endDate) }}
                </template>
            </Column>
            <Column field="status" header="Estado" :showFilterMenu="false" style="width: 10rem">
                <template #filter>
                    <StatusSelectFilter v-model.trim="filters.status" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    <StatusDisplay :status="slotProps.data?.status" />
                </template>
            </Column>
            <Column header="Acciones" :showFilterMenu="false" style="width: 10rem">
                <template #filter>
                    <Button
                        severity="secondary"
                        type="button"
                        size="small"
                        icon="pi pi-filter-slash"
                        outlined
                        @click="clearFilters" />
                </template>
                <template #body="slotProps">
                    <div class="flex gap-1">
                        <Button
                            severity="warn"
                            type="button"
                            size="small"
                            icon="pi pi-pencil"
                            title="Editar"
                            @click="editChampionshipCalendar(slotProps.data?.id)" />

                        <Button
                            severity="danger"
                            type="button"
                            size="small"
                            icon="pi pi-trash"
                            title="Eliminar"
                            @click="deleteChampionshipCalendar(slotProps.data?.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <PaginatorComponent :filters="filters" :meta="meta" @toPage="toPage" @applyFilters="applyFilters" />

        <ChampionshipCalendarAddModal v-if="addModalVisible" v-model="addModalVisible" @success="onSuccess" />

        <ChampionshipCalendarEditModal
            v-if="editModalVisible"
            v-model="editModalVisible"
            :championshipCalendarId="championshipCalendarId"
            @success="onSuccess" />

        <ChampionshipCalendarDeleteModal
            v-if="deleteModalVisible"
            v-model="deleteModalVisible"
            :championshipCalendarId="championshipCalendarId"
            @success="onSuccess" />
    </section>
</template>
<script setup>
import { nextTick, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'

import PaginatorComponent from '@/shared/components/PaginatorComponent.vue'
import { useUrlFilters } from '@/shared/composables/use-url-filters'
import ChampionshipSelectFilter from '@/modules/championship/components/ChampionshipSelectFilter.vue'
import DepartmentAssociationSelectFilter from '@/modules/department-association/components/DepartmentAssociationSelectFilter.vue'

import StatusDisplay from '../commons/StatusDisplay.vue'
import StatusSelectFilter from '../commons/StatusSelectFilter.vue'
import ChampionshipCalendarAddModal from '../add/ChampionshipCalendarAddModal.vue'
import ChampionshipCalendarEditModal from '../edit/ChampionshipCalendarEditModal.vue'
import ChampionshipCalendarDeleteModal from '../delete/ChampionshipCalendarDeleteModal.vue'
import { useGetChampionshipCalendars } from '../../composables/get-championship-calendars.composable'

const props = defineProps({
    limit: {
        type: Number,
        default: 20,
    },
})

const toast = useToast()

const addModalVisible = ref(false)
const editModalVisible = ref(false)
const deleteModalVisible = ref(false)
const championshipCalendarId = ref(null)

const { championshipCalendars, meta, loading, get } = useGetChampionshipCalendars({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const { filters, updateFilters, resetFilters } = useUrlFilters(
    {
        page: 1,
        limit: props.limit,
        eventName: '',
        championshipId: '',
        associationId: '',
        status: '',
    },
    true
)

const formatDate = (value) => {
    if (!value) {
        return ''
    }

    return new Intl.DateTimeFormat('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(value))
}

const applyFilters = (next) => {
    updateFilters(next)
    get(filters.value)
}

const toPage = (page) => {
    updateFilters({ page })
    get(filters.value)
}

const clearFilters = async () => {
    resetFilters()
    await nextTick()
    get(filters.value)
}

const editChampionshipCalendar = (id) => {
    championshipCalendarId.value = id
    editModalVisible.value = true
}

const deleteChampionshipCalendar = (id) => {
    championshipCalendarId.value = id
    deleteModalVisible.value = true
}

const onSuccess = () => {
    get(filters.value)
}

onMounted(() => {
    get(filters.value)
})
</script>
