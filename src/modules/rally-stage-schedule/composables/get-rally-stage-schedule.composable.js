import { ref } from 'vue'
import RallyStageScheduleService from '../services/rally-stage-schedule.service'

export const useGetRallyStageSchedule = ({ onError } = {}) => {
    const rallyStageSchedule = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const findOne = async (id) => {
        try {
            loading.value = true
            const response = await RallyStageScheduleService.findOne(id)
            rallyStageSchedule.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrio un error al obtener la programacion de etapa',
                status: error.response.status,
            }
            rallyStageSchedule.value = null
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        rallyStageSchedule,
        loading,
        errorState,
        findOne,
    }
}
