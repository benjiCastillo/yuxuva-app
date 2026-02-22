<template>
    <div class="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.12),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.65),_transparent_45%)]"></div>
        <div
            class="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(120deg,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:40px_40px] dark:opacity-20"></div>

        <div class="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
            <header class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div
                        class="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                        RC
                    </div>
                    <div>
                        <p class="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                            Rally Control
                        </p>
                        <p class="text-lg font-semibold">Gestión de carreras</p>
                    </div>
                </div>
                <RouterLink
                    to="/admin"
                    class="rounded-full border border-slate-300/80 bg-white/80 px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100">
                    Ver demo
                </RouterLink>
            </header>

            <main class="mt-10 flex flex-1 items-center">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
