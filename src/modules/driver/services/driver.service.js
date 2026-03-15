import http from '@/services/http'
import { clearObj } from '@/shared/utils/clear-obj'

const DriverService = {}
const urlEntity = '/drivers'

DriverService.get = async (query = {}) => {
    return http.get(`${urlEntity}`, { params: clearObj(query) }).then((res) => res)
}

DriverService.findOne = async (id) => {
    return http.get(`${urlEntity}/${id}`).then((res) => res)
}

DriverService.selectData = async () => {
    return http.get(`${urlEntity}/select-data`).then((res) => res)
}

DriverService.add = async (data) => {
    return http.post(`${urlEntity}`, data).then((res) => res)
}

DriverService.update = async (id, data) => {
    return http.patch(`${urlEntity}/${id}`, data).then((res) => res)
}

DriverService.delete = async (id) => {
    return http.delete(`${urlEntity}/${id}`).then((res) => res)
}

export default DriverService
