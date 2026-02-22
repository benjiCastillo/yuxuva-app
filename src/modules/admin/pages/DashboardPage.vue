<template>
  <section class="space-y-6">
    <header class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p class="mt-1 text-sm text-slate-500">Resumen operativo del panel administrativo.</p>
      </div>
      <Button label="Nuevo reporte" size="small" />
    </header>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="metric in metrics"
        :key="metric.label"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <p class="text-xs uppercase tracking-[0.2em] text-slate-500">{{ metric.label }}</p>
        <p class="mt-3 text-2xl font-semibold text-slate-900">{{ metric.value }}</p>
        <p class="mt-2 text-xs text-emerald-600">{{ metric.trend }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

const metrics = [
  { label: 'Active Users', value: '1,248', trend: '+12.4% vs last month' },
  { label: 'Open Tickets', value: '38', trend: '-8 this week' },
  { label: 'System Health', value: '99.98%', trend: 'No critical incidents' },
  { label: 'Pending Approvals', value: '14', trend: '4 high priority' },
]
</script>
