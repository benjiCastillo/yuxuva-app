import { ref } from 'vue'
import ChampionshipService from '../services/championship.service'

export const useDeleteChampionship = ({ onError } = {}) => {
    const championship = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const deleteChampionship = async (id) => {
        championship.value = null
        try {
            loading.value = true
            const response = await ChampionshipService.delete(id)
            championship.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener el campeonato',
                status: error.response.status,
            }
            championship.value = null
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        championship,
        loading,
        errorState,
        deleteChampionship,
    }
}
