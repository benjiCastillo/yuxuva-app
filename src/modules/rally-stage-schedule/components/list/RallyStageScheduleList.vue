<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex justify-end mb-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" size="small" @click="addModalVisible = true" />
        </div>
        <DataTable
            :value="rallyStageSchedules"
            :loading="loading"
            tableStyle="min-width: 120rem"
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
            <Column field="stageId" header="Etapa" :showFilterMenu="false" style="width: 18rem">
                <template #filter>
                    <RallyStageSelectFilter v-model.trim="filters.stageId" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ formatStageLabel(slotProps.data?.stage) }}
                </template>
            </Column>
            <Column field="teamId" header="Equipo" :showFilterMenu="false" style="width: 22rem">
                <template #filter>
                    <TeamSelectFilter v-model.trim="filters.teamId" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ formatTeamLabel(slotProps.data?.team) }}
                </template>
            </Column>
            <Column field="startOrder" header="Orden de partida" :showFilterMenu="false" style="width: 10rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.startOrder"
                        inputId="startOrder"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ slotProps.data?.startOrder }}
                </template>
            </Column>
            <Column field="scheduledStartTime" header="Hora programada" :showFilterMenu="false" style="width: 16rem">
                <template #body="slotProps">
                    {{ formatDateTime(slotProps.data?.scheduledStartTime) || 'Sin definir' }}
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
            <Column field="result" header="Resultado" :showFilterMenu="false" style="width: 14rem">
                <template #body="slotProps">
                    <span v-if="slotProps.data?.result">Registrado</span>
                    <span v-else class="text-slate-500">Pendiente</span>
                </template>
            </Column>
            <Column field="eventName" header="Evento" :showFilterMenu="false" style="width: 16rem">
                <template #body="slotProps">
                    {{ slotProps.data?.stage?.rally?.calendar?.eventName }}
                </template>
            </Column>
            <Column field="championship" header="Campeonato" :showFilterMenu="false" style="width: 16rem">
                <template #body="slotProps">
                    {{ formatChampionship(slotProps.data?.stage?.rally?.calendar?.championship) }}
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
                            @click="editRallyStageSchedule(slotProps.data?.id)" />
                        <Button
                            severity="danger"
                            type="button"
                            size="small"
                            icon="pi pi-trash"
                            title="Eliminar"
                            @click="deleteRallyStageSchedule(slotProps.data?.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <PaginatorComponent :filters="filters" :meta="meta" @toPage="toPage" @applyFilters="applyFilters" />

        <RallyStageScheduleAddModal v-if="addModalVisible" v-model="addModalVisible" @success="onSuccess" />
        <RallyStageScheduleEditModal
            v-if="editModalVisible"
            v-model="editModalVisible"
            :rallyStageScheduleId="rallyStageScheduleId"
            @success="onSuccess" />
        <RallyStageScheduleDeleteModal
            v-if="deleteModalVisible"
            v-model="deleteModalVisible"
            :rallyStageScheduleId="rallyStageScheduleId"
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
import RallyStageSelectFilter from '@/modules/rally-stage/components/RallyStageSelectFilter.vue'
import TeamSelectFilter from '@/modules/team/components/TeamSelectFilter.vue'
import { formatDateTime, formatStageLabel, formatTeamLabel } from '@/modules/rally-stage/utils/rally-stage-flow'

import StatusDisplay from '../commons/StatusDisplay.vue'
import StatusSelectFilter from '../commons/StatusSelectFilter.vue'
import RallyStageScheduleAddModal from '../add/RallyStageScheduleAddModal.vue'
import RallyStageScheduleEditModal from '../edit/RallyStageScheduleEditModal.vue'
import RallyStageScheduleDeleteModal from '../delete/RallyStageScheduleDeleteModal.vue'
import { useGetRallyStageSchedules } from '../../composables/get-rally-stage-schedules.composable'

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
const rallyStageScheduleId = ref(null)

const { rallyStageSchedules, meta, loading, get } = useGetRallyStageSchedules({
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
        stageId: '',
        teamId: '',
        status: '',
        startOrder: '',
    },
    true
)

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

const editRallyStageSchedule = (id) => {
    rallyStageScheduleId.value = id
    editModalVisible.value = true
}

const deleteRallyStageSchedule = (id) => {
    rallyStageScheduleId.value = id
    deleteModalVisible.value = true
}

const onSuccess = () => {
    get(filters.value)
}

onMounted(() => {
    get(filters.value)
})
</script>
