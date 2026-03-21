<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex justify-end mb-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" size="small" @click="addModalVisible = true" />
        </div>
        <DataTable
            :value="rallies"
            :loading="loading"
            tableStyle="min-width: 88rem"
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
            <Column field="calendarId" header="Fecha" :showFilterMenu="false" style="width: 22rem">
                <template #filter>
                    <CalendarSelectFilter v-model.trim="filters.calendarId" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ formatCalendar(slotProps.data?.calendar) }}
                </template>
            </Column>
            <Column field="championship" header="Campeonato" :showFilterMenu="false" style="width: 20rem">
                <template #body="slotProps">
                    {{ formatChampionship(slotProps.data?.calendar?.championship) }}
                </template>
            </Column>
            <Column field="association" header="Asociacion" :showFilterMenu="false" style="width: 20rem">
                <template #body="slotProps">
                    {{ formatAssociation(slotProps.data?.calendar?.association) }}
                </template>
            </Column>
            <Column field="totalKm" header="Km totales" :showFilterMenu="false" style="width: 10rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.totalKm"
                        inputId="totalKm"
                        maxlength="10"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ formatKm(slotProps.data?.totalKm) }}
                </template>
            </Column>
            <Column field="startDate" header="Inicio" :showFilterMenu="false" style="width: 10rem">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data?.calendar?.startDate) }}
                </template>
            </Column>
            <Column field="endDate" header="Fin" :showFilterMenu="false" style="width: 10rem">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data?.calendar?.endDate) }}
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
                            @click="editRally(slotProps.data?.id)" />
                        <Button
                            severity="danger"
                            type="button"
                            size="small"
                            icon="pi pi-trash"
                            title="Eliminar"
                            @click="deleteRally(slotProps.data?.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <PaginatorComponent :filters="filters" :meta="meta" @toPage="toPage" @applyFilters="applyFilters" />

        <RallyAddModal v-if="addModalVisible" v-model="addModalVisible" @success="onSuccess" />
        <RallyEditModal v-if="editModalVisible" v-model="editModalVisible" :rallyId="rallyId" @success="onSuccess" />
        <RallyDeleteModal
            v-if="deleteModalVisible"
            v-model="deleteModalVisible"
            :rallyId="rallyId"
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

import CalendarSelectFilter from '../CalendarSelectFilter.vue'
import RallyAddModal from '../add/RallyAddModal.vue'
import RallyEditModal from '../edit/RallyEditModal.vue'
import RallyDeleteModal from '../delete/RallyDeleteModal.vue'
import { useGetRallies } from '../../composables/get-rallies.composable'

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
const rallyId = ref(null)

const { rallies, meta, loading, get } = useGetRallies({
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
        calendarId: '',
        totalKm: '',
    },
    true
)

const formatCalendar = (calendar) => {
    return [calendar?.roundNumber ? `Fecha ${calendar.roundNumber}` : null, calendar?.eventName]
        .filter(Boolean)
        .join(' - ')
}

const formatChampionship = (championship) => {
    return [championship?.name, championship?.season].filter(Boolean).join(' - ')
}

const formatAssociation = (association) => {
    return [association?.name, association?.department].filter(Boolean).join(' - ')
}

const formatKm = (value) => {
    return value || value === 0 ? `${value} km` : ''
}

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

const editRally = (id) => {
    rallyId.value = id
    editModalVisible.value = true
}

const deleteRally = (id) => {
    rallyId.value = id
    deleteModalVisible.value = true
}

const onSuccess = () => {
    get(filters.value)
}

onMounted(() => {
    get(filters.value)
})
</script>
