import { ref } from 'vue'
import FederationService from '../services/federation.service'

export const useSelectDataFederation = ({ onError } = {}) => {
    const federations = ref([])
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const selectData = async () => {
        try {
            loading.value = true
            const response = await FederationService.selectData()
            federations.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener las federaciones',
                status: error.response.status,
            }
            federations.value = []
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        federations,
        loading,
        errorState,
        selectData,
    }
}
