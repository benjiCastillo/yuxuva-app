import { ref } from 'vue'
import DepartmentAssociationService from '../services/department-association.service'

export const useCreateDepartmentAssociation = ({ onError } = {}) => {
    const departmentAssociation = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const createDepartmentAssociation = async (data) => {
        departmentAssociation.value = null
        try {
            loading.value = true
            const response = await DepartmentAssociationService.add(data)
            departmentAssociation.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Error al crear la asociación departamental',
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
        createDepartmentAssociation,
    }
}
