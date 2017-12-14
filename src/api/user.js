import Cookies from 'js-cookie'
import axios from 'axios'

axios.defaults.baseURL = CONFIG.API_V1
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.patch['Content-Type'] = 'application/json'

module.exports = {
  list: async function(query) {
    let access_token = Cookies.get('access_token')
    return axios({
      url: '/user',
      method: 'get',
      headers: { 'x-access-token': access_token },
      params: query
    })
  },
  get: async function(data_id) {
    let access_token = Cookies.get('access_token')
    return axios({
      url: `/user/${data_id}`,
      method: 'get',
      headers: { 'x-access-token': access_token }
    })
  },
  login: function(data) {
    return axios({
      url: '/user/login',
      method: 'post',
      data: data
    })
  },
  update: function(updates, data_id) {
    let access_token = Cookies.get('access_token')
    return axios({
      url: `/user/${data_id}`,
      method: 'patch',
      headers: { 'x-access-token': access_token },
      data: updates
    })
  },
  delete: function(ids) {
    let access_token = Cookies.get('access_token')
    return axios({
      url: '/user',
      headers: { 'x-access-token': access_token },
      method: 'delete'
    })
  },
  verify: function() {
    let access_token = Cookies.get('access_token')
    return axios({
      url: '/user/verify',
      headers: { 'x-access-token': access_token },
      method: 'get'
    })
  }
}
