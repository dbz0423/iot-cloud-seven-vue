import http from '@/api'
import { _API } from '@/api/axios/servicePort'

/**
 * @name 用户管理模块
 */
export const UserApi = {
  // 查询用户列表
  page: (params: any) => {
    // console.log('params', params)
    return http.post(_API + '/user/page', params)
  },
  // 新增用户
  add: (params: any) => {
    http.post(_API + '/user/add', params)
  },
  // 编辑用户
  edit: (params: any) => http.post(_API + '/user/edit', params),
  // 导出用户列表
  export: (params: any) =>
    http.post(_API + '/user/export', params, {
      responseType: 'blob'
    }),
  // 删除用户
  delete: (params: number[]) => http.post(_API + '/user/delete', params),
  import: (data: FormData) => http.post(_API + '/user/import', data),
  exportTemplate: (params: any) =>
    http.post(_API + '/user/exportTemplate', params, {
      responseType: 'blob'
    })
}
