import { ref } from 'vue'
import DriverService from '../services/driver.service'

export const useUpdateDriver = ({ onError } = {}) => {
    const driver = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const updateDriver = async (id, data) => {
        driver.value = null
        try {
            loading.value = true
            const response = await DriverService.update(id, data)
            driver.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al actualizar el piloto',
                status: error.response.status,
                fields: error.response.data.fields,
            }
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        driver,
        loading,
        errorState,
        updateDriver,
    }
}
