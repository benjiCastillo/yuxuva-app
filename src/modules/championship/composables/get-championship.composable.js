import { ref } from 'vue'
import ChampionshipService from '../services/championship.service'

export const useGetChampionship = ({ onError } = {}) => {
    const championship = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const findOne = async (id) => {
        try {
            loading.value = true
            const response = await ChampionshipService.findOne(id)
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
        findOne,
    }
}
