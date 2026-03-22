import { ref } from 'vue'
import RallyStageService from '../services/rally-stage.service'

export const useGetRallyStages = ({ onError } = {}) => {
    const rallyStages = ref([])
    const meta = ref({
        total: 0,
        page: 0,
        pageCount: 0,
    })
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const get = async (query = {}) => {
        try {
            loading.value = true
            const response = await RallyStageService.get(query)
            rallyStages.value = response.data.data
            meta.value.total = response.data.meta.total
            meta.value.page = response.data.meta.page
            meta.value.totalPages = response.data.meta.totalPages
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener las etapas del rally',
                status: error.response.status,
            }
            rallyStages.value = []
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        rallyStages,
        meta,
        loading,
        errorState,
        get,
    }
}
