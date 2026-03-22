import { ref } from 'vue'
import RallyStageScheduleService from '../services/rally-stage-schedule.service'

export const useUpdateRallyStageSchedule = ({ onError } = {}) => {
    const rallyStageSchedule = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const updateRallyStageSchedule = async (id, data) => {
        rallyStageSchedule.value = null
        try {
            loading.value = true
            const response = await RallyStageScheduleService.update(id, data)
            rallyStageSchedule.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al actualizar la programacion de etapa',
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
        updateRallyStageSchedule,
    }
}
