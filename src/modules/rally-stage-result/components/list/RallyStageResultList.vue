<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex justify-end mb-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" size="small" @click="addModalVisible = true" />
        </div>
        <DataTable
            :value="rallyStageResults"
            :loading="loading"
            tableStyle="min-width: 128rem"
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
            <Column field="stageId" header="Etapa" :showFilterMenu="false" style="width: 20rem">
                <template #filter>
                    <RallyStageSelectFilter v-model.trim="filters.stageId" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ formatStageLabel(slotProps.data?.schedule?.stage) }}
                </template>
            </Column>
            <Column field="teamId" header="Equipo" :showFilterMenu="false" style="width: 16rem">
                <template #filter>
                    <TeamSelectFilter v-model.trim="filters.teamId" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ formatTeamLabel(slotProps.data?.schedule?.team) }}
                </template>
            </Column>
            <Column field="categoryId" header="Categoria" :showFilterMenu="false" style="width: 14rem">
                <template #filter>
                    <CategorySelectFilter v-model.trim="filters.categoryId" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ formatCategoryLabel(slotProps.data?.schedule?.category) || '-' }}
                </template>
            </Column>
            <Column field="scheduleId" header="Programacion" :showFilterMenu="false" style="width: 14rem">
                <template #filter>
                    <RallyStageScheduleSelectFilter
                        v-model.trim="filters.scheduleId"
                        @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    <div class="flex flex-col">
                        <span>Orden {{ slotProps.data?.schedule?.startOrder ?? '-' }}</span>
                        <small class="text-slate-500">
                            {{ formatDateTime(slotProps.data?.schedule?.scheduledStartTime) || 'Sin hora programada' }}
                        </small>
                    </div>
                </template>
            </Column>
            <Column field="startTime" header="Salida" :showFilterMenu="false" style="width: 14rem">
                <template #body="slotProps">
                    {{ formatDateTime(slotProps.data?.startTime) }}
                </template>
            </Column>
            <Column field="endTime" header="Llegada" :showFilterMenu="false" style="width: 14rem">
                <template #body="slotProps">
                    {{ formatDateTime(slotProps.data?.endTime) }}
                </template>
            </Column>
            <Column field="time" header="Tiempo" :showFilterMenu="false" style="width: 10rem">
                <template #body="slotProps">
                    {{ formatDuration(slotProps.data?.time) }}
                </template>
            </Column>
            <Column field="penalty" header="Penalización" :showFilterMenu="false" style="width: 10rem">
                <template #body="slotProps">
                    {{ formatDuration(slotProps.data?.penalty) }}
                </template>
            </Column>
            <Column field="finalTime" header="Tiempo final" :showFilterMenu="false" style="width: 10rem">
                <template #body="slotProps">
                    {{ formatFinalTime(slotProps.data?.time, slotProps.data?.penalty) }}
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
            <Column field="eventName" header="Evento" :showFilterMenu="false" style="width: 18rem">
                <template #body="slotProps">
                    {{ slotProps.data?.schedule?.stage?.rally?.calendar?.eventName }}
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
                            @click="editRallyStageResult(slotProps.data?.id)" />
                        <Button
                            severity="danger"
                            type="button"
                            size="small"
                            icon="pi pi-trash"
                            title="Eliminar"
                            @click="deleteRallyStageResult(slotProps.data?.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <PaginatorComponent :filters="filters" :meta="meta" @toPage="toPage" @applyFilters="applyFilters" />

        <RallyStageResultAddModal v-if="addModalVisible" v-model="addModalVisible" @success="onSuccess" />
        <RallyStageResultEditModal
            v-if="editModalVisible"
            v-model="editModalVisible"
            :rallyStageResultId="rallyStageResultId"
            @success="onSuccess" />
        <RallyStageResultDeleteModal
            v-if="deleteModalVisible"
            v-model="deleteModalVisible"
            :rallyStageResultId="rallyStageResultId"
            @success="onSuccess" />
    </section>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

import PaginatorComponent from '@/shared/components/PaginatorComponent.vue'
import { useUrlFilters } from '@/shared/composables/use-url-filters'
import CategorySelectFilter from '@/modules/category/components/CategorySelectFilter.vue'
import RallyStageSelectFilter from '@/modules/rally-stage/components/RallyStageSelectFilter.vue'
import TeamSelectFilter from '@/modules/team/components/TeamSelectFilter.vue'
import RallyStageScheduleSelectFilter from '@/modules/rally-stage-schedule/components/RallyStageScheduleSelectFilter.vue'
import {
    formatCategoryLabel,
    formatDateTime,
    formatDuration,
    formatFinalTime,
    formatStageLabel,
    formatTeamLabel,
} from '@/modules/rally-stage/utils/rally-stage-flow'

import StatusDisplay from '../commons/StatusDisplay.vue'
import StatusSelectFilter from '../commons/StatusSelectFilter.vue'
import RallyStageResultAddModal from '../add/RallyStageResultAddModal.vue'
import RallyStageResultEditModal from '../edit/RallyStageResultEditModal.vue'
import RallyStageResultDeleteModal from '../delete/RallyStageResultDeleteModal.vue'
import { useGetRallyStageResults } from '../../composables/get-rally-stage-results.composable'

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
const rallyStageResultId = ref(null)

const { rallyStageResults, meta, loading, get } = useGetRallyStageResults({
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
        scheduleId: '',
        stageId: '',
        categoryId: '',
        teamId: '',
        status: '',
    },
    true
)

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

const editRallyStageResult = (id) => {
    rallyStageResultId.value = id
    editModalVisible.value = true
}

const deleteRallyStageResult = (id) => {
    rallyStageResultId.value = id
    deleteModalVisible.value = true
}

const onSuccess = () => {
    get(filters.value)
}

onMounted(() => {
    get(filters.value)
})
</script>
