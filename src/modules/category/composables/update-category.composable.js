import { ref } from 'vue'
import CategoryService from '../services/category.service'

export const useUpdateCategory = ({ onError } = {}) => {
    const category = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const updateCategory = async (id, data) => {
        category.value = null
        try {
            loading.value = true
            const response = await CategoryService.update(id, data)
            category.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al actualizar la categoria',
                status: error.response.status,
                fields: error.response.data.fields,
            }
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        category,
        loading,
        errorState,
        updateCategory,
    }
}
