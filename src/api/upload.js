import Cookies from 'js-cookie'
import axios from 'axios'

axios.defaults.baseURL = CONFIG.API_V1
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.patch['Content-Type'] = 'application/json'

let salt = 'bnu'

module.exports = {
  list: async function (query) {
    let access_token = Cookies.get('access_token')
    return axios({
      url: '/upload',
      method: 'get',
      headers: { 'x-access-token': access_token },
      params: query
    })
  },
  get: async function (data_id) {
    let access_token = Cookies.get('access_token')
    return axios({
      url: `/upload/${data_id}`,
      method: 'get',
      headers: { 'x-access-token': access_token }
    })
  },
  create: function (item) {
    let access_token = Cookies.get('access_token')
    return axios({
      url: `/upload`,
      method: 'post',
      headers: { 'x-access-token': access_token },
      data: item
    })
  },
  update: function (updates, data_id) {
    let access_token = Cookies.get('access_token')
    return axios({
      url: `/upload/${data_id}`,
      method: 'patch',
      headers: { 'x-access-token': access_token },
      data: updates
    })
  },
  delete: function (ids) {
    let access_token = Cookies.get('access_token')
    return axios({
      url: '/upload',
      headers: { 'x-access-token': access_token },
      method: 'delete',
      data: { ids: ids }
    })
  },
  upload: function (item) {
    let access_token = Cookies.get('access_token')
    return axios({
      url: '/upload/upload',
      headers: {
        'x-access-token': access_token,
        'Content-Type': 'multipart/form-data'
      },
      method: 'post',
      data: item
    })
  },
  download: function (item) {
    debugger
    let access_token = Cookies.get('access_token')
    return axios({
      url: '/upload/download',
      headers: { 'x-access-token': access_token },
      method: 'post',
      data: item
    })
  }
}
