import { ref } from 'vue'
import CarService from '../services/car.service'

export const useGetCars = ({ onError } = {}) => {
    const cars = ref([])
    const meta = ref({
        total: 0,
        page: 0,
        pageCount: 0,
    })
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const get = async (query = {}) => {
        try {
            loading.value = true
            const response = await CarService.get(query)
            cars.value = response.data.data
            meta.value.total = response.data.meta.total
            meta.value.page = response.data.meta.page
            meta.value.totalPages = response.data.meta.totalPages
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
        meta,
        loading,
        errorState,
        get,
    }
}
