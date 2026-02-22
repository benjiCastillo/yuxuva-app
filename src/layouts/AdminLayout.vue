<template>
    <div class="min-h-screen bg-slate-100 text-slate-900">
        <AppTopbar
            :breadcrumbs="breadcrumbs"
            :user-name="userDisplayName"
            @toggle-sidebar="toggleSidebar"
            @open-profile="handleOpenProfile"
            @logout="handleLogout" />

        <div class="relative flex min-h-[calc(100vh-4rem)]">
            <AppSidebar :is-open="isSidebarOpen" :is-mobile="isMobile" :items="menuItems" @navigate="closeSidebar" />

            <Transition
                enter-active-class="transition-opacity duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <button
                    v-if="isMobile && isSidebarOpen"
                    class="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
                    type="button"
                    aria-label="Close menu"
                    @click="closeSidebar" />
            </Transition>

            <main class="relative z-10 flex-1 p-4 transition-all duration-300 sm:p-6">
                <div class="flex min-h-full flex-col gap-6">
                    <div class="flex-1">
                        <RouterView />
                    </div>
                    <AppFooter v-if="showFooter" />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AppFooter from '@/modules/admin/components/AppFooter.vue'
import AppSidebar from '@/modules/admin/components/AppSidebar.vue'
import AppTopbar from '@/modules/admin/components/AppTopbar.vue'
import { createLayoutState, provideLayout } from '@/composables/useLayout'
import { useAuthStore } from '@/store/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuConfig = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard', roles: ['admin', 'manager', 'viewer'] },
    { label: 'Users', icon: 'pi pi-users', route: '/users', roles: ['admin', 'manager'] },
    { label: 'Campeonatos', icon: 'pi pi-trophy', route: '/championships', roles: ['admin', 'manager', 'viewer'] },
]

const role = computed(() => {
    const roleValue = authStore.user?.role
    return typeof roleValue === 'string' ? roleValue.toLowerCase() : null
})

const userDisplayName = computed(() => {
    return authStore.user?.name ?? authStore.user?.email ?? 'User'
})

const layoutState = createLayoutState(menuConfig, role)
provideLayout(layoutState)

const { isSidebarOpen, isMobile, menuItems, closeSidebar, toggleSidebar } = layoutState
const showFooter = true

watch(
    () => route.path,
    () => {
        if (isMobile.value) {
            closeSidebar()
        }
    }
)

const breadcrumbs = computed(() => {
    const labels = route.matched
        .map((record) => {
            const raw = record.meta?.breadcrumb ?? record.name
            if (!raw) {
                return null
            }
            return String(raw)
        })
        .filter(Boolean)

    if (labels.length > 0) {
        return labels
    }

    return ['Admin']
})

const handleOpenProfile = async () => {
    await router.push('/profile')
}

const handleLogout = async () => {
    await authStore.logout()
    await router.push('/login')
}
</script>
