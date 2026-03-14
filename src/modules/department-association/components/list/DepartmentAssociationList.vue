<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex justify-end mb-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" size="small" @click="addModalVisible = true" />
        </div>
        <DataTable
            :value="departmentAssociations"
            :loading="loading"
            tableStyle="min-width: 50rem"
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
            <Column field="name" header="Nombre" :showFilterMenu="false">
                <template #filter>
                    <InputText
                        v-model.trim="filters.name"
                        inputId="name"
                        maxlength="245"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
            </Column>
            <Column field="department" header="Departamento" :showFilterMenu="false" style="width: 14rem">
                <template #body="slotProps">
                    {{ slotProps.data?.department }}
                </template>
            </Column>
            <Column field="status" header="Estado" :showFilterMenu="false" style="width: 10rem">
                <template #filter>
                    <Select
                        v-model.trim="filters.status"
                        :options="statusOptions"
                        optionLabel="name"
                        optionValue="value"
                        fluid
                        filter
                        @update:modelValue="applyFilters()" />
                </template>
            </Column>
            <Column field="federationId" header="Federacion" :showFilterMenu="false" style="width: 10rem">
                <template #filter>
                    <FederationSelectFilter v-model.trim="filters.federationId" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ slotProps.data?.federation?.acronym }}
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
                            @click="editDepartmentAssociation(slotProps.data?.id)" />

                        <Button
                            severity="danger"
                            type="button"
                            size="small"
                            icon="pi pi-trash"
                            title="Eliminar"
                            @click="deleteDepartmentAssociation(slotProps.data?.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <PaginatorComponent :filters="filters" :meta="meta" @toPage="toPage" @applyFilters="applyFilters" />

        <DepartmentAssociationAddModal v-if="addModalVisible" v-model="addModalVisible" @success="onSuccess" />

        <DepartmentAssociationEditModal
            v-if="editModalVisible"
            v-model="editModalVisible"
            :departmentAssociationId="departmentAssociationId"
            @success="onSuccess" />

        <DepartmentAssociationDeleteModal
            v-if="deleteModalVisible"
            v-model="deleteModalVisible"
            :departmentAssociationId="departmentAssociationId"
            @success="onSuccess" />
    </section>
</template>
<script setup>
import { nextTick, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'

import PaginatorComponent from '@/shared/components/PaginatorComponent.vue'
import { useUrlFilters } from '@/shared/composables/use-url-filters'
import FederationSelectFilter from '@/modules/federation/components/FederationSelectFilter.vue'

import DepartmentAssociationAddModal from '../add/DepartmentAssociationAddModal.vue'
import DepartmentAssociationEditModal from '../edit/DepartmentAssociationEditModal.vue'
import DepartmentAssociationDeleteModal from '../delete/DepartmentAssociationDeleteModal.vue'
import { useGetDepartmentAssociations } from '../../composables/get-department-associations.composable'

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
const departmentAssociationId = ref(null)

const statusOptions = [
    { name: 'ACTIVO', value: 'ACTIVE' },
    { name: 'INACTIVO', value: 'INACTIVE' },
]

const { departmentAssociations, meta, loading, get } = useGetDepartmentAssociations({
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
        name: '',
        status: '',
        federationId: '',
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

const editDepartmentAssociation = (id) => {
    departmentAssociationId.value = id
    editModalVisible.value = true
}

const deleteDepartmentAssociation = (id) => {
    departmentAssociationId.value = id
    deleteModalVisible.value = true
}

const onSuccess = () => {
    get(filters.value)
}

onMounted(() => {
    get(filters.value)
})
</script>
