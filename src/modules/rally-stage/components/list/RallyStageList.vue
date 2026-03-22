<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex justify-end mb-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" size="small" @click="addModalVisible = true" />
        </div>
        <DataTable
            :value="rallyStages"
            :loading="loading"
            tableStyle="min-width: 92rem"
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
            <Column field="rallyId" header="Rally" :showFilterMenu="false" style="width: 22rem">
                <template #filter>
                    <RallySelectFilter v-model.trim="filters.rallyId" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ formatRally(slotProps.data?.rally) }}
                </template>
            </Column>
            <Column field="name" header="Nombre" :showFilterMenu="false" style="width: 18rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.name"
                        inputId="name"
                        maxlength="200"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
            </Column>
            <Column field="stageType" header="Tipo" :showFilterMenu="false" style="width: 10rem">
                <template #filter>
                    <StageTypeSelectFilter v-model.trim="filters.stageType" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    <StageTypeDisplay :stageType="slotProps.data?.stageType" />
                </template>
            </Column>
            <Column field="stageOrder" header="Orden" :showFilterMenu="false" style="width: 8rem">
                <template #body="slotProps">
                    {{ slotProps.data?.stageOrder }}
                </template>
            </Column>
            <Column field="distanceKm" header="Distancia" :showFilterMenu="false" style="width: 10rem">
                <template #body="slotProps">
                    {{ formatKm(slotProps.data?.distanceKm) }}
                </template>
            </Column>
            <Column field="championship" header="Campeonato" :showFilterMenu="false" style="width: 20rem">
                <template #body="slotProps">
                    {{ formatChampionship(slotProps.data?.rally?.calendar?.championship) }}
                </template>
            </Column>
            <Column field="eventName" header="Evento" :showFilterMenu="false" style="width: 16rem">
                <template #body="slotProps">
                    {{ slotProps.data?.rally?.calendar?.eventName }}
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
                            @click="editRallyStage(slotProps.data?.id)" />
                        <Button
                            severity="danger"
                            type="button"
                            size="small"
                            icon="pi pi-trash"
                            title="Eliminar"
                            @click="deleteRallyStage(slotProps.data?.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <PaginatorComponent :filters="filters" :meta="meta" @toPage="toPage" @applyFilters="applyFilters" />

        <RallyStageAddModal v-if="addModalVisible" v-model="addModalVisible" @success="onSuccess" />
        <RallyStageEditModal
            v-if="editModalVisible"
            v-model="editModalVisible"
            :rallyStageId="rallyStageId"
            @success="onSuccess" />
        <RallyStageDeleteModal
            v-if="deleteModalVisible"
            v-model="deleteModalVisible"
            :rallyStageId="rallyStageId"
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
import RallySelectFilter from '@/modules/rally/components/RallySelectFilter.vue'

import StageTypeDisplay from '../commons/StageTypeDisplay.vue'
import StageTypeSelectFilter from '../commons/StageTypeSelectFilter.vue'
import RallyStageAddModal from '../add/RallyStageAddModal.vue'
import RallyStageEditModal from '../edit/RallyStageEditModal.vue'
import RallyStageDeleteModal from '../delete/RallyStageDeleteModal.vue'
import { useGetRallyStages } from '../../composables/get-rally-stages.composable'

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
const rallyStageId = ref(null)

const { rallyStages, meta, loading, get } = useGetRallyStages({
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
        rallyId: '',
        name: '',
        stageType: '',
    },
    true
)

const formatRally = (rally) => {
    return [
        rally?.calendar?.roundNumber ? `Fecha ${rally.calendar.roundNumber}` : null,
        rally?.calendar?.eventName,
        rally?.totalKm ? `${rally.totalKm} km` : null,
    ]
        .filter(Boolean)
        .join(' - ')
}

const formatKm = (value) => {
    return value || value === 0 ? `${value} km` : ''
}

const formatChampionship = (championship) => {
    return [championship?.name, championship?.season].filter(Boolean).join(' - ')
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

const editRallyStage = (id) => {
    rallyStageId.value = id
    editModalVisible.value = true
}

const deleteRallyStage = (id) => {
    rallyStageId.value = id
    deleteModalVisible.value = true
}

const onSuccess = () => {
    get(filters.value)
}

onMounted(() => {
    get(filters.value)
})
</script>
