import { ref } from 'vue'
import ChampionshipService from '../services/championship.service'

export const useSelectDataChampionship = ({ onError } = {}) => {
    const championships = ref([])
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const selectData = async () => {
        try {
            loading.value = true
            const response = await ChampionshipService.selectData()
            championships.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener los campeonatos',
                status: error.response.status,
            }
            championships.value = []
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        championships,
        loading,
        errorState,
        selectData,
    }
}
