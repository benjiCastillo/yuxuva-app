<template>
    <section class="space-y-6">
        <header class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Autos</h1>
                <p class="mt-1 text-sm text-slate-500">Gestion de autos para la competencia.</p>
            </div>
        </header>
        <CarList />
    </section>
</template>

<script setup lang="ts">
import CarList from '../components/list/CarList.vue'
</script>
