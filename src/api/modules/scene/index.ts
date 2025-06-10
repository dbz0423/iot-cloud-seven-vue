import { ResPage, Scene } from '@/api/interface/index'
import { _API } from '@/api/axios/servicePort'
import http from '@/api'

/**
 * @name 场景管理模块
 */
// 获取场景分页列表
export const getSceneList = (params: Scene.ReqSceneList) => {
  return http.post<ResPage<Scene.ResSceneList>>(_API + `/scene/page`, params)
}

// 新增场景
export const addScene = (params: Scene.ReqAddScene) => {
  return http.post(_API + `/scene/add`, params)
}

// 修改场景
export const updateScene = (params: Scene.ReqUpdateScene) => {
  return http.post(_API + `/scene/update`, params)
}

// 删除场景
export const deleteScene = (params: { id: number }) => {
  return http.post(_API + `/scene/delete`, params)
}
