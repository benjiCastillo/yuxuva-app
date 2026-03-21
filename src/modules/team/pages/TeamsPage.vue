<template>
    <section class="space-y-6">
        <header class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Equipos</h1>
                <p class="mt-1 text-sm text-slate-500">Gestion de equipos inscritos por campeonato.</p>
            </div>
        </header>
        <TeamList />
    </section>
</template>

<script setup>
import TeamList from '../components/list/TeamList.vue'
</script>
