import { ref } from 'vue'
import TeamService from '../services/team.service'

export const useSelectDataTeam = ({ onError } = {}) => {
    const teams = ref([])
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const selectData = async () => {
        try {
            loading.value = true
            const response = await TeamService.selectData()
            teams.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener los equipos',
                status: error.response.status,
            }
            teams.value = []
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        teams,
        loading,
        errorState,
        selectData,
    }
}
