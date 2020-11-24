import axios from '@/libs/api.request'
import { urlConfig } from '@/api/urlconfig'

export const GetAllModuleTree = (hasRootNode = false) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetAllModuleTree',
    params: {hasRootNode},
    method: 'get'
  })
}

export const GetModulePageData = (
  keyword = '',
  parentId = '',
  page = 1,
  pageSize = 10
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetModulePageData',
    params: {
      keyword, parentId, page, pageSize
    },
    method: 'get'
  })
}

/** 根据Id查询菜单信息 */
export const GetModuleById = (
  Id = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetModuleById',
    params: {
      Id
    },
    method: 'get'
  })
}

/** 添加菜单 */
export const AddModule = (datas) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/AddModule',
    method: 'post',
    data: datas
  })
}

/** 编辑菜单 */
export const EditModule = (datas) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/EditModule',
    method: 'post',
    data: datas
  })
}

/** 删除菜单 */
export const DelModule = (Id = '') => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/DelModule',
    params: {
      Id
    },
    method: 'get'
  })
}
