import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const service: AxiosInstance = axios.create({
  baseURL: 'https://free.v36.cm/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // 添加认证token - 使用完整的API密钥
    if (config.headers) {
      config.headers['Authorization'] = 'sk-xG5H4ad0my2wpjK462C76dBa3cDb403d954b473dD9C3Ee27'
      // 添加其他必要的请求头
      config.headers['Accept'] = '*/*'
      config.headers['Accept-Encoding'] = 'gzip, deflate, br'
      config.headers['Connection'] = 'keep-alive'
      config.headers['User-Agent'] = 'PostmanRuntime-ApipostRuntime/1.1.0'
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: any) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('认证失败，请检查API密钥是否有效');
          // 这里可以添加其他处理，比如跳转到登录页或显示错误提示
          break;
        default:
          console.error(`请求失败: ${error.response.data?.message || error.message}`);
      }
    } else {
      console.error(`网络错误: ${error.message}`);
    }
    return Promise.reject(error)
  }
)

export default service
