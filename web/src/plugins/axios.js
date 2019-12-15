import axios from 'axios'

let http = axios.create({
  // baseURL: process.env.baseUrl
  baseURL: '/api',
  timeout: 10000
})
http.interceptors.response.use(response => {
    const data = response.data.data
    response.data = data
    return response
  }, error => {
    // 如果有success字段并且是false而且有提示 就替换提示
    if (error.response) {
      const rsp = error.response.data
      if (rsp.hasOwnProperty('success') && rsp.success === false && rsp.message) {
        error.message = rsp.message
      }
    }
    return Promise.reject(error)
  }
)
export default http
