import { ref } from 'vue'
import CategoryService from '../services/category.service'

export const useSelectDataCategory = ({ onError } = {}) => {
    const categories = ref([])
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const selectData = async () => {
        try {
            loading.value = true
            const response = await CategoryService.selectData()
            categories.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener las categorias',
                status: error.response.status,
            }
            categories.value = []
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        categories,
        loading,
        errorState,
        selectData,
    }
}
