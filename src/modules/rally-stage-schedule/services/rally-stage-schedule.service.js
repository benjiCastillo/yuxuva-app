import http from '@/services/http'
import { clearObj } from '@/shared/utils/clear-obj'

const RallyStageScheduleService = {}
const urlEntity = '/rally-stage-schedules'

RallyStageScheduleService.get = async (query = {}) => {
    return http.get(`${urlEntity}`, { params: clearObj(query) }).then((res) => res)
}

RallyStageScheduleService.findOne = async (id) => {
    return http.get(`${urlEntity}/${id}`).then((res) => res)
}

RallyStageScheduleService.selectData = async (query = {}) => {
    return http.get(`${urlEntity}/select-data`, { params: clearObj(query) }).then((res) => res)
}

RallyStageScheduleService.add = async (data) => {
    return http.post(`${urlEntity}`, data).then((res) => res)
}

RallyStageScheduleService.update = async (id, data) => {
    return http.patch(`${urlEntity}/${id}`, data).then((res) => res)
}

RallyStageScheduleService.delete = async (id) => {
    return http.delete(`${urlEntity}/${id}`).then((res) => res)
}

export default RallyStageScheduleService
