import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useUrlFilters(defaults = {}, useUrl = false) {
    const router = useRouter()
    const route = useRoute()

    // 1. Por defecto NO usamos la URL
    const initial = useUrl
        ? {
              ...defaults,
              ...Object.fromEntries(
                  Object.entries(route.query).map(([key, val]) => {
                      if (!isNaN(val) && val.trim() !== '') return [key, Number(val)]
                      return [key, val]
                  })
              ),
          }
        : { ...defaults }

    const filters = ref(initial)

    // 2. Mantener sync hacia la URL *solo si useUrl es true*
    watch(
        filters,
        (val) => {
            if (!useUrl) return

            const query = {}

            for (const [key, value] of Object.entries(val)) {
                if (value !== null && value !== '' && value !== undefined) {
                    query[key] = value
                }
            }

            router.replace({ query })
        },
        { deep: true }
    )

    const updateFilters = (next = {}) => {
        filters.value = { ...filters.value, ...next }
    }

    const resetFilters = () => {
        filters.value = { ...defaults }
        if (useUrl) router.replace({ query: {} })
    }

    return {
        filters,
        updateFilters,
        resetFilters,
    }
}
