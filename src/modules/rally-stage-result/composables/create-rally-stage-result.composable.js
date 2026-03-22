import { ref } from 'vue'
import RallyStageResultService from '../services/rally-stage-result.service'

export const useCreateRallyStageResult = ({ onError } = {}) => {
    const rallyStageResult = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const createRallyStageResult = async (data) => {
        rallyStageResult.value = null
        try {
            loading.value = true
            const response = await RallyStageResultService.add(data)
            rallyStageResult.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al crear el resultado de etapa',
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
        createRallyStageResult,
    }
}
