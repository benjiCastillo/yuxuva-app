<template>
    <section class="space-y-6 border-t border-slate-200 pt-6">
        <div class="grid gap-6 xl:grid-cols-2">
            <section class="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <div class="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-900">Orden de partida / Programacion</h3>
                        <p class="text-sm text-slate-500">
                            Equipos programados para esta etapa, con orden y hora estimada.
                        </p>
                    </div>
                    <Button
                        label="Agregar team"
                        icon="pi pi-plus"
                        severity="success"
                        size="small"
                        @click="addScheduleModalVisible = true" />
                </div>

                <DataTable
                    :value="schedules"
                    :loading="loadingSchedules"
                    tableStyle="min-width: 48rem"
                    size="small"
                    showGridlines
                    rowHover>
                    <template #empty>
                        <div class="flex h-28 items-center justify-center">No hay programaciones para esta etapa.</div>
                    </template>
                    <Column field="startOrder" header="Orden" style="width: 6rem">
                        <template #body="slotProps">
                            {{ slotProps.data?.startOrder }}
                        </template>
                    </Column>
                    <Column field="teamId" header="Equipo" style="width: 18rem">
                        <template #body="slotProps">
                            {{ formatTeamLabel(slotProps.data?.team) }}
                        </template>
                    </Column>
                    <Column field="scheduledStartTime" header="Hora programada" style="width: 14rem">
                        <template #body="slotProps">
                            {{ formatDateTime(slotProps.data?.scheduledStartTime) || 'Sin definir' }}
                        </template>
                    </Column>
                    <Column field="status" header="Estado" style="width: 10rem">
                        <template #body="slotProps">
                            <ScheduleStatusDisplay :status="slotProps.data?.status" />
                        </template>
                    </Column>
                    <Column field="result" header="Resultado" style="width: 10rem">
                        <template #body="slotProps">
                            <span v-if="slotProps.data?.result">Cargado</span>
                            <span v-else class="text-slate-500">Pendiente</span>
                        </template>
                    </Column>
                    <Column header="Acciones" style="width: 12rem">
                        <template #body="slotProps">
                            <div class="flex flex-wrap gap-1">
                                <Button
                                    severity="warn"
                                    type="button"
                                    size="small"
                                    icon="pi pi-pencil"
                                    title="Editar programacion"
                                    @click="editSchedule(slotProps.data?.id)" />
                                <Button
                                    severity="danger"
                                    type="button"
                                    size="small"
                                    icon="pi pi-trash"
                                    title="Eliminar programacion"
                                    @click="deleteSchedule(slotProps.data?.id)" />
                                <Button
                                    v-if="slotProps.data?.result?.id"
                                    severity="info"
                                    type="button"
                                    size="small"
                                    icon="pi pi-stopwatch"
                                    label="Editar resultado"
                                    @click="editResult(slotProps.data?.result?.id)" />
                                <Button
                                    v-else
                                    severity="contrast"
                                    type="button"
                                    size="small"
                                    icon="pi pi-plus"
                                    label="Cargar resultado"
                                    @click="addResult(slotProps.data?.id)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-4">
                <div class="mb-4">
                    <h3 class="text-lg font-semibold text-slate-900">Resultados</h3>
                    <p class="text-sm text-slate-500">
                        Tiempos reales, penalizaciones y tiempo final por participacion.
                    </p>
                </div>

                <DataTable
                    :value="results"
                    :loading="loadingResults"
                    tableStyle="min-width: 48rem"
                    size="small"
                    showGridlines
                    rowHover>
                    <template #empty>
                        <div class="flex h-28 items-center justify-center">Aun no hay resultados para esta etapa.</div>
                    </template>
                    <Column field="schedule.startOrder" header="Orden" style="width: 6rem">
                        <template #body="slotProps">
                            {{ slotProps.data?.schedule?.startOrder }}
                        </template>
                    </Column>
                    <Column field="teamId" header="Equipo" style="width: 18rem">
                        <template #body="slotProps">
                            {{ formatTeamLabel(slotProps.data?.schedule?.team) }}
                        </template>
                    </Column>
                    <Column field="startTime" header="Salida real" style="width: 14rem">
                        <template #body="slotProps">
                            {{ formatDateTime(slotProps.data?.startTime) }}
                        </template>
                    </Column>
                    <Column field="endTime" header="Llegada real" style="width: 14rem">
                        <template #body="slotProps">
                            {{ formatDateTime(slotProps.data?.endTime) }}
                        </template>
                    </Column>
                    <Column field="time" header="Tiempo" style="width: 10rem">
                        <template #body="slotProps">
                            {{ formatDuration(slotProps.data?.time) }}
                        </template>
                    </Column>
                    <Column field="penalty" header="Penalizacion" style="width: 10rem">
                        <template #body="slotProps">
                            {{ formatDuration(slotProps.data?.penalty) }}
                        </template>
                    </Column>
                    <Column field="finalTime" header="Tiempo final" style="width: 10rem">
                        <template #body="slotProps">
                            {{ formatFinalTime(slotProps.data?.time, slotProps.data?.penalty) }}
                        </template>
                    </Column>
                    <Column field="status" header="Estado" style="width: 10rem">
                        <template #body="slotProps">
                            <ResultStatusDisplay :status="slotProps.data?.status" />
                        </template>
                    </Column>
                    <Column header="Acciones" style="width: 8rem">
                        <template #body="slotProps">
                            <div class="flex gap-1">
                                <Button
                                    severity="warn"
                                    type="button"
                                    size="small"
                                    icon="pi pi-pencil"
                                    title="Editar resultado"
                                    @click="editResult(slotProps.data?.id)" />
                                <Button
                                    severity="danger"
                                    type="button"
                                    size="small"
                                    icon="pi pi-trash"
                                    title="Eliminar resultado"
                                    @click="deleteResult(slotProps.data?.id)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </section>
        </div>

        <RallyStageScheduleAddModal
            v-if="addScheduleModalVisible"
            v-model="addScheduleModalVisible"
            :stageId="stageId"
            @success="refreshData" />
        <RallyStageScheduleEditModal
            v-if="editScheduleModalVisible"
            v-model="editScheduleModalVisible"
            :rallyStageScheduleId="rallyStageScheduleId"
            @success="refreshData" />
        <RallyStageScheduleDeleteModal
            v-if="deleteScheduleModalVisible"
            v-model="deleteScheduleModalVisible"
            :rallyStageScheduleId="rallyStageScheduleId"
            @success="refreshData" />

        <RallyStageResultAddModal
            v-if="addResultModalVisible"
            v-model="addResultModalVisible"
            :stageId="stageId"
            :scheduleId="scheduleId"
            @success="refreshData" />
        <RallyStageResultEditModal
            v-if="editResultModalVisible"
            v-model="editResultModalVisible"
            :rallyStageResultId="rallyStageResultId"
            @success="refreshData" />
        <RallyStageResultDeleteModal
            v-if="deleteResultModalVisible"
            v-model="deleteResultModalVisible"
            :rallyStageResultId="rallyStageResultId"
            @success="refreshData" />
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { useToast } from 'primevue/usetoast'

