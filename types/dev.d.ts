/** 用户信息 */
declare interface UserType {
  pkId: number
  wxOpenId: string
  account: string
  nickname: string
  avatar?: any
  mobile: string
  username: string
  remark: string
  deleteFlag: number
  createTime?: string
  updateTime?: string
  status: number
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
