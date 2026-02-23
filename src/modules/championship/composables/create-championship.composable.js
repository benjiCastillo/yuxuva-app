import { ref } from 'vue'
import ChampionshipService from '../services/championship.service'

export const useCreateChampionship = ({ onError } = {}) => {
    const championship = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const createChampionship = async (data) => {
        championship.value = null
        try {
            loading.value = true
            const response = await ChampionshipService.add(data)
            championship.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al crear el campeonato',
                status: error.response.status,
                fields: error.response.data.fields,
            }
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        championship,
        loading,
        errorState,
        createChampionship,
    }
}
