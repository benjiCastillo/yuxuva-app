<template>
    <section class="space-y-6">
        <header class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Users</h1>
                <p class="mt-1 text-sm text-slate-500">Gestión inicial de usuarios y permisos.</p>
            </div>
            <Button label="Add user" size="small" severity="secondary" />
        </header>

        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table class="min-w-full divide-y divide-slate-200 text-sm">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="px-4 py-3 text-left font-medium text-slate-600">Name</th>
                        <th class="px-4 py-3 text-left font-medium text-slate-600">Role</th>
                        <th class="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="user in users" :key="user.email">
                        <td class="px-4 py-3 font-medium text-slate-900">{{ user.name }}</td>
                        <td class="px-4 py-3 text-slate-600">{{ user.role }}</td>
                        <td class="px-4 py-3">
                            <span class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                {{ user.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

const users = [
    { name: 'Camila Rivera', email: 'camila@example.com', role: 'Admin', status: 'Active' },
    { name: 'Luis Morales', email: 'luis@example.com', role: 'Manager', status: 'Active' },
    { name: 'Ana Torres', email: 'ana@example.com', role: 'Viewer', status: 'Active' },
]
</script>
