<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex justify-end mb-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" size="small" @click="addModalVisible = true" />
        </div>
        <DataTable
            :value="teams"
            :loading="loading"
            tableStyle="min-width: 112rem"
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
            <Column field="competitionNo" header="Nro." :showFilterMenu="false" style="width: 7rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.competitionNo"
                        inputId="competitionNo"
                        maxlength="10"
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
                    {{ formatChampionship(slotProps.data?.championship) }}
                </template>
            </Column>
            <Column field="categoryId" header="Categoria" :showFilterMenu="false" style="width: 12rem">
                <template #filter>
                    <CategorySelectFilter v-model.trim="filters.categoryId" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ slotProps.data?.category?.name }}
                </template>
            </Column>
            <Column field="carBrand" header="Marca" :showFilterMenu="false" style="width: 14rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.carBrand"
                        inputId="carBrand"
                        maxlength="120"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ slotProps.data?.carBrand || '-' }}
                </template>
            </Column>
            <Column field="carModel" header="Modelo" :showFilterMenu="false" style="width: 14rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.carModel"
                        inputId="carModel"
                        maxlength="120"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ slotProps.data?.carModel || '-' }}
                </template>
            </Column>
            <Column field="carYear" header="Año" :showFilterMenu="false" style="width: 8rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.carYear"
                        inputId="carYear"
                        maxlength="4"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ slotProps.data?.carYear || '-' }}
                </template>
            </Column>
            <Column field="driverId" header="Piloto" :showFilterMenu="false" style="width: 14rem">
                <template #filter>
                    <DriverSelectFilter v-model.trim="filters.driverId" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ formatDriver(slotProps.data?.driver) }}
                </template>
            </Column>
            <Column field="codriverId" header="Copiloto" :showFilterMenu="false" style="width: 14rem">
                <template #body="slotProps">
                    {{ formatDriver(slotProps.data?.codriver) || '-' }}
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
                            @click="editTeam(slotProps.data?.id)" />
                        <Button
                            severity="danger"
                            type="button"
                            size="small"
                            icon="pi pi-trash"
                            title="Eliminar"
                            @click="deleteTeam(slotProps.data?.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <PaginatorComponent :filters="filters" :meta="meta" @toPage="toPage" @applyFilters="applyFilters" />

        <TeamAddModal v-if="addModalVisible" v-model="addModalVisible" @success="onSuccess" />
        <TeamEditModal v-if="editModalVisible" v-model="editModalVisible" :teamId="teamId" @success="onSuccess" />
        <TeamDeleteModal v-if="deleteModalVisible" v-model="deleteModalVisible" :teamId="teamId" @success="onSuccess" />
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
import CategorySelectFilter from '@/modules/category/components/CategorySelectFilter.vue'
import DriverSelectFilter from '@/modules/driver/components/DriverSelectFilter.vue'

import StatusDisplay from '../commons/StatusDisplay.vue'
import StatusSelectFilter from '../commons/StatusSelectFilter.vue'
import TeamAddModal from '../add/TeamAddModal.vue'
import TeamEditModal from '../edit/TeamEditModal.vue'
import TeamDeleteModal from '../delete/TeamDeleteModal.vue'
import { useGetTeams } from '../../composables/get-teams.composable'

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
const teamId = ref(null)

const { teams, meta, loading, get } = useGetTeams({
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
        competitionNo: '',
        championshipId: '',
        categoryId: '',
        carBrand: '',
        carModel: '',
        carYear: '',
        driverId: '',
        status: '',
    },
    true
)

const formatChampionship = (championship) => {
    return [championship?.name, championship?.season].filter(Boolean).join(' - ')
}

const formatDriver = (driver) => {
    return [driver?.firstName, driver?.lastName].filter(Boolean).join(' ')
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

const editTeam = (id) => {
    teamId.value = id
    editModalVisible.value = true
}

const deleteTeam = (id) => {
    teamId.value = id
    deleteModalVisible.value = true
}

const onSuccess = () => {
    get(filters.value)
}

onMounted(() => {
    get(filters.value)
})
</script>
