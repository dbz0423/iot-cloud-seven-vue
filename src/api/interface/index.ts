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
    tenantId?: number
  }
  export interface ResManagerList {
    pkId: number
    username: string
    avatar: string
    status: number
    createTime: string
  }
  export interface ReqEditManagerParams {
    pkId?: number
    username: string
    avatar: string
    status: number
    roleId: number
    password?: string
    type: number
    tenantId?: number
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
    pkId: number
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

// * 资讯模块
export namespace News {
  export interface ReqGetNewsParams extends ReqPage {
    tenantId?: number
    title?: string
  }
  export interface ResNewsList {
    id: number
    title: string
    content: string
    img: string
    createTime: string
    tenantId?: number
  }
  export interface ReqEditNewsParams {
    id: number
    title: string
    content: string
    tenantId?: number
    img: string
  }
}

// * 租户模块
export namespace Tenant {
  export interface ReqGetTenantParams extends ReqPage {
    name?: string
  }
  export interface ResTenantList {
    id: number
    name: string
    type: number
    img: string
    status: number
    createTime: string
  }
  export interface ReqEditTenantParams {
    id?: number
    name: string
    type: number
    img: string
    status: number
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
    pkId: number
    pid: number
    path: string
    name: string
    icon: string
    component?: string
    type: 'MENU_DIR' | 'MENU' | 'BUTTON'
    openType: 'TAB' | 'URL'
    url?: string
    auth?: string
    keepalive: boolean
    sort: number
    parentName: String
    children: ResMenuList[]
    hide?: boolean
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

export namespace Device {
  export interface ReqDeviceList {
    page: number
    limit: number
    name?: string
  }

  export interface ResDeviceList {
    id: number
    name: string
    type: number
    deviceId: string
    deviceStatus: number
    deviceOnline: number
    createTime: string
    tenantId: number
  }

  export interface ReqAddDevice {
    name: string
    type: number
    deviceId: string
  }

  export interface ReqUpdateDevice {
    id: number
    name?: string
    type?: number
    deviceId?: string
  }
}

// * 场景管理模块
export namespace Scene {
  export interface ReqSceneList extends ReqPage {
    name?: string
  }

  export interface ResSceneList {
    id: number
    name: string
    createTime: string
  }

  export interface ReqAddScene {
    name: string
  }

  export interface ReqUpdateScene {
    id: number
    name: string
  }
}
