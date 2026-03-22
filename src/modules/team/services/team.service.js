import http from '@/services/http'
import { clearObj } from '@/shared/utils/clear-obj'

const TeamService = {}
const urlEntity = '/teams'

TeamService.get = async (query = {}) => {
    return http.get(`${urlEntity}`, { params: clearObj(query) }).then((res) => res)
}

TeamService.findOne = async (id) => {
    return http.get(`${urlEntity}/${id}`).then((res) => res)
}

TeamService.selectData = async (query = {}) => {
    return http.get(`${urlEntity}/select-data`, { params: clearObj(query) }).then((res) => res)
}

TeamService.add = async (data) => {
    return http.post(`${urlEntity}`, data).then((res) => res)
}

TeamService.update = async (id, data) => {
    return http.patch(`${urlEntity}/${id}`, data).then((res) => res)
}

TeamService.delete = async (id) => {
    return http.delete(`${urlEntity}/${id}`).then((res) => res)
}

export default TeamService
