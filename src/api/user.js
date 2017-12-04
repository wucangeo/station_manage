import axios from 'axios'

module.exports = {
  list: async function() {
    return axios({
      url: CONFIG.API_V1 + '/user',
      method: 'get'
    })
  },
  login: function(data) {
    return axios({
      url: CONFIG.API_V1 + '/user/login',
      method: 'post',
      data: data,
      headers: {
        'Content-type': 'application/json'
      }
    })
  },
  delete: function(ids) {
    return axios({
      url: CONFIG.API_V1 + '/user',
      method: 'delete',
      headers: { 'content-type': 'application/json' }
    })
  }
}
