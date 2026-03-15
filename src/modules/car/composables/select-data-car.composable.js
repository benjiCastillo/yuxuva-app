import { ref } from 'vue'
import CarService from '../services/car.service'

export const useSelectDataCar = ({ onError } = {}) => {
    const cars = ref([])
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const selectData = async () => {
        try {
            loading.value = true
            const response = await CarService.selectData()
            cars.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener los autos',
                status: error.response.status,
            }
            cars.value = []
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        cars,
        loading,
        errorState,
        selectData,
    }
}
