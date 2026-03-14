import { ref } from 'vue'
import DepartmentAssociationService from '../services/department-association.service'

export const useUpdateDepartmentAssociation = ({ onError } = {}) => {
    const departmentAssociation = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const updateDepartmentAssociation = async (id, data) => {
        departmentAssociation.value = null
        try {
            loading.value = true
            const response = await DepartmentAssociationService.update(id, data)
            departmentAssociation.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al actualizar la asociación departamental',
                status: error.response.status,
                fields: error.response.data.fields,
            }
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        departmentAssociation,
        loading,
        errorState,
        updateDepartmentAssociation,
    }
}
