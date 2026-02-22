import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  readonly,
  ref,
  unref,
  type ComputedRef,
  type InjectionKey,
  type MaybeRef,
  type Ref,
} from 'vue'

export interface AdminMenuItem {
  label: string
  icon?: string
  route: string
  roles?: string[]
}

export interface LayoutContext {
  isSidebarOpen: Readonly<Ref<boolean>>
  isMobile: Readonly<Ref<boolean>>
  menuItems: ComputedRef<AdminMenuItem[]>
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
}

const layoutKey: InjectionKey<LayoutContext> = Symbol('layout')
const mobileQuery = '(max-width: 1023px)'

export const createLayoutState = (items: AdminMenuItem[], role?: MaybeRef<string | null | undefined>) => {
  const isSidebarOpen = ref(true)
  const isMobile = ref(false)
  const mediaQueryList = ref<MediaQueryList | null>(null)

  const updateIsMobile = (event?: MediaQueryListEvent) => {
    const mobile = event ? event.matches : Boolean(mediaQueryList.value?.matches)
    isMobile.value = mobile

    if (mobile) {
      isSidebarOpen.value = false
      return
    }

    isSidebarOpen.value = true
  }

  onMounted(() => {
    mediaQueryList.value = window.matchMedia(mobileQuery)
    updateIsMobile()
    mediaQueryList.value.addEventListener('change', updateIsMobile)
  })

  onBeforeUnmount(() => {
    mediaQueryList.value?.removeEventListener('change', updateIsMobile)
  })

  const menuItems = computed(() => {
    return items.filter((item) => {
      if (!item.roles?.length) {
        return true
      }

      const currentRole = unref(role)

      if (!currentRole) {
        // Fallback while auth/user role is not available yet.
        return true
      }

      return item.roles.includes(currentRole)
    })
  })

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const openSidebar = () => {
    isSidebarOpen.value = true
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  return {
    isSidebarOpen,
    isMobile,
    menuItems,
    toggleSidebar,
    openSidebar,
    closeSidebar,
  }
}

export const provideLayout = (context: ReturnType<typeof createLayoutState>) => {
  provide(layoutKey, {
    ...context,
    isSidebarOpen: readonly(context.isSidebarOpen),
    isMobile: readonly(context.isMobile),
  })
}

export const useLayout = () => {
  const context = inject(layoutKey)

  if (!context) {
    throw new Error('useLayout must be used within a layout provider')
  }

  return context
}
