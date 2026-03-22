import { ref } from 'vue'
import RallyStageResultService from '../services/rally-stage-result.service'

export const useGetRallyStageResults = ({ onError } = {}) => {
    const rallyStageResults = ref([])
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
            const response = await RallyStageResultService.get(query)
            rallyStageResults.value = response.data.data
            meta.value.total = response.data.meta.total
            meta.value.page = response.data.meta.page
            meta.value.totalPages = response.data.meta.totalPages
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener los resultados de etapas',
                status: error.response.status,
            }
            rallyStageResults.value = []
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        rallyStageResults,
        meta,
        loading,
        errorState,
        get,
    }
}
