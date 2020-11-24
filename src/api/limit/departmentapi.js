import axios from '@/libs/api.request'
import { urlConfig } from '@/api/urlconfig'

export const GetDepartmentTreeList = () => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetDepartmentTreeList',
    params: {},
    method: 'get'
  })
}

export const GetDepartmentCascaderDatas = () => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetDepartmentCascaderDatas',
    params: {},
    method: 'get'
  })
}

export const GetDepartmentPageList = (
  page = 1,
  pageSize = 20
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetDepartmentPageList',
    params: {
      page, pageSize
    },
    method: 'get'
  })
}

export const AddDepartment = (datas) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/AddDepartment',
    method: 'post',
    data: datas
  })
}

export const DelDepartment = (
  Id = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/DelDepartment',
    params: {
      Id
    },
    method: 'get'
  })
}
