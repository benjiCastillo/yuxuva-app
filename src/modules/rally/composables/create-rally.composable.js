import { ref } from 'vue'
import RallyService from '../services/rally.service'

export const useCreateRally = ({ onError } = {}) => {
    const rally = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const createRally = async (data) => {
        rally.value = null
        try {
            loading.value = true
            const response = await RallyService.add(data)
            rally.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al crear el rally',
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
        createRally,
    }
}
