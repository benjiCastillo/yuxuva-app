<template>
    <section class="space-y-6">
        <header class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Rallies</h1>
                <p class="mt-1 text-sm text-slate-500">Gestion de rallies por fecha del calendario.</p>
            </div>
        </header>
        <RallyList />
    </section>
</template>

<script setup>
import RallyList from '../components/list/RallyList.vue'
</script>
