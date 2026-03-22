import { ref } from 'vue'
import RallyStageService from '../services/rally-stage.service'

export const useDeleteRallyStage = ({ onError } = {}) => {
    const rallyStage = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const deleteRallyStage = async (id) => {
        rallyStage.value = null
        try {
            loading.value = true
            const response = await RallyStageService.delete(id)
            rallyStage.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al eliminar la etapa del rally',
                status: error.response.status,
            }
            rallyStage.value = null
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        rallyStage,
        loading,
        errorState,
        deleteRallyStage,
    }
}
