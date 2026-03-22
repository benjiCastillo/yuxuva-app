import { ref } from 'vue'
import RallyStageResultService from '../services/rally-stage-result.service'

export const useUpdateRallyStageResult = ({ onError } = {}) => {
    const rallyStageResult = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const updateRallyStageResult = async (id, data) => {
        rallyStageResult.value = null
        try {
            loading.value = true
            const response = await RallyStageResultService.update(id, data)
            rallyStageResult.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al actualizar el resultado de etapa',
                status: error.response.status,
                fields: error.response.data.fields,
            }
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        rallyStageResult,
        loading,
        errorState,
        updateRallyStageResult,
    }
}
