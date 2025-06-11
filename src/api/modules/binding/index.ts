import { _API } from '@/api/axios/servicePort'
import http from '@/api'
import { ResultData, Binding } from '@/api/interface'

/**
 * @name 统一绑定管理模块
 */

// ============================= 用户-场景 =============================

/**
 * @description: 绑定用户到场景
 */
export const bindUserToScene = (params: { userId: number; sceneId: number }) => {
  return http.post(_API + `/admin/binding/user-scene/bind`, params)
}

/**
 * @description: 从场景解绑用户
 */
export const unbindUserFromScene = (params: { userId: number; sceneId: number }) => {
  return http.post(_API + `/admin/binding/user-scene/unbind`, params)
}

/**
 * @description: 获取场景的用户分配情况
 */
export const getSceneUserAssignments = (sceneId: number) => {
  return http.get<ResultData<Binding.AssignmentResult<Binding.UserInfo>>>(_API + `/admin/binding/user-scene/list/${sceneId}`)
}

// ============================= 设备-场景 =============================

/**
 * @description: 绑定设备到场景
 */
export const bindDeviceToScene = (params: { deviceId: number; sceneId: number }) => {
  return http.post(_API + `/admin/binding/device-scene/bind`, params)
}

/**
 * @description: 从场景解绑设备
 */
export const unbindDeviceFromScene = (params: { deviceId: number; sceneId: number }) => {
  return http.post(_API + `/admin/binding/device-scene/unbind`, params)
}

/**
 * @description: 获取场景的设备分配情况
 */
export const getSceneDeviceAssignments = (sceneId: number) => {
  return http.get<ResultData<number[]>>(_API + `/admin/binding/device-scene/list/ids/${sceneId}`)
}

// ============================= 用户-设备 =============================

/**
 * @description: 绑定用户到设备
 */
export const bindUserToDevice = (params: { userId: number; deviceId: number }) => {
  return http.post(_API + `/admin/binding/user-device/bind`, params)
}

/**
 * @description: 从设备解绑用户
 */
export const unbindUserFromDevice = (params: { userId: number; deviceId: number }) => {
  return http.post(_API + `/admin/binding/user-device/unbind`, params)
}

/**
 * @description: 获取用户的设备分配情况
 */
export const getUserDeviceAssignments = (userId: number) => {
  return http.get<ResultData<Binding.AssignmentResult<Binding.DeviceInfo>>>(_API + `/admin/binding/user-device/list/${userId}`)
}

/**
 * @description: 获取用户的场景分配情况
 */
export const getUserSceneAssignments = (userId: number) => {
  return http.get<ResultData<Binding.AssignmentResult<Binding.SceneInfo>>>(_API + `/admin/binding/user-scene/list-by-user/${userId}`)
}

/**
 * @description: 获取设备的用户分配情况
 */
export const getDeviceUserAssignments = (deviceId: number) => {
  return http.get<ResultData<Binding.AssignmentResult<Binding.UserInfo>>>(_API + `/admin/binding/device-user/list/${deviceId}`)
}

/**
 * @description: 获取设备已分配的用户ID列表
 */
export const getDeviceUserAssignmentIds = (deviceId: number) => {
  return http.get<ResultData<number[]>>(_API + `/admin/binding/device-user/list/ids/${deviceId}`)
}

/**
 * @description: 获取设备的场景分配情况
 */
export const getDeviceSceneAssignments = (deviceId: number) => {
  return http.get<ResultData<Binding.AssignmentResult<Binding.SceneInfo>>>(_API + `/admin/binding/device-scene/list-by-device/${deviceId}`)
}

/**
 * @description: 获取设备已分配的场景ID列表
 */
export const getDeviceSceneAssignmentIds = (deviceId: number) => {
  return http.get<ResultData<number[]>>(_API + `/admin/binding/device-scene/list-by-device/ids/${deviceId}`)
}
