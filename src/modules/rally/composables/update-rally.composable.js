import { ref } from 'vue'
import RallyService from '../services/rally.service'

export const useUpdateRally = ({ onError } = {}) => {
    const rally = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const updateRally = async (id, data) => {
        rally.value = null
        try {
            loading.value = true
            const response = await RallyService.update(id, data)
            rally.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al actualizar el rally',
                status: error.response.status,
                fields: error.response.data.fields,
            }
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        rally,
        loading,
        errorState,
        updateRally,
    }
}
