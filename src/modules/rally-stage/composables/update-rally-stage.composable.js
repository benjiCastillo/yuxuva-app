import { ref } from 'vue'
import RallyStageService from '../services/rally-stage.service'

export const useUpdateRallyStage = ({ onError } = {}) => {
    const rallyStage = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const updateRallyStage = async (id, data) => {
        rallyStage.value = null
        try {
            loading.value = true
            const response = await RallyStageService.update(id, data)
            rallyStage.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al actualizar la etapa del rally',
                status: error.response.status,
                fields: error.response.data.fields,
            }
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        rallyStage,
        loading,
        errorState,
        updateRallyStage,
    }
}
