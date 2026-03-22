import http from '@/services/http'
import { clearObj } from '@/shared/utils/clear-obj'

const RallyStageResultService = {}
const urlEntity = '/rally-stage-results'

RallyStageResultService.get = async (query = {}) => {
    return http.get(`${urlEntity}`, { params: clearObj(query) }).then((res) => res)
}

RallyStageResultService.findOne = async (id) => {
    return http.get(`${urlEntity}/${id}`).then((res) => res)
}

RallyStageResultService.selectData = async () => {
    return http.get(`${urlEntity}/select-data`).then((res) => res)
}

RallyStageResultService.add = async (data) => {
    return http.post(`${urlEntity}`, data).then((res) => res)
}

RallyStageResultService.update = async (id, data) => {
    return http.patch(`${urlEntity}/${id}`, data).then((res) => res)
}

RallyStageResultService.delete = async (id) => {
    return http.delete(`${urlEntity}/${id}`).then((res) => res)
}

export default RallyStageResultService
