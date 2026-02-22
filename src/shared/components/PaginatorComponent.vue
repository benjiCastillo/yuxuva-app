<template>
    <div class="flex flex-col justify-center items-center">
        <section class="flex justify-center items-center gap-2">
            <Button
                severity="secondary"
                type="button"
                size="small"
                icon="pi pi-refresh"
                outlined
                @click="emit('applyFilters')" />
            <Paginator
                :rows="filters.limit"
                :totalRecords="meta.total"
                @page="emit('toPage', $event.page + 1)"></Paginator>
        </section>
        <div>
            <small>Total:{{ meta.total }} registros.</small>
        </div>
    </div>
</template>

<script setup>
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'

defineProps({
    filters: { type: Object, required: true },
    meta: { type: Object, required: true },
})

const emit = defineEmits(['toPage', 'applyFilters'])
</script>
