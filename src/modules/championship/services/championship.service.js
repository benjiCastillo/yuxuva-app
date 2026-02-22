import http from '@/services/http'
import { clearObj } from '@/shared/utils/clear-obj'

const ChampionshipService = {}
const urlEntity = '/championships'

ChampionshipService.get = async (query = {}) => {
    return http.get(`${urlEntity}`, { params: clearObj(query) }).then((res) => res)
}

ChampionshipService.findOne = async (id) => {
    return http.get(`${urlEntity}/${id}`).then((res) => res)
}

ChampionshipService.selectData = async (atcTramiteId) => {
    return http.get(`${urlEntity}/select-data/${atcTramiteId}`).then((res) => res)
}

ChampionshipService.add = async (data) => {
    return http.post(`${urlEntity}/create`, data).then((res) => res)
}

ChampionshipService.update = async (id, data) => {
    return http.patch(`${urlEntity}/update/${id}`, data).then((res) => res)
}

ChampionshipService.delete = async (id) => {
    return http.delete(`${urlEntity}/${id}`).then((res) => res)
}

export default ChampionshipService
