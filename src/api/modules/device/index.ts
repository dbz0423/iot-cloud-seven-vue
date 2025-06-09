import { ResPage, Device } from '@/api/interface/index'
import { _API } from '@/api/axios/servicePort'
import http from '@/api'

/**
 * @name 设备管理模块
 */
// 获取设备分页列表
export const getDeviceList = (params: Device.ReqDeviceList) => {
  return http.post<ResPage<Device.ResDeviceList>>(_API + `/device/manage/page`, params)
}

// 新增设备
export const addDevice = (params: Device.ReqAddDevice) => {
  return http.post(_API + `/device/manage/add`, params)
}

// 修改设备
export const updateDevice = (params: Device.ReqUpdateDevice) => {
  return http.post(_API + `/device/manage/update`, params)
}

// 删除设备
export const deleteDevice = (params: { id: number }) => {
  return http.post(_API + `/device/manage/delete`, params)
}
