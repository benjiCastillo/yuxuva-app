import { ref } from 'vue'
import CarService from '../services/car.service'

export const useCreateCar = ({ onError } = {}) => {
    const car = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const createCar = async (data) => {
        car.value = null
        try {
            loading.value = true
            const response = await CarService.add(data)
            car.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al crear el auto',
                status: error.response.status,
                fields: error.response.data.fields,
            }
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        car,
        loading,
        errorState,
        createCar,
    }
}
