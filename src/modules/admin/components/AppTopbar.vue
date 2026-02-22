<template>
    <header
        class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div class="flex min-w-0 items-center gap-3">
                <Button
                    icon="pi pi-bars"
                    severity="secondary"
                    text
                    aria-label="Toggle menu"
                    @click="emit('toggle-sidebar')" />

                <div class="min-w-0">
                    <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Admin Workspace</p>
                    <nav class="truncate text-sm text-slate-600" aria-label="Breadcrumb">
                        <span v-for="(crumb, index) in breadcrumbs" :key="crumb" class="inline-flex items-center">
                            <span v-if="index > 0" class="mx-2 text-slate-300">/</span>
                            <span class="truncate">{{ crumb }}</span>
                        </span>
                    </nav>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <Button icon="pi pi-search" severity="secondary" text rounded aria-label="Search" size="small" />
                <Button icon="pi pi-cog" severity="secondary" text rounded aria-label="Settings" size="small" />
                <Button icon="pi pi-bell" severity="secondary" text rounded aria-label="Alerts" size="small" />

                <button
                    type="button"
                    class="ml-1 flex items-center rounded-full ring-offset-2 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                    aria-haspopup="menu"
                    aria-label="Open user menu"
                    @click="toggleUserMenu">
                    <Avatar :label="userInitials" shape="circle" class="bg-slate-900 text-white" size="normal" />
                </button>

                <Menu ref="userMenu" :model="userMenuItems" popup />
            </div>
        </div>
    </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Menu from 'primevue/menu'

const props = defineProps({
    breadcrumbs: {
        type: Array,
        default: () => [],
    },
    userName: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['toggle-sidebar', 'open-profile', 'logout'])

const userMenu = ref(null)

const userInitials = computed(() => {
    const source = props.userName?.trim()

    if (!source) {
        return 'US'
    }

    const parts = source.split(/\s+/).filter(Boolean)
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase()
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
})

const userMenuItems = computed(() => [
    {
        label: 'Perfil',
        icon: 'pi pi-user',
        command: () => emit('open-profile'),
    },
    {
        separator: true,
    },
    {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => emit('logout'),
    },
])

const toggleUserMenu = (event) => {
    userMenu.value?.toggle(event)
}
</script>
