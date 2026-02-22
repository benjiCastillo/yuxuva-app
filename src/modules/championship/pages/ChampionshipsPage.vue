<template>
    <section class="space-y-6">
        <header class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Campeonatos</h1>
                <p class="mt-1 text-sm text-slate-500">Gestión de campeonatos.</p>
            </div>
        </header>
        <ChampionshipList />
    </section>
</template>

<script setup lang="ts">
import ChampionshipList from '../components/list/ChampionshipList.vue'
</script>
