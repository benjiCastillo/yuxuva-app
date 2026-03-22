<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <div class="xl:col-span-2">
                <label class="mb-1 block text-sm font-semibold text-slate-700">Etapa</label>
                <RallyStageSelectFilter v-model.trim="filters.stageId" @update:modelValue="applyFilters()" />
            </div>
            <div>
                <label class="mb-1 block text-sm font-semibold text-slate-700">Categoria</label>
                <CategorySelectFilter v-model.trim="filters.categoryId" @update:modelValue="applyFilters()" />
            </div>
            <div class="xl:col-span-2">
                <label class="mb-1 block text-sm font-semibold text-slate-700">Equipo</label>
                <TeamSelectFilter
                    v-model.trim="filters.teamId"
                    :query="teamFilterQuery"
                    @update:modelValue="applyFilters()" />
            </div>
            <div>
                <label class="mb-1 block text-sm font-semibold text-slate-700">Estado</label>
                <StatusSelectFilter v-model.trim="filters.status" @update:modelValue="applyFilters()" />
            </div>
            <div>
                <label class="mb-1 block text-sm font-semibold text-slate-700">Orden</label>
                <InputText v-model.trim="filters.startOrder" inputId="startOrder" fluid @keyup.enter="applyFilters()" />
            </div>
            <div class="flex items-end justify-end gap-2 xl:col-span-5">
                <Button
                    label="Limpiar"
                    icon="pi pi-filter-slash"
                    severity="secondary"
                    size="small"
                    outlined
                    @click="clearFilters" />
                <Button
                    label="Nuevo"
                    icon="pi pi-plus"
                    severity="success"
                    size="small"
                    @click="addModalVisible = true" />
            </div>
        </div>
        <DataTable
            :value="groupedSchedules"
            :loading="loading"
            tableStyle="min-width: 108rem"
            size="small"
            rowGroupMode="subheader"
            groupRowsBy="categoryName"
            showGridlines
            rowHover>
            <template #empty>
                <div class="flex h-40 items-center justify-center">No se encontraron datos.</div>
            </template>
            <template #groupheader="slotProps">
                <div class="flex items-center justify-between gap-3 bg-slate-100 px-3 py-2">
                    <div>
                        <p class="text-sm font-semibold text-slate-900">{{ slotProps.data?.categoryName }}</p>
                        <p class="text-xs text-slate-500">Orden de partida dentro de esta categoria</p>
                    </div>
                    <span class="text-xs font-medium text-slate-500">
                        {{ getCategoryCount(slotProps.data?.categoryId) }} equipos
                    </span>
                </div>
            </template>
            <Column header="#" style="width: 3rem; max-width: 3rem">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column field="stageId" header="Etapa" style="width: 18rem">
                <template #body="slotProps">
                    {{ formatStageLabel(slotProps.data?.stage) }}
                </template>
            </Column>
            <Column field="teamId" header="Equipo" style="width: 24rem">
                <template #body="slotProps">
                    {{ formatTeamLabel(slotProps.data?.team) }}
                </template>
            </Column>
            <Column field="startOrder" header="Orden en categoria" style="width: 12rem">
                <template #body="slotProps">
                    {{ slotProps.data?.startOrder }}
                </template>
            </Column>
            <Column field="scheduledStartTime" header="Hora programada" style="width: 16rem">
                <template #body="slotProps">
                    {{ formatDateTime(slotProps.data?.scheduledStartTime) || 'Sin definir' }}
                </template>
            </Column>
            <Column field="status" header="Estado" style="width: 10rem">
                <template #body="slotProps">
                    <StatusDisplay :status="slotProps.data?.status" />
                </template>
            </Column>
            <Column field="result" header="Resultado" style="width: 14rem">
                <template #body="slotProps">
                    <span v-if="slotProps.data?.result">Registrado</span>
                    <span v-else class="text-slate-500">Pendiente</span>
                </template>
            </Column>
            <Column field="eventName" header="Evento" style="width: 16rem">
                <template #body="slotProps">
                    {{ slotProps.data?.stage?.rally?.calendar?.eventName }}
                </template>
            </Column>
            <Column field="championship" header="Campeonato" style="width: 16rem">
                <template #body="slotProps">
                    {{ formatChampionship(slotProps.data?.stage?.rally?.calendar?.championship) }}
                </template>
            </Column>
            <Column header="Acciones" style="width: 10rem">
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

        <RallyStageScheduleAddModal
            v-if="addModalVisible"
            v-model="addModalVisible"
            :stageId="filters.stageId || null"
            :categoryId="filters.categoryId || null"
            @success="onSuccess" />
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
import { computed, nextTick, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'

import PaginatorComponent from '@/shared/components/PaginatorComponent.vue'
import { useUrlFilters } from '@/shared/composables/use-url-filters'
import CategorySelectFilter from '@/modules/category/components/CategorySelectFilter.vue'
import RallyStageSelectFilter from '@/modules/rally-stage/components/RallyStageSelectFilter.vue'
import TeamSelectFilter from '@/modules/team/components/TeamSelectFilter.vue'
import {
    formatDateTime,
    formatStageLabel,
    formatTeamLabel,
    groupSchedulesByCategory,
} from '@/modules/rally-stage/utils/rally-stage-flow'

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
        categoryId: '',
        teamId: '',
        status: '',
        startOrder: '',
    },
    true
)

const formatChampionship = (championship) => {
    return [championship?.name, championship?.season].filter(Boolean).join(' - ')
}

const teamFilterQuery = computed(() => {
    if (!filters.value.stageId && !filters.value.categoryId) {
        return {}
    }

    return {
        ...(filters.value.stageId ? { stageId: filters.value.stageId } : {}),
        ...(filters.value.categoryId ? { categoryId: filters.value.categoryId } : {}),
    }
})

const groupedSchedules = computed(() => {
    return groupSchedulesByCategory(rallyStageSchedules.value).flatMap((group) => {
        return group.items.map((item) => ({
            ...item,
            categoryId: group.id,
            categoryName: group.name,
        }))
    })
})

const getCategoryCount = (categoryId) => {
    return groupedSchedules.value.filter((schedule) => schedule.categoryId === categoryId).length
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
