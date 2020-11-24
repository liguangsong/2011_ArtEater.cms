import axios from '@/libs/api.request'
import { urlConfig } from '@/api/urlconfig'

/** 根据菜单Id查询按钮信息 */
export const GetButtonsByModuleId = (
  moduleId = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetButtonsByModuleId',
    params: {
      moduleId
    },
    method: 'get'
  })
}

/** 根据Id查询按钮信息 */
export const GetButtonsById = (
  Id = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetButtonById',
    params: {
      Id
    },
    method: 'get'
  })
}

export const DelButtonById = (
  Id = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/DelButton',
    params: {
      Id
    },
    method: 'get'
  })
}

/** 添加修改按钮 */
export const AddUpdateButton = (datas) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/AddUpdateButton',
    method: 'post',
    data: datas
  })
}
