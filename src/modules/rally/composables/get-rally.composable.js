import { ref } from 'vue'
import RallyService from '../services/rally.service'

export const useGetRally = ({ onError } = {}) => {
    const rally = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const findOne = async (id) => {
        try {
            loading.value = true
            const response = await RallyService.findOne(id)
            rally.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener el rally',
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
        findOne,
    }
}
