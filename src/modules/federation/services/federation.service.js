import http from '@/services/http'
import { clearObj } from '@/shared/utils/clear-obj'

const FederationService = {}
const urlEntity = '/federations'

FederationService.get = async (query = {}) => {
    return http.get(`${urlEntity}`, { params: clearObj(query) }).then((res) => res)
}

FederationService.findOne = async (id) => {
    return http.get(`${urlEntity}/${id}`).then((res) => res)
}

FederationService.selectData = async () => {
    return http.get(`${urlEntity}/select-data`).then((res) => res)
}

FederationService.add = async (data) => {
    return http.post(`${urlEntity}`, data).then((res) => res)
}

FederationService.update = async (id, data) => {
    return http.patch(`${urlEntity}/${id}`, data).then((res) => res)
}

FederationService.delete = async (id) => {
    return http.delete(`${urlEntity}/${id}`).then((res) => res)
}

export default FederationService
