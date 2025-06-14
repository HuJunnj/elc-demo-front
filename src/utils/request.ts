// request.ts
import Taro from '@tarojs/taro'
import axios from 'axios'

const BASE_URL = 'https://your-api.example.com' // TODO: 替换成你的后端地址
const isH5 = Taro.getEnv() === Taro.ENV_TYPE.WEB

// axios 实例（可扩展拦截器）
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// axios 请求封装
async function axiosRequest(url: string, method = 'GET', data?: any) {
  try {
    const res = await axiosInstance({
      url,
      method,
      data,
      params: method === 'GET' ? data : undefined,
    })
    return res.data
  } catch (err: any) {
    throw new Error(`[Axios] ${err.message}`)
  }
}

// Taro.request 封装
async function taroRequest<T = any>(
  url: string,
  method: 'GET' | 'POST' = 'GET',
  data?: any
): Promise<T> {
  try {
    const res = await Taro.request<T>({
      url: `${BASE_URL}${url}`,
      method: method as any, // 加这句是为了规避 Taro 类型对 method 的严格枚举限制
      data,
      header: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    throw new Error(`[Taro] Request failed: ${err}`)
  }
}
// 导出统一接口
export const request = {
  get: (url: string, data?: any) =>
    isH5 ? axiosRequest(url, 'GET', data) : taroRequest(url, 'GET', data),
  post: (url: string, data?: any) =>
    isH5 ? axiosRequest(url, 'POST', data) : taroRequest(url, 'POST', data),
}
