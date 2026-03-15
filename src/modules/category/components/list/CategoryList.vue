<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex justify-end mb-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" size="small" @click="addModalVisible = true" />
        </div>
        <DataTable
            :value="categories"
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
            <Column field="name" header="Nombre" :showFilterMenu="false" style="width: 12rem">
                <template #filter>
                    <InputText
                        v-model.trim="filters.name"
                        inputId="name"
                        maxlength="100"
                        fluid
                        @keyup.enter="applyFilters()" />
                </template>
            </Column>
            <Column field="modality" header="Modalidad" :showFilterMenu="false" style="width: 12rem">
                <template #filter>
                    <ModalitySelect
                        v-model.trim="filters.modality"
                        fieldName="modality"
                        showClear
                        @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ slotProps.data?.modality }}
                </template>
            </Column>
            <Column field="allowsCodriver" header="Copiloto" :showFilterMenu="false" style="width: 8rem">
                <template #filter>
                    <BooleanSelectFilter v-model.trim="filters.allowsCodriver" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    <BooleanDisplay :value="slotProps.data?.allowsCodriver" />
                </template>
            </Column>
            <Column field="pointsApply" header="Puntaje" :showFilterMenu="false" style="width: 8rem">
                <template #filter>
                    <BooleanSelectFilter v-model.trim="filters.pointsApply" @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    <BooleanDisplay :value="slotProps.data?.pointsApply" />
                </template>
            </Column>
            <Column field="championshipId" header="Campeonato" :showFilterMenu="false" style="width: 16rem">
                <template #filter>
                    <ChampionshipSelectFilter
                        v-model.trim="filters.championshipId"
                        @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ slotProps.data?.championship?.name }}
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
                            @click="editCategory(slotProps.data?.id)" />
                        <Button
                            severity="danger"
                            type="button"
                            size="small"
                            icon="pi pi-trash"
                            title="Eliminar"
                            @click="deleteCategory(slotProps.data?.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <PaginatorComponent :filters="filters" :meta="meta" @toPage="toPage" @applyFilters="applyFilters" />

        <CategoryAddModal v-if="addModalVisible" v-model="addModalVisible" @success="onSuccess" />
        <CategoryEditModal
            v-if="editModalVisible"
            v-model="editModalVisible"
            :categoryId="categoryId"
            @success="onSuccess" />
        <CategoryDeleteModal
            v-if="deleteModalVisible"
            v-model="deleteModalVisible"
            :categoryId="categoryId"
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
import ChampionshipSelectFilter from '@/modules/championship/components/ChampionshipSelectFilter.vue'
import ModalitySelect from '@/modules/championship/components/commons/ModalitySelect.vue'

import BooleanDisplay from '../commons/BooleanDisplay.vue'
import BooleanSelectFilter from '../commons/BooleanSelectFilter.vue'
import CategoryAddModal from '../add/CategoryAddModal.vue'
import CategoryEditModal from '../edit/CategoryEditModal.vue'
import CategoryDeleteModal from '../delete/CategoryDeleteModal.vue'
import { useGetCategories } from '../../composables/get-categories.composable'

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
const categoryId = ref(null)

const { categories, meta, loading, get } = useGetCategories({
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
        modality: '',
        allowsCodriver: '',
        pointsApply: '',
        championshipId: '',
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

const editCategory = (id) => {
    categoryId.value = id
    editModalVisible.value = true
}

const deleteCategory = (id) => {
    categoryId.value = id
    deleteModalVisible.value = true
}

const onSuccess = () => {
    get(filters.value)
}

onMounted(() => {
    get(filters.value)
})
</script>
