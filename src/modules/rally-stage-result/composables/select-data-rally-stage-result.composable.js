import { ref } from 'vue'
import RallyStageResultService from '../services/rally-stage-result.service'

export const useSelectDataRallyStageResult = ({ onError } = {}) => {
    const rallyStageResults = ref([])
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const selectData = async () => {
        try {
            loading.value = true
            const response = await RallyStageResultService.selectData()
            rallyStageResults.value = response.data
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
        loading,
        errorState,
        selectData,
    }
}
