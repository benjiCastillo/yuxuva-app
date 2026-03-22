import { ref } from 'vue'
import RallyStageScheduleService from '../services/rally-stage-schedule.service'

export const useCreateRallyStageSchedule = ({ onError } = {}) => {
    const rallyStageSchedule = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const createRallyStageSchedule = async (data) => {
        rallyStageSchedule.value = null
        try {
            loading.value = true
            const response = await RallyStageScheduleService.add(data)
            rallyStageSchedule.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al crear la programacion de etapa',
                status: error.response.status,
                fields: error.response.data.fields,
            }
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        rallyStageSchedule,
        loading,
        errorState,
        createRallyStageSchedule,
    }
}
