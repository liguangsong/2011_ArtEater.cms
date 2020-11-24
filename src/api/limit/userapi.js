import axios from '@/libs/api.request'
import { urlConfig } from '@/api/urlconfig'

export const GetUserPageList = (
  keyWord = '',
  page = 1,
  pageSize = 20
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/GetUserPageData',
    params: {
      keyWord, page, pageSize
    },
    method: 'get'
  })
}
/** 查询分支机构的用户 */
export const GetOrgUserPageList = (
  keyWord = '',
  userId = '',
  page = 1,
  pageSize = 20
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/GetUserPageDataByUserId',
    params: {
      keyWord, userId, page, pageSize
    },
    method: 'get'
  })
}



export const AddUser = (datas) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/AddUser',
    method: 'post',
    data: datas
  })
}

export const DelUser = (
  userId = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/DelUser',
    params: {
      userId
    },
    method: 'get'
  })
}


export const DisabledUser = (
  userId = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/DisabledUser',
    params: {
      userId
    },
    method: 'get'
  })
}

export const EnabledUser = (
  userId = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/EnabledUser',
    params: {
      userId
    },
    method: 'get'
  })
}
export const ResetPassword = (userId) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/ResetPwd',
    method: 'get',
    params: {
      userId
    }
  })
}

export const GetUserRoles = (userId) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/GetUserRoles',
    method: 'get',
    params: {
      userId
    }
  })
}

export const GetUserOrgsByUserId = (userId) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/GetUserOrgsByUserId',
    method: 'get',
    params: {
      userId
    }
  })
}
export const SaveUserRole = (datas) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/SaveUserRole',
    method: 'post',
    data: datas
  })
}

export const SaveUserOrgs = (datas) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/SaveUserOrgs',
    method: 'post',
    data: datas
  })
}
export const UpdateUserPwd = (datas) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/UpdateUserPwd',
    method: 'post',
    data: datas
  })
}

export const GetUserModuleTree = (
  userId = '',
  account = ''
) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'baselimit/GetUserModuleTree',
    method: 'get',
    params: {
      userId, account
    }
  })
}

export const login = ({ userName, password, userType = 0 }) => {
  const data = {
    userName,
    password,
    userType
  }
  return axios.request({
    url: urlConfig().mainApiUrl + 'Login/GetToken',
    data,
    params: {
      userName, password, userType
    },
    method: 'get'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: urlConfig().mainApiUrl + 'User/GetUserInfoByToken',
    params: {
      token
    },
    method: 'post'
  })
}
