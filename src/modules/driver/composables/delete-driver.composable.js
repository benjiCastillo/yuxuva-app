import { ref } from 'vue'
import DriverService from '../services/driver.service'

export const useDeleteDriver = ({ onError } = {}) => {
    const driver = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const deleteDriver = async (id) => {
        driver.value = null
        try {
            loading.value = true
            const response = await DriverService.delete(id)
            driver.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al eliminar el piloto',
                status: error.response.status,
            }
            driver.value = null
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        driver,
        loading,
        errorState,
        deleteDriver,
    }
}
