<template>
    <aside
        class="fixed inset-y-0 left-0 z-30 flex w-72 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white shadow-xl transition-[width,transform,opacity] duration-300 ease-out lg:relative lg:z-10 lg:shadow-none"
        :class="[
            isMobile
                ? isOpen
                    ? 'translate-x-0'
                    : '-translate-x-full'
                : isOpen
                  ? 'translate-x-0 lg:w-72 lg:opacity-100'
                  : '-translate-x-full lg:w-0 lg:min-w-0 lg:border-r-0 lg:opacity-0 lg:pointer-events-none',
        ]"
        aria-label="Sidebar">
        <div class="flex h-16 items-center border-b border-slate-200 px-5">
            <div class="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                YX
            </div>
            <div class="ml-3 min-w-0">
                <p class="truncate text-sm font-semibold text-slate-900">Rally Control</p>
                <p class="truncate text-xs text-slate-500">Operations panel</p>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto px-3 py-4">
            <AppMenu :items="items" @navigate="handleNavigate" />
        </div>
    </aside>
</template>

<script setup>
import AppMenu from '@/modules/admin/components/AppMenu.vue'
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    isMobile: {
        type: Boolean,
        default: false,
    },
    items: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['navigate'])

const handleNavigate = () => {
    if (props.isMobile) {
        emit('navigate')
    }
}
</script>
