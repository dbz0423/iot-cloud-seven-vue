// * 请求响应参数(不包含data)
export interface Result {
  code: string
  msg: string
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
  data: T
}

// * 分页响应参数
export interface ResPage<T> {
  list: T[]
  page: number
  limit: number
  total: number
}

// * 分页请求参数
export interface ReqPage {
  page: number
  limit: number
}

// * 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string
    password: string
    // key: string
    // captcha: string
  }
  export interface ResLogin {
    access_token: string
  }
  // export interface ResLoginCaptcha {
  //   key: string
  //   image: string
  // }
}

// * 管理员管理模块
export namespace SysManager {
  export interface ReqGetManagerParams extends ReqPage {
    username?: string
  }
  export interface ResManagerList {
    id: number
    username: string
    avatar: string
    status: number
    createTime: string
  }
  export interface ReqEditManagerParams {
    id?: number
    username: string
    avatar: string
    status: number
    roleId: number
    password?: string
  }

  export interface ReqEditPasswordParams {
    password?: string
    code?: string
  }
}

// * 角色模块
export namespace SysRole {
  export interface ReqGetRoleParams extends ReqPage {
    name?: string
  }
  export interface ResRoleList {
    id: number
    name: string
    remark: string
    menuIds: number[]
    createTime: string
  }
  export interface ReqEditRoleParams {
    pkId?: number
    name: string
    remark: string
    menuIds: number[]
  }
}

// * 菜单模块
export namespace SysMenu {
  export interface ReqLoginForm {
    username: string
    password: string
  }
  export interface ResMenuList {
    title: string
    id: number
    pid: number
    path: string
    name: string
    icon: string
    component?: string
    type: string
    auth?: string
    sort: number
    parentName: String
    children: ResMenuList[]
  }
}

// * 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string
  }
}

// * 字典
export interface Dict {
  id: number
  title: string
  updateTime: string
  value: number
}

/** 字典设置 */
export interface DictConfigRes {
  createTime: string
  dictNumber: string
  id: number
  title: string
  updateTime: string
  value: number
}

export interface RoleDetail {
  id: number
  name: string
  remark: string
  menuIds: number[] // 关键字段：菜单权限 ID 数组
  // 其他角色相关字段...
}
