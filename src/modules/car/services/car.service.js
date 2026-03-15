import http from '@/services/http'
import { clearObj } from '@/shared/utils/clear-obj'

const CarService = {}
const urlEntity = '/cars'

CarService.get = async (query = {}) => {
    return http.get(`${urlEntity}`, { params: clearObj(query) }).then((res) => res)
}

CarService.findOne = async (id) => {
    return http.get(`${urlEntity}/${id}`).then((res) => res)
}

CarService.selectData = async () => {
    return http.get(`${urlEntity}/select-data`).then((res) => res)
}

CarService.add = async (data) => {
    return http.post(`${urlEntity}`, data).then((res) => res)
}

CarService.update = async (id, data) => {
    return http.patch(`${urlEntity}/${id}`, data).then((res) => res)
}

CarService.delete = async (id) => {
    return http.delete(`${urlEntity}/${id}`).then((res) => res)
}

export default CarService
