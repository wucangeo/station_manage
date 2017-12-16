import Cookies from 'js-cookie'
import md5 from 'md5'
import axios from 'axios'

axios.defaults.baseURL = CONFIG.API_V1
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.patch['Content-Type'] = 'application/json'

let salt = 'bnu'

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
    let new_data = { ...data }
    new_data.password = md5(new_data.password + salt) //密码加密加盐
    return axios({
      url: '/user/login',
      method: 'post',
      data: new_data
    })
  },
  create: function(item) {
    let access_token = Cookies.get('access_token')
    let new_item = { ...item }
    if (new_item.password) {
      new_item.password = md5(new_item.password + salt) //密码加密加盐
    }
    return axios({
      url: `/user`,
      method: 'post',
      headers: { 'x-access-token': access_token },
      data: new_item
    })
  },
  update: function(updates, data_id) {
    let access_token = Cookies.get('access_token')
    let new_updates = { ...updates }
    if (new_updates.password) {
      new_updates.password = md5(new_updates.password + salt) //密码加密加盐
    }
    return axios({
      url: `/user/${data_id}`,
      method: 'patch',
      headers: { 'x-access-token': access_token },
      data: new_updates
    })
  },
  delete: function(ids) {
    let access_token = Cookies.get('access_token')
    return axios({
      url: '/user',
      headers: { 'x-access-token': access_token },
      method: 'delete',
      data: { ids: ids }
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
