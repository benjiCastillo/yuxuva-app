import { ref } from 'vue'
import TeamService from '../services/team.service'

export const useUpdateTeam = ({ onError } = {}) => {
    const team = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const updateTeam = async (id, data) => {
        team.value = null
        try {
            loading.value = true
            const response = await TeamService.update(id, data)
            team.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al actualizar el equipo',
                status: error.response.status,
                fields: error.response.data.fields,
            }
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        team,
        loading,
        errorState,
        updateTeam,
    }
}
