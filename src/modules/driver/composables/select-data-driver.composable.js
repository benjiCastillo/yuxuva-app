import { ref } from 'vue'
import DriverService from '../services/driver.service'

export const useSelectDataDriver = ({ onError } = {}) => {
    const drivers = ref([])
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const selectData = async () => {
        try {
            loading.value = true
            const response = await DriverService.selectData()
            drivers.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener los pilotos',
                status: error.response.status,
            }
            drivers.value = []
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        drivers,
        loading,
        errorState,
        selectData,
    }
}
