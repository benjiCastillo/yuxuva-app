import { ref } from 'vue'
import DepartmentAssociationService from '../services/department-association.service'

export const useSelectDataDepartmentAssociation = ({ onError } = {}) => {
    const departmentAssociations = ref([])
    const loading = ref(false)
    const errorState = ref({
        message: '',
        status: false,
    })

    const selectData = async () => {
        try {
            loading.value = true
            const response = await DepartmentAssociationService.selectData()
            departmentAssociations.value = response.data
        } catch (error) {
            errorState.value = {
                message: error.response.data.message || 'Ocurrió un error al obtener las asociaciones departamentales',
                status: error.response.status,
            }
            departmentAssociations.value = []
            onError(error.response.data.error || 'Error', errorState.value)
        } finally {
            loading.value = false
        }
    }

    return {
        departmentAssociations,
        loading,
        errorState,
        selectData,
    }
}
