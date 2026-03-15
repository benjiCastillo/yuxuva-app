import http from '@/services/http'
import { clearObj } from '@/shared/utils/clear-obj'

const CategoryService = {}
const urlEntity = '/categories'

CategoryService.get = async (query = {}) => {
    return http.get(`${urlEntity}`, { params: clearObj(query) }).then((res) => res)
}

CategoryService.findOne = async (id) => {
    return http.get(`${urlEntity}/${id}`).then((res) => res)
}

CategoryService.selectData = async () => {
    return http.get(`${urlEntity}/select-data`).then((res) => res)
}

CategoryService.add = async (data) => {
    return http.post(`${urlEntity}`, data).then((res) => res)
}

CategoryService.update = async (id, data) => {
    return http.patch(`${urlEntity}/${id}`, data).then((res) => res)
}

CategoryService.delete = async (id) => {
    return http.delete(`${urlEntity}/${id}`).then((res) => res)
}

export default CategoryService
