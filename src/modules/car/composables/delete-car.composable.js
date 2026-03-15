import { ref } from 'vue'
import CarService from '../services/car.service'

export const useDeleteCar = ({ onError } = {}) => {
    const car = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const deleteCar = async (id) => {
        car.value = null
        try {
            loading.value = true
            const response = await CarService.delete(id)
            car.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al eliminar el auto',
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
        deleteCar,
    }
}
