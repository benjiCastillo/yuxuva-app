import { ref } from 'vue'
import CarService from '../services/car.service'

export const useGetCar = ({ onError } = {}) => {
    const car = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const findOne = async (id) => {
        try {
            loading.value = true
            const response = await CarService.findOne(id)
            car.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener el auto',
                status: error.response.status,
            }
            car.value = null
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        car,
        loading,
        errorState,
        findOne,
    }
}