import {
    formatDateTime,
    formatDuration,
    formatFinalTime,
    formatTeamLabel,
} from '@/modules/rally-stage/utils/rally-stage-flow'
import RallyStageScheduleAddModal from '@/modules/rally-stage-schedule/components/add/RallyStageScheduleAddModal.vue'
import RallyStageScheduleDeleteModal from '@/modules/rally-stage-schedule/components/delete/RallyStageScheduleDeleteModal.vue'
import RallyStageScheduleEditModal from '@/modules/rally-stage-schedule/components/edit/RallyStageScheduleEditModal.vue'
import ScheduleStatusDisplay from '@/modules/rally-stage-schedule/components/commons/StatusDisplay.vue'
import { useGetRallyStageSchedules } from '@/modules/rally-stage-schedule/composables/get-rally-stage-schedules.composable'
import RallyStageResultAddModal from '@/modules/rally-stage-result/components/add/RallyStageResultAddModal.vue'
import RallyStageResultDeleteModal from '@/modules/rally-stage-result/components/delete/RallyStageResultDeleteModal.vue'
import RallyStageResultEditModal from '@/modules/rally-stage-result/components/edit/RallyStageResultEditModal.vue'
import ResultStatusDisplay from '@/modules/rally-stage-result/components/commons/StatusDisplay.vue'
import { useGetRallyStageResults } from '@/modules/rally-stage-result/composables/get-rally-stage-results.composable'

const props = defineProps({
    stageId: {
        type: String,
        default: null,
    },
})

const toast = useToast()

const addScheduleModalVisible = ref(false)
const editScheduleModalVisible = ref(false)
const deleteScheduleModalVisible = ref(false)
const addResultModalVisible = ref(false)
const editResultModalVisible = ref(false)
const deleteResultModalVisible = ref(false)
const rallyStageScheduleId = ref(null)
const rallyStageResultId = ref(null)
const scheduleId = ref(null)

const {
    rallyStageSchedules: schedules,
    loading: loadingSchedules,
    get: getSchedules,
} = useGetRallyStageSchedules({
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
    rallyStageResults: results,
    loading: loadingResults,
    get: getResults,
} = useGetRallyStageResults({
    onError: (title, error) => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: error.message,
            life: 3000,
        })
    },
})

const refreshData = async () => {
    await Promise.all([
        getSchedules({ stageId: props.stageId, page: 1, limit: 100 }),
        getResults({ stageId: props.stageId, page: 1, limit: 100 }),
    ])
}

const editSchedule = (id) => {
    rallyStageScheduleId.value = id
    editScheduleModalVisible.value = true
}

const deleteSchedule = (id) => {
    rallyStageScheduleId.value = id
    deleteScheduleModalVisible.value = true
}

const addResult = (nextScheduleId) => {
    scheduleId.value = nextScheduleId
    addResultModalVisible.value = true
}

const editResult = (id) => {
    rallyStageResultId.value = id
    editResultModalVisible.value = true
}

const deleteResult = (id) => {
    rallyStageResultId.value = id
    deleteResultModalVisible.value = true
}

onMounted(() => {
    refreshData()
})
</script>
