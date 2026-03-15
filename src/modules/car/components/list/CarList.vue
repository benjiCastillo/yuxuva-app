<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex justify-end mb-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" size="small" @click="addModalVisible = true" />
        </div>
        <DataTable
            :value="cars"
            :loading="loading"
            tableStyle="min-width: 65rem"
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
            <Column field="brand" header="Marca" :showFilterMenu="false" style="width: 12rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.brand"
                        inputId="brand"
                        maxlength="100"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
            </Column>
            <Column field="model" header="Modelo" :showFilterMenu="false" style="width: 16rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.model"
                        inputId="model"
                        maxlength="150"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
            </Column>
            <Column field="year" header="Año" :showFilterMenu="false" style="width: 8rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.year"
                        inputId="year"
                        maxlength="4"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
            </Column>
            <Column field="drivetrain" header="Tracción" :showFilterMenu="false" style="width: 12rem">
                <template #body="slotProps">
                    {{ slotProps.data?.drivetrain || '-' }}
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
                            @click="editCar(slotProps.data?.id)" />
                        <Button
                            severity="danger"
                            type="button"
                            size="small"
                            icon="pi pi-trash"
                            title="Eliminar"
                            @click="deleteCar(slotProps.data?.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <PaginatorComponent :filters="filters" :meta="meta" @toPage="toPage" @applyFilters="applyFilters" />

        <CarAddModal v-if="addModalVisible" v-model="addModalVisible" @success="onSuccess" />
        <CarEditModal v-if="editModalVisible" v-model="editModalVisible" :carId="carId" @success="onSuccess" />
        <CarDeleteModal v-if="deleteModalVisible" v-model="deleteModalVisible" :carId="carId" @success="onSuccess" />
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

import StatusDisplay from '../commons/StatusDisplay.vue'
import StatusSelectFilter from '../commons/StatusSelectFilter.vue'
import CarAddModal from '../add/CarAddModal.vue'
import CarEditModal from '../edit/CarEditModal.vue'
import CarDeleteModal from '../delete/CarDeleteModal.vue'
import { useGetCars } from '../../composables/get-cars.composable'

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
const carId = ref(null)

const { cars, meta, loading, get } = useGetCars({
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
        brand: '',
        model: '',
        year: '',
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

const editCar = (id) => {
    carId.value = id
    editModalVisible.value = true
}

const deleteCar = (id) => {
    carId.value = id
    deleteModalVisible.value = true
}

const onSuccess = () => {
    get(filters.value)
}

onMounted(() => {
    get(filters.value)
})
</script>
