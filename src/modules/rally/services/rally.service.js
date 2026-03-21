import http from '@/services/http'
import { clearObj } from '@/shared/utils/clear-obj'

const RallyService = {}
const urlEntity = '/rallies'

RallyService.get = async (query = {}) => {
    return http.get(`${urlEntity}`, { params: clearObj(query) }).then((res) => res)
}

RallyService.findOne = async (id) => {
    return http.get(`${urlEntity}/${id}`).then((res) => res)
}

RallyService.selectData = async () => {
    return http.get(`${urlEntity}/select-data`).then((res) => res)
}

RallyService.add = async (data) => {
    return http.post(`${urlEntity}`, data).then((res) => res)
}

RallyService.update = async (id, data) => {
    return http.patch(`${urlEntity}/${id}`, data).then((res) => res)
}

RallyService.delete = async (id) => {
    return http.delete(`${urlEntity}/${id}`).then((res) => res)
}

export default RallyService
