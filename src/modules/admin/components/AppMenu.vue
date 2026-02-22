<template>
    <nav class="space-y-1" aria-label="Main navigation">
        <RouterLink
            v-for="item in items"
            :key="item.route"
            :to="item.route"
            class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200"
            :class="
                isActive(item.route)
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            "
            @click="emit('navigate')">
            <i :class="item.icon || 'pi pi-circle'" class="text-base" aria-hidden="true" />
            <span>{{ item.label }}</span>
        </RouterLink>
    </nav>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
defineProps({
    items: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['navigate'])

const route = useRoute()

const isActive = (targetRoute) => {
    return route.path === targetRoute || route.path.startsWith(`${targetRoute}/`)
}
</script>
