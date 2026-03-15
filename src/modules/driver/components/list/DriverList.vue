<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex justify-end mb-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" size="small" @click="addModalVisible = true" />
        </div>
        <DataTable
            :value="drivers"
            :loading="loading"
            tableStyle="min-width: 90rem"
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
            <Column field="firstName" header="Nombres" :showFilterMenu="false" style="width: 12rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.firstName"
                        inputId="firstName"
                        maxlength="100"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
            </Column>
            <Column field="lastName" header="Apellidos" :showFilterMenu="false" style="width: 12rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.lastName"
                        inputId="lastName"
                        maxlength="100"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
            </Column>
            <Column field="documentNumber" header="Documento" :showFilterMenu="false" style="width: 10rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.documentNumber"
                        inputId="documentNumber"
                        maxlength="30"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
            </Column>
            <Column field="licenseNumber" header="Licencia" :showFilterMenu="false" style="width: 12rem">
                <template #body="slotProps">
                    {{ slotProps.data?.licenseNumber }}
                </template>
            </Column>
            <Column field="phone" header="Telefono" :showFilterMenu="false" style="width: 10rem">
                <template #body="slotProps">
                    {{ slotProps.data?.phone }}
                </template>
            </Column>
            <Column field="email" header="Correo" :showFilterMenu="false" style="width: 16rem">
                <template #body="slotProps">
                    {{ slotProps.data?.email }}
                </template>
            </Column>
            <Column field="bloodType" header="Sangre" :showFilterMenu="false" style="width: 8rem">
                <template #body="slotProps">
                    {{ slotProps.data?.bloodType }}
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
                            @click="editDriver(slotProps.data?.id)" />
                        <Button
                            severity="danger"
                            type="button"
                            size="small"
                            icon="pi pi-trash"
                            title="Eliminar"
                            @click="deleteDriver(slotProps.data?.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <PaginatorComponent :filters="filters" :meta="meta" @toPage="toPage" @applyFilters="applyFilters" />

        <DriverAddModal v-if="addModalVisible" v-model="addModalVisible" @success="onSuccess" />
        <DriverEditModal v-if="editModalVisible" v-model="editModalVisible" :driverId="driverId" @success="onSuccess" />
        <DriverDeleteModal
            v-if="deleteModalVisible"
            v-model="deleteModalVisible"
            :driverId="driverId"
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

import StatusDisplay from '../commons/StatusDisplay.vue'
import StatusSelectFilter from '../commons/StatusSelectFilter.vue'
import DriverAddModal from '../add/DriverAddModal.vue'
import DriverEditModal from '../edit/DriverEditModal.vue'
import DriverDeleteModal from '../delete/DriverDeleteModal.vue'
import { useGetDrivers } from '../../composables/get-drivers.composable'

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
const driverId = ref(null)

const { drivers, meta, loading, get } = useGetDrivers({
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
        firstName: '',
        lastName: '',
        documentNumber: '',
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

const editDriver = (id) => {
    driverId.value = id
    editModalVisible.value = true
}

const deleteDriver = (id) => {
    driverId.value = id
    deleteModalVisible.value = true
}

const onSuccess = () => {
    get(filters.value)
}

onMounted(() => {
    get(filters.value)
})
</script>
