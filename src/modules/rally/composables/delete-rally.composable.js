import { ref } from 'vue'
import RallyService from '../services/rally.service'

export const useDeleteRally = ({ onError } = {}) => {
    const rally = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const deleteRally = async (id) => {
        rally.value = null
        try {
            loading.value = true
            const response = await RallyService.delete(id)
            rally.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al eliminar el rally',
                status: error.response.status,
            }
            rally.value = null
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        rally,
        loading,
        errorState,
        deleteRally,
    }
}
