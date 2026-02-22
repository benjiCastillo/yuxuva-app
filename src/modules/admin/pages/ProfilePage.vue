<template>
  <section class="space-y-6">
    <header>
      <h1 class="text-2xl font-semibold text-slate-900">Perfil</h1>
      <p class="mt-1 text-sm text-slate-500">Información del usuario autenticado.</p>
    </header>

    <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <dl class="grid gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs uppercase tracking-[0.2em] text-slate-500">Nombre</dt>
          <dd class="mt-1 text-sm font-medium text-slate-900">{{ profile.name }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-[0.2em] text-slate-500">Email</dt>
          <dd class="mt-1 text-sm font-medium text-slate-900">{{ profile.email }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-[0.2em] text-slate-500">Rol</dt>
          <dd class="mt-1 text-sm font-medium text-slate-900">{{ profile.role }}</dd>
        </div>
      </dl>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth.store'

const authStore = useAuthStore()

const profile = computed(() => ({
  name: authStore.user?.name ?? 'Usuario',
  email: authStore.user?.email ?? 'No disponible',
  role: authStore.user?.role ?? 'Sin rol',
}))
</script>
