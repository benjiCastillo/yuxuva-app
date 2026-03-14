import { ref } from 'vue'
import DepartmentAssociationService from '../services/department-association.service'

export const useDeleteDepartmentAssociation = ({ onError } = {}) => {
    const departmentAssociation = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const deleteDepartmentAssociation = async (id) => {
        departmentAssociation.value = null
        try {
            loading.value = true
            const response = await DepartmentAssociationService.delete(id)
            departmentAssociation.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al eliminar la asociación departamental',
                status: error.response.status,
            }
            departmentAssociation.value = null
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        departmentAssociation,
        loading,
        errorState,
        deleteDepartmentAssociation,
    }
}
