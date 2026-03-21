import { ref } from 'vue'
import TeamService from '../services/team.service'

export const useDeleteTeam = ({ onError } = {}) => {
    const team = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const deleteTeam = async (id) => {
        team.value = null
        try {
            loading.value = true
            const response = await TeamService.delete(id)
            team.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al eliminar el equipo',
                status: error.response.status,
            }
            team.value = null
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        team,
        loading,
        errorState,
        deleteTeam,
    }
}
