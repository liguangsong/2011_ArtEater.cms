import axios from '@/libs/api.request'
import { urlConfig } from '@/api/urlconfig'

/** 查询机构列表 */
export const GetOrgPageList = (
    page = 1,
    pageSize = 10
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetOrgPageList',
    params: {
      page, pageSize
    },
    method: 'get'
  })
}
/** 查询机构列表 */
export const GetOrgList = () => {
return axios.request({
  url: urlConfig().mainApiUrl + 'BaseLimit/GetOrgList',
  params: {},
  method: 'get'
})
}
/** 根据Id查询机构信息 */
export const GetOrgById = (
  Id = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetOrgById',
    params: {
      Id
    },
    method: 'get'
  })
}

export const DelOrgById = (
  Id = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/DelOrg',
    params: {
      Id
    },
    method: 'get'
  })
}

/** 添加修改机构 */
export const AddUpdateOrg = (datas) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/AddUpdateOrg',
    method: 'post',
    data: datas
  })
}
/** 启用机构 */
export const EnableOrg = (
    orgId = ''
  ) => {
    return axios.request({
      url: urlConfig().mainApiUrl + 'BaseLimit/EnableOrg',
      params: {
        orgId
      },
      method: 'get'
    })
  }
/** 禁用机构 */
export const DisableOrg = (
    orgId = ''
  ) => {
    return axios.request({
      url: urlConfig().mainApiUrl + 'BaseLimit/DisableOrg',
      params: {
        orgId
      },
      method: 'get'
    })
  }