import { ref } from 'vue'
import ChampionshipCalendarService from '../services/championship-calendar.service'

export const useGetChampionshipCalendars = ({ onError } = {}) => {
    const championshipCalendars = ref([])
    const meta = ref({
        total: 0,
        page: 0,
        pageCount: 0,
    })
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const get = async (query = {}) => {
        try {
            loading.value = true
            const response = await ChampionshipCalendarService.get(query)
            championshipCalendars.value = response.data.data
            meta.value.total = response.data.meta.total
            meta.value.page = response.data.meta.page
            meta.value.totalPages = response.data.meta.totalPages
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
        meta,
        loading,
        errorState,
        get,
    }
}
