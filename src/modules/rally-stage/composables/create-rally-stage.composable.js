import { ref } from 'vue'
import RallyStageService from '../services/rally-stage.service'

export const useCreateRallyStage = ({ onError } = {}) => {
    const rallyStage = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const createRallyStage = async (data) => {
        rallyStage.value = null
        try {
            loading.value = true
            const response = await RallyStageService.add(data)
            rallyStage.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al crear la etapa del rally',
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
        createRallyStage,
    }
}
