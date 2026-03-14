import http from '@/services/http'
import { clearObj } from '@/shared/utils/clear-obj'

const DepartmentAssociationService = {}
const urlEntity = '/department-associations'

DepartmentAssociationService.get = async (query = {}) => {
    return http.get(`${urlEntity}`, { params: clearObj(query) }).then((res) => res)
}

DepartmentAssociationService.findOne = async (id) => {
    return http.get(`${urlEntity}/${id}`).then((res) => res)
}

DepartmentAssociationService.selectData = async () => {
    return http.get(`${urlEntity}/select-data`).then((res) => res)
}

DepartmentAssociationService.add = async (data) => {
    return http.post(`${urlEntity}`, data).then((res) => res)
}

DepartmentAssociationService.update = async (id, data) => {
    return http.patch(`${urlEntity}/${id}`, data).then((res) => res)
}

DepartmentAssociationService.delete = async (id) => {
    return http.delete(`${urlEntity}/${id}`).then((res) => res)
}

export default DepartmentAssociationService
