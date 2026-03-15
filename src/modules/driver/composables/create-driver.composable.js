import { ref } from 'vue'
import DriverService from '../services/driver.service'

export const useCreateDriver = ({ onError } = {}) => {
    const driver = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const createDriver = async (data) => {
        driver.value = null
        try {
            loading.value = true
            const response = await DriverService.add(data)
            driver.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al crear el piloto',
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
        createDriver,
    }
}
