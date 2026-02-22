<template>
    <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Centro de carrera</p>
            <h2 class="text-3xl font-semibold">Hola, Camila</h2>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Tienes 3 fechas activas y 2 cierres de inscripciones pendientes esta semana.
            </p>
        </div>
        <div class="flex items-center gap-3">
            <button
                class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                Ver rankings
            </button>
            <button
                class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-emerald-400 dark:text-slate-950">
                Nueva fecha
            </button>
        </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
            v-for="card in metrics"
            :key="card.label"
            class="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {{ card.label }}
            </p>
            <p class="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {{ card.value }}
            </p>
            <p class="mt-2 text-xs text-emerald-600 dark:text-emerald-300">
                {{ card.delta }}
            </p>
        </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div
            class="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">Cronograma de etapas</p>
                <button class="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Ver todo</button>
            </div>
            <div class="mt-6 grid gap-4">
                <div
                    v-for="item in timeline"
                    :key="item.title"
                    class="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                    <div
                        class="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                        {{ item.time }}
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {{ item.title }}
                        </p>
                        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {{ item.detail }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid gap-6">
            <div
                class="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">Actividad reciente</p>
                <div class="mt-4 grid gap-4 text-sm text-slate-600 dark:text-slate-300">
                    <div v-for="entry in activity" :key="entry.title" class="flex items-start justify-between gap-3">
                        <div>
                            <p class="font-semibold text-slate-900 dark:text-slate-100">{{ entry.title }}</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400">{{ entry.detail }}</p>
                        </div>
                        <span class="text-xs text-slate-400 dark:text-slate-500">{{ entry.time }}</span>
                    </div>
                </div>
            </div>
            <div
                class="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-lg dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
                <p class="text-sm font-semibold">Resumen de temporada</p>
                <p class="mt-4 text-3xl font-semibold">$42.8k</p>
                <p class="mt-2 text-xs text-slate-200">Ingresos proyectados este mes</p>
                <button
                    class="mt-6 w-full rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20">
                    Descargar reporte
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const metrics = [
    { label: 'Fechas del calendario', value: '12', delta: 'Calendario anual listo' },
    { label: 'Pilotos inscritos', value: '186', delta: '+12 esta semana' },
    { label: 'Equipos activos', value: '28', delta: '2 nuevas escuderías' },
    { label: 'Ranking actualizado', value: '04', delta: 'Última fecha validada' },
]

const timeline = [
    { time: '09:00', title: 'Reunión de calendario', detail: 'Dirección deportiva · Sala 3' },
    { time: '11:30', title: 'Cierre de inscripciones', detail: 'Rally Sierra · Online' },
    { time: '15:00', title: 'Publicación de tiempos', detail: 'Fecha 4 · Resultados oficiales' },
]

const activity = [
    { title: 'Ranking general actualizado', detail: 'Fecha 3', time: 'hace 10 min' },
    { title: 'Nuevo equipo inscrito', detail: 'Escudería Granito', time: 'hace 1 h' },
    { title: 'Pilotos confirmados', detail: 'Rally Horizonte', time: 'ayer' },
]
</script>
