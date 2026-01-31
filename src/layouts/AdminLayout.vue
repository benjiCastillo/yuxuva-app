<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.12),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.65),_transparent_45%)]"></div>
    <div class="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(120deg,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:40px_40px] dark:opacity-20"></div>

    <div class="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div
            class="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
          >
            RC
          </div>
          <div>
            <p class="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              Rally Control
            </p>
            <p class="text-lg font-semibold">Administración deportiva</p>
          </div>
        </div>
        <button
          type="button"
          class="rounded-full border border-slate-300/80 bg-white/80 px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
          @click="handleLogout"
        >
          Cerrar sesión
        </button>
      </header>

      <main class="mt-8 grid flex-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside
          class="flex flex-col gap-6 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Menú
            </p>
            <p class="mt-2 text-lg font-semibold text-slate-900">Centro de operaciones</p>
          </div>
          <nav class="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <RouterLink
              v-for="item in navigation"
              :key="item.label"
              :to="item.to"
              class="flex items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>{{ item.label }}</span>
              <span class="text-xs text-slate-400">→</span>
            </RouterLink>
          </nav>
          <div
            class="mt-auto rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100"
          >
            <p class="font-semibold">Equipo en pista</p>
            <p class="mt-1 text-xs text-emerald-700 dark:text-emerald-200">
              5 coordinadores conectados
            </p>
            <button
              class="mt-3 w-full rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white dark:bg-emerald-400 dark:text-emerald-950"
            >
              Invitar oficial
            </button>
          </div>
        </aside>

        <section class="grid gap-6">
          <RouterView />
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

const navigation = [
  { label: 'Resumen', to: '/admin' },
  { label: 'Carreras', to: '/admin' },
  { label: 'Circuitos', to: '/admin' },
  { label: 'Pilotos', to: '/admin' },
  { label: 'Equipo técnico', to: '/admin' },
]

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  await router.push('/login')
}
</script>
