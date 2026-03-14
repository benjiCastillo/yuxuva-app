import { ref } from 'vue'
import ChampionshipCalendarService from '../services/championship-calendar.service'

export const useSelectDataChampionshipCalendar = ({ onError } = {}) => {
    const championshipCalendars = ref([])
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const selectData = async () => {
        try {
            loading.value = true
            const response = await ChampionshipCalendarService.selectData()
            championshipCalendars.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener las fechas del calendario',
                status: error.response.status,
            }
            championshipCalendars.value = []
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        championshipCalendars,
        loading,
        errorState,
        selectData,
    }
}
