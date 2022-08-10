// 统一返回数据格式
function Res(code, data, msg='success') {
  return {code, data, msg}
}

// 获取分页信息
function Page(page) {
  if(!page) { page = {} }
  let pageNum = page.pageNum || 1
  let pageSize = page.pageSize || 10 
  // LIMIT过滤条件
  m = (pageNum - 1) * pageSize
  n = pageSize
  if (m < 0) { 
    m = 0
    n = 9 
  }
  return { pageNum, pageSize, m, n }
}

module.exports = {
  Res,
  Page
}