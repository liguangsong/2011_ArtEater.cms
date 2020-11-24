import axios from '@/libs/api.request'
import { urlConfig } from '@/api/urlconfig'

export const getTableData = (
  keyWord = '',
  roleType = -1,
  departmentId = '',
  page = 1,
  pageSize = 20
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetRoleList',
    params: {
      keyWord, roleType, departmentId, page, pageSize
    },
    method: 'get'
  })
}

/** 根据Id查询按钮信息 */
export const GetRoleById = (
  Id = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetRoleById',
    params: {
      Id
    },
    method: 'get'
  })
}

export const DelRoleById = (
  Id = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/DelRole',
    params: {
      Id
    },
    method: 'get'
  })
}

/** 添加修改按钮 */
export const AddUpdateRole = (datas) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/AddUpdateRole',
    method: 'post',
    data: datas
  })
}

/** 根据Id查询模块权限信息 */
export const GetRoleLimitTree = (
  roleId = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetRoleLimitTree',
    params: {
      roleId
    },
    method: 'get'
  })
}

/** 保存角色菜单权限 */
export const SaveRoleModule = (datas) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/SaveRoleModule',
    method: 'post',
    data: datas
  })
}

/**
 * 查询角色模块下按钮权限
 * @param {说明} roleId
 * @param {*} moduleId
 */
export const GetRoleModuleButtonLimit = (
  roleId = '',
  moduleId = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetRoleModuleButtonLimit',
    params: {
      roleId, moduleId
    },
    method: 'get'
  })
}

/** 保存角色按钮权限 */
export const SaveRoleButton = (datas) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/SaveRoleButton',
    method: 'post',
    data: datas
  })
}

/** 根据机构Id查询角色列表 */
export const GetRoleByDepartmentId = (
  departmentId = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetRolesByDepartmentId',
    params: {
      departmentId
    },
    method: 'get'
  })
}
/** 查询所有角色 */
export const GetRoles = () => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetRoles',
    method: 'get'
  })
}

/** 查询用户角色 */
export const GetUserRoleIds = (
  userId = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetUserRoleIds',
    params: {
      userId
    },
    method: 'get'
  })
}


export const GetUserRolesByDepartmentId = (
  userId = '',
  departmentId = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'BaseLimit/GetUserRolesByDepartmentId',
    params: {
      userId, departmentId
    },
    method: 'get'
  })
}
