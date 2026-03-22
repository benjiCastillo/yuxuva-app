import http from '@/services/http'
import { clearObj } from '@/shared/utils/clear-obj'

const RallyStageService = {}
const urlEntity = '/rally-stages'

RallyStageService.get = async (query = {}) => {
    return http.get(`${urlEntity}`, { params: clearObj(query) }).then((res) => res)
}

RallyStageService.findOne = async (id) => {
    return http.get(`${urlEntity}/${id}`).then((res) => res)
}

RallyStageService.selectData = async () => {
    return http.get(`${urlEntity}/select-data`).then((res) => res)
}

RallyStageService.add = async (data) => {
    return http.post(`${urlEntity}`, data).then((res) => res)
}

RallyStageService.update = async (id, data) => {
    return http.patch(`${urlEntity}/${id}`, data).then((res) => res)
}

RallyStageService.delete = async (id) => {
    return http.delete(`${urlEntity}/${id}`).then((res) => res)
}

export default RallyStageService
