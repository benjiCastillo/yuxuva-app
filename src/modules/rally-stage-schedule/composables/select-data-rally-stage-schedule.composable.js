import { ref } from 'vue'
import RallyStageScheduleService from '../services/rally-stage-schedule.service'

export const useSelectDataRallyStageSchedule = ({ onError } = {}) => {
    const rallyStageSchedules = ref([])
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const selectData = async (query = {}) => {
        try {
            loading.value = true
            const response = await RallyStageScheduleService.selectData(query)
            rallyStageSchedules.value = response.data
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
        loading,
        errorState,
        selectData,
    }
}
