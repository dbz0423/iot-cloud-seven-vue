import { ResPage, Tenant } from '@/api/interface/index'
import { _API } from '@/api/axios/servicePort'
import http from '@/api'

/**
 * @name 角色管理模块
 */
// * 获取角色分页列表
export const getTenantPage = (params: Tenant.ReqGetTenantParams) => {
  return http.post<ResPage<Tenant.ResTenantList>>(_API + `/api/tenant/page`, params)
}

// * 获取角色列表
export const getTenantList = () => {
  return http.post<Tenant.ResTenantList>(_API + `/api/tenant/list`)
}

// * 新增角色
export const addTenant = (params: Tenant.ReqEditTenantParams) => {
  return http.post(_API + `/api/tenant/add`, params)
}

// * 编辑角色
export const editTenant = (params: Tenant.ReqEditTenantParams) => {
  return http.post(_API + `/api/tenant/edit`, params)
}

// * 删除角色
export const deleteTenant = (params: number[]) => {
  return http.post(_API + `/api/tenant/remove`, params)
}
