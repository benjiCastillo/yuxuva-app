import { ref } from 'vue'
import RallyStageResultService from '../services/rally-stage-result.service'

export const useDeleteRallyStageResult = ({ onError } = {}) => {
    const rallyStageResult = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const deleteRallyStageResult = async (id) => {
        rallyStageResult.value = null
        try {
            loading.value = true
            const response = await RallyStageResultService.delete(id)
            rallyStageResult.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al eliminar el resultado de etapa',
                status: error.response.status,
            }
            rallyStageResult.value = null
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        rallyStageResult,
        loading,
        errorState,
        deleteRallyStageResult,
    }
}
