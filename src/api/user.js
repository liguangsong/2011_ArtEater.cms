// import axios from '@/libs/api.request'
// import { urlConfig } from '@/api/urlconfig'

// export const login = ({ userName, password, userType = 0 }) => {
//   const data = {
//     userName,
//     password,
//     userType
//   }
//   return axios.request({
//     url: urlConfig().mainApiUrl + 'User/GetToken',
//     data,
//     method: 'post'
//   })
// }

// export const getUserInfo = (token) => {
//   return axios.request({
//     url: urlConfig().mainApiUrl + 'User/GetUserInfoByToken',
//     params: {
//       token
//     },
//     method: 'post'
//   })
// }

// export const logout = (token) => {
//   return axios.request({
//     url: 'logout',
//     method: 'post'
//   })
// }
