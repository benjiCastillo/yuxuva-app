import { ref } from 'vue'
import CategoryService from '../services/category.service'

export const useDeleteCategory = ({ onError } = {}) => {
    const category = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const deleteCategory = async (id) => {
        category.value = null
        try {
            loading.value = true
            const response = await CategoryService.delete(id)
            category.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al eliminar la categoria',
                status: error.response.status,
            }
            category.value = null
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        category,
        loading,
        errorState,
        deleteCategory,
    }
}
