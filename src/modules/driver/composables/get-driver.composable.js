import { ref } from 'vue'
import DriverService from '../services/driver.service'

export const useGetDriver = ({ onError } = {}) => {
    const driver = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const findOne = async (id) => {
        try {
            loading.value = true
            const response = await DriverService.findOne(id)
            driver.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener el piloto',
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
        findOne,
    }
}
