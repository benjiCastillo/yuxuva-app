<template>
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex justify-end mb-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" size="small" @click="addModalVisible = true" />
        </div>
        <DataTable
            :value="championships"
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
                <template #body="slotProps">
                    {{ slotProps.data?.name }}
                </template>
            </Column>
            <Column field="modality" header="Modalidad" :showFilterMenu="false" style="width: 20rem">
                <template #filter>
                    <ModalitySelect
                        v-model.trim="filters.modality"
                        fieldName="modality"
                        @update:modelValue="applyFilters()" />
                </template>
                <template #body="slotProps">
                    {{ slotProps.data?.modality }}
                </template>
            </Column>
            <Column field="season" header="Temporada" :showFilterMenu="false" style="width: 7rem"></Column>
            <Column field="status" header="Estado" :showFilterMenu="false" style="width: 7rem"></Column>
            <Column field="federationId" header="Organiza" :showFilterMenu="false" style="width: 7rem">
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
                            @click="editChampionship(slotProps.data?.id)" />

                        <Button
                            severity="danger"
                            type="button"
                            size="small"
                            icon="pi pi-trash"
                            title="Eliminar"
                            @click="deleteChampionship(slotProps.data?.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
        <PaginatorComponent :filters="filters" :meta="meta" @toPage="toPage" @applyFilters="applyFilters" />

        <ChampionshipAddModal v-if="addModalVisible" v-model="addModalVisible" @success="onSuccess" />

        <ChampionshipEditModal
            v-if="editModalVisible"
            v-model="editModalVisible"
            :championshipId="championshipId"
            @success="onSuccess" />

        <ChampionshipDeleteModal
            v-if="deleteModalVisible"
            v-model="deleteModalVisible"
            :championshipId="championshipId"
            @success="onSuccess" />
    </section>
</template>
<script setup>
import { onMounted, nextTick, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

import FederationSelectFilter from '@/modules/federation/components/FederationSelectFilter.vue'
import ModalitySelect from '../commons/ModalitySelect.vue'
import PaginatorComponent from '@/shared/components/PaginatorComponent.vue'
import ChampionshipAddModal from '../add/ChampionshipAddModal.vue'
import ChampionshipEditModal from '../edit/ChampionshipEditModal.vue'
import ChampionshipDeleteModal from '../delete/ChampionshipDeleteModal.vue'

//filters
import { useUrlFilters } from '@/shared/composables/use-url-filters'
import { useGetChampionships } from '../../composables/get-championships.composable'

import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const router = useRouter()

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
const championshipId = ref(null)

const { championships, meta, loading, get } = useGetChampionships({
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
        season: '',
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

const editChampionship = (id) => {
    championshipId.value = id
    editModalVisible.value = true
}

const deleteChampionship = (id) => {
    championshipId.value = id
    deleteModalVisible.value = true
}

const onSuccess = () => {
    get(filters.value)
}

onMounted(() => {
    get(filters.value)
})
</script>
