<template>
    <section class="space-y-6">
        <header class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Resultados de Etapas</h1>
                <p class="mt-1 text-sm text-slate-500">Gestion de tiempos y penalizaciones por etapa.</p>
            </div>
        </header>
        <RallyStageResultList />
    </section>
</template>

<script setup>
import RallyStageResultList from '../components/list/RallyStageResultList.vue'
</script>
