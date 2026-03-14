<template>
    <section class="space-y-6">
        <header class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Calendario de campeonatos</h1>
                <p class="mt-1 text-sm text-slate-500">Gestion de fechas por campeonato.</p>
            </div>
        </header>
        <ChampionshipCalendarList />
    </section>
</template>

<script setup lang="ts">
import ChampionshipCalendarList from '../components/list/ChampionshipCalendarList.vue'
</script>
