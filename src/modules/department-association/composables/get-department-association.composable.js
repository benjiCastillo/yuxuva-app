import { ref } from 'vue'
import DepartmentAssociationService from '../services/department-association.service'

export const useGetDepartmentAssociation = ({ onError } = {}) => {
    const departmentAssociation = ref(null)
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const findOne = async (id) => {
        try {
            loading.value = true
            const response = await DepartmentAssociationService.findOne(id)
            departmentAssociation.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener la asociación departamental',
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
        findOne,
    }
}
