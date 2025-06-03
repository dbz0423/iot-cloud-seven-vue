/** 用户信息 */
declare interface UserType {
  pkId: number
  wxOpenId: string
  account: string
  nickname: string
  avatar?: any
  phone: string
  gender: number
  birthday: string
  bonus: number
  remark: string
  deleteFlag: number
  createTime?: string
  updateTime?: string
  enabled: number
}

/** 用户分页请求参数信息 */
declare interface ReqPageUser {
  asc?: boolean
  company?: string
  limit: number
  nickname?: string
  order?: string
  page: number
  phone?: string
}

/** 分类信息 */
declare interface CategoryType {
  pkId: number
  title: string
  type: number
  description: string
  deleteFlag: number
  updateTime?: string
  createTime?: string
}
