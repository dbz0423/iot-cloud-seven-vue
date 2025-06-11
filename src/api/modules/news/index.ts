import { ResPage, News } from '@/api/interface/index'
import { _API } from '@/api/axios/servicePort'
import http from '@/api'

/**
 * @name 角色管理模块
 */
// * 获取角色分页列表
export const getNewsPage = (params: News.ReqGetNewsParams) => {
  console.log('aaaaaaaaaaaaaa', http.post<ResPage<News.ResNewsList>>(_API + `/api/new/page`, params))
  return http.post<ResPage<News.ResNewsList>>(_API + `/api/new/page`, params)
}

// * 获取角色列表
export const getNewsList = () => {
  return http.post<News.ResNewsList>(_API + `/api/new/list`)
}
export const getNews = () => {
  console.log('aaaaaaaaaaaaaa' + http.post<News.ResNewsList>(_API + `/api/new/updateTopField`))
  return http.post<News.ResNewsList>(_API + `/api/new/updateTopField`)
}

// * 新增角色
export const addNews = (params: News.ReqEditNewsParams) => {
  return http.post(_API + `/api/new/add`, params)
}

// * 编辑角色
export const editNews = (params: News.ReqEditNewsParams) => {
  return http.post(_API + `/api/new/edit`, params)
}

// * 删除角色
export const deleteNews = (params: number[]) => {
  return http.post(_API + `/api/new/remove`, params)
}
