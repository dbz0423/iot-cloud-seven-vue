import http from '@/api'
import { _API } from '@/api/axios/servicePort'

/**
 * @name 分类管理模块
 */
export const CategoryApi = {
  // 查询分类列表
  page: (params: any) => http.post(_API + '/category/page', params),
  // 编辑分类
  edit: (params: any) => http.post(_API + '/category/edit', params),
  // 导出分类列表
  export: (params: any) =>
    http.post(_API + '/category/export', params, {
      responseType: 'blob'
    })
}
