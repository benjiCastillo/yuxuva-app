import { ref } from 'vue'
import RallyStageService from '../services/rally-stage.service'

export const useGetRallyStage = ({ onError } = {}) => {
    const rallyStage = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const findOne = async (id) => {
        try {
            loading.value = true
            const response = await RallyStageService.findOne(id)
            rallyStage.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener la etapa del rally',
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
        findOne,
    }
}
