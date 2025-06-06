import http from '@/api'
import { _API } from '@/api/axios/servicePort'

/**
 * @name 协议管理
 */
export const ProtocolApi = {
  page: (params: any) => http.post(_API + '/protocol/page', params),
  add: (params: any) => http.post(_API + '/protocol/add', params),
  edit: (params: any) => http.post(_API + '/protocol/edit', params),
  remove: (params: number[]) => http.post(_API + '/protocol/remove', params),
  info: (params: { type: number }) => http.post<protocolType>(_API + '/protocol/info', params)
}

/**
 * @name app版本管理
 */
export const VersionApi = {
  page: (params: any) => http.post(_API + '/version/page', params),
  add: (params: any) => http.post(_API + '/version/add', params),
  remove: (params: number[]) => http.post(_API + '/version/remove', params),
  edit: (params: any) => http.post(_API + '/version/edit', params)
}
