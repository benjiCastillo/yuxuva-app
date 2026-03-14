import { ref } from 'vue'
import ChampionshipCalendarService from '../services/championship-calendar.service'

export const useGetChampionshipCalendar = ({ onError } = {}) => {
    const championshipCalendar = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const findOne = async (id) => {
        try {
            loading.value = true
            const response = await ChampionshipCalendarService.findOne(id)
            championshipCalendar.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener la fecha del calendario',
                status: error.response.status,
            }
            championshipCalendar.value = null
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        championshipCalendar,
        loading,
        errorState,
        findOne,
    }
}
