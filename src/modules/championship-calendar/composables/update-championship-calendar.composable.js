import { ref } from 'vue'
import ChampionshipCalendarService from '../services/championship-calendar.service'

export const useUpdateChampionshipCalendar = ({ onError } = {}) => {
    const championshipCalendar = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const updateChampionshipCalendar = async (id, data) => {
        championshipCalendar.value = null
        try {
            loading.value = true
            const response = await ChampionshipCalendarService.update(id, data)
            championshipCalendar.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al actualizar la fecha del calendario',
                status: error.response.status,
                fields: error.response.data.fields,
            }
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        championshipCalendar,
        loading,
        errorState,
        updateChampionshipCalendar,
    }
}
