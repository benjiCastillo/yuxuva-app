import { ref } from 'vue'
import RallyService from '../services/rally.service'

export const useSelectDataRally = ({ onError } = {}) => {
    const rallies = ref([])
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const selectData = async () => {
        try {
            loading.value = true
            const response = await RallyService.selectData()
            rallies.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener los rallies',
                status: error.response.status,
            }
            rallies.value = []
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        rallies,
        loading,
        errorState,
        selectData,
    }
}
