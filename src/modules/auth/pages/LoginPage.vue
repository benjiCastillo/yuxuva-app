<template>
  <div class="grid w-full gap-8 lg:grid-cols-[1.1fr_1fr]">
    <section class="flex flex-col justify-center gap-6">
      <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">
        Control total de carreras de rally y circuitos.
      </h1>
      <p class="max-w-lg text-base text-slate-600 dark:text-slate-300">
        Inicia sesión para gestionar el calendario anual, pilotos, equipos,
        tiempos y rankings en un tablero único. Diseñado para direcciones
        deportivas y logística en pista.
      </p>
      <div class="grid gap-4 sm:grid-cols-2">
        <div
          class="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
        >
          <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Calendario anual
          </p>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Fechas, sedes y etapas de toda la temporada en un solo lugar.
          </p>
        </div>
        <div
          class="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
        >
          <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Ranking y tiempos
          </p>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Clasificaciones, tiempos oficiales y penalizaciones visibles al
            instante.
          </p>
        </div>
      </div>
      <div
        class="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
      >
        <span class="rounded-full bg-white/80 px-3 py-1 dark:bg-slate-900/80">
          Gestión por etapas
        </span>
        <span class="rounded-full bg-white/80 px-3 py-1 dark:bg-slate-900/80">
          Seguridad en pista
        </span>
        <span class="rounded-full bg-white/80 px-3 py-1 dark:bg-slate-900/80">
          Equipos coordinados
        </span>
      </div>
    </section>

    <section class="relative">
      <div
        class="absolute -inset-2 rounded-[32px] from-white/70 via-white/40 to-amber-100/60 blur-xl"
      ></div>
      <div
        class="relative rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/90"
      >
        <LoginForm />
      </div>
    </section>
  </div>
</template>
<script setup>
import LoginForm from "../componentes/LoginForm.vue";
</script>
