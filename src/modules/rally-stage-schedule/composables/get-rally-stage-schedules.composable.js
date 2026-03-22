import { ref } from 'vue'
import RallyStageScheduleService from '../services/rally-stage-schedule.service'

export const useGetRallyStageSchedules = ({ onError } = {}) => {
    const rallyStageSchedules = ref([])
    const meta = ref({
        total: 0,
        page: 0,
        totalPages: 0,
    })
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const get = async (query = {}) => {
        try {
            loading.value = true
            const response = await RallyStageScheduleService.get(query)
            rallyStageSchedules.value = response.data.data
            meta.value.total = response.data.meta.total
            meta.value.page = response.data.meta.page
            meta.value.totalPages = response.data.meta.totalPages
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrio un error al obtener las programaciones de etapas',
                status: error.response.status,
            }
            rallyStageSchedules.value = []
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        rallyStageSchedules,
        meta,
        loading,
        errorState,
        get,
    }
}
