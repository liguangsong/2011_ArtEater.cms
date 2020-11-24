import api from '../../../api/interceptor_api.js'

const actions = {
  // 添加文章
  async createArticle ({ commit }, params) {
    let result = await api.create_article(params)
    return result
  },
  // 文章列表
  async get_articlelist ({ commit }, params) {
    let result = await api.articlelist(params)
    return result
  },
  //   获取单篇文章
  async get_article ({ commit }, params) {
    let result = await api.show_article(params)
    return result
  },
  //   编辑文章
  async editor_article ({ commit }, params) {
    let result = await api.updata_article(params)
    return result
  },
  // 删除文章
  async delete_article ({ commit }, params) {
    let result = await api.delete_article(params)
    return result
  }
}

export default actions
