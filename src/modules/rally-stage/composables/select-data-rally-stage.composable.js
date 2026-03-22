import { ref } from 'vue'
import RallyStageService from '../services/rally-stage.service'

export const useSelectDataRallyStage = ({ onError } = {}) => {
    const rallyStages = ref([])
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const selectData = async () => {
        try {
            loading.value = true
            const response = await RallyStageService.selectData()
            rallyStages.value = response.data
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
        loading,
        errorState,
        selectData,
    }
}
