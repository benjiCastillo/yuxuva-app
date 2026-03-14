import http from '@/services/http'
import { clearObj } from '@/shared/utils/clear-obj'

const ChampionshipCalendarService = {}
const urlEntity = '/championship-calendars'

ChampionshipCalendarService.get = async (query = {}) => {
    return http.get(`${urlEntity}`, { params: clearObj(query) }).then((res) => res)
}

ChampionshipCalendarService.findOne = async (id) => {
    return http.get(`${urlEntity}/${id}`).then((res) => res)
}

ChampionshipCalendarService.selectData = async () => {
    return http.get(`${urlEntity}/select-data`).then((res) => res)
}

ChampionshipCalendarService.add = async (data) => {
    return http.post(`${urlEntity}`, data).then((res) => res)
}

ChampionshipCalendarService.update = async (id, data) => {
    return http.patch(`${urlEntity}/${id}`, data).then((res) => res)
}

ChampionshipCalendarService.delete = async (id) => {
    return http.delete(`${urlEntity}/${id}`).then((res) => res)
}

export default ChampionshipCalendarService
