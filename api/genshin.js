var { pool } = require('../db/dbConnect')
var { Res, Page } = require('../utils/deal')
var SqlString = require('sqlstring')

// genshin 的api实现方法
module.exports = {
  getConstUrlInfo(req, res, next) {
    let key = req.query.key || ''
    let sql = SqlString.format(`SELECT * FROM genshin_const g WHERE g.key LIKE ?;`, [`%${key}%`])
    pool.query(sql, [], (err, data) => {
      if(err) {
        res.json(Res(500, [], '获取失败!' + err));
      } else {
        res.json(Res(200, data.rows || data))
      }
    })
  },
  
  getRoleInfo(req, res, next) {
    let body = req.body
    body.page = Page(body.page)
    let total = 0
    let whereStr = ''
    let whereArr = []
    if(body.name) {
      whereStr += `r.name LIKE ? AND `
      whereArr.push(`%${body.name}%`)
    }
    if(body.star != null && body.star != -2) {
      whereStr += `r.star = ? AND `
      whereArr.push(body.star)
    }
    if(body.element != null && body.element != -2) {
      whereStr += `r.element = ? AND `
      whereArr.push(body.element)
    }
    if(body.weapon != null && body.weapon != -2) {
      whereStr += `r.weapon = ? AND `
      whereArr.push(body.weapon)
    }
    if(body.area != null && body.area != -2) {
      whereStr += `r.area = ? AND `
      whereArr.push(body.area)
    }
    if(body.book != null && body.book != -2) {
      whereStr += `r.book = ? AND `
      whereArr.push(body.book)
    }
    whereStr += 'TRUE'
    let sql0 = SqlString.format(`SELECT COUNT(1) AS total FROM genshin_role r WHERE ${whereStr}`, whereArr)
    pool.query(sql0, [], (err0, data0) => {
      if(err0) {
        return res.json(Res(500, [], '总数获取失败!' + err0));
      } else {
        data0.rows = data0.rows || data0
        total = Number(data0.rows[0].total)
        let sql = SqlString.format(
          `SELECT
            r.id,
            r.name,
            r.star,
            ra.element_type,
            ra1.weapon_type,
            ra2.book_type,
            ra4.area_type,
            r.mhy_url,
            r.wiki_url 
          FROM
            genshin_role r
            LEFT JOIN genshin_relation ra ON r.element = ra.id
            LEFT JOIN genshin_relation ra1 ON r.weapon = ra1.id
            LEFT JOIN genshin_relation ra2 ON r.book = ra2.id
            LEFT JOIN genshin_relation ra4 ON r.area = ra4.id
          WHERE ${whereStr}
          LIMIT ? OFFSET ?
        `, [...whereArr, body.page.n, body.page.m])
        pool.query(sql, [], (err, data) => {
          if(err) {
            return res.json(Res(500, [], '列表获取失败!' + err));
          } else {
            let resData = {
              records: data.rows || data,
              size: body.page.pageSize,
              current: body.page.pageNum,
              total
            }
            res.json(Res(200, resData))
          }
        })
      }
    })
  },

  getRelationInfo(req, res, next) {
    let type = req.query.type || ''
    let sql = `SELECT * FROM genshin_relation AS r ORDER BY r.id ASC`
    const typeMap = {
      element: `r.element_type`,
      weapon: `r.weapon_type`,
      book: `r.book_type`,
      week: `r.week_name`,
      area: `r.area_type`,
      room: `r.room_type`
    }
    let params = typeMap[type] || ''
    if(params) {
      sql = `SELECT r.id, ${params} FROM genshin_relation AS r WHERE ${params} <> '' ORDER BY r.id ASC`
    }
    pool.query(sql, [], (err, data) => {
      if(err) {
        res.json(Res(500, [], '获取失败!' + err));
      } else {
        res.json(Res(200, data.rows || data))
      }
    })
  },

  getWeaponInfo(req, res, next) {
    let body = req.body
    body.page = Page(body.page)
    let total = 0
    let whereStr = ''
    let whereArr = []
    if(body.name) {
      whereStr += `w.name LIKE ? AND `
      whereArr.push(`%${body.name}%`)
    }
    if(body.star != null && body.star != -2) {
      whereStr += `w.star = ? AND `
      whereArr.push(body.star)
    }
    if(body.item != null && body.item != -2) {
      whereStr += `w.item = ? AND `
      whereArr.push(body.item)
    }
    if(body.weapon != null && body.weapon != -2) {
      whereStr += `w.weapon = ? AND `
      whereArr.push(body.weapon)
    }
    whereStr += 'TRUE'
    let sql0 = SqlString.format(`SELECT COUNT(1) AS total FROM genshin_weapon w WHERE ${whereStr}`, whereArr)
    pool.query(sql0, [], (err0, data0) => {
      if(err0) {
        return res.json(Res(500, [], '总数获取失败!' + err0));
      } else {
        data0.rows = data0.rows || data0
        total = Number(data0.rows[0].total)
        let sql = SqlString.format(
          `SELECT
            w.id,
            w.name,
            w.star,
            ra1.weapon_type,
            ra2.item_type,
            w.mhy_url,
            w.wiki_url 
          FROM
            genshin_weapon w
            LEFT JOIN genshin_relation ra1 ON w.weapon = ra1.id
            LEFT JOIN genshin_relation ra2 ON w.item = ra2.id
          WHERE ${whereStr}
          LIMIT ? OFFSET ?
        `, [...whereArr, body.page.n, body.page.m])
        pool.query(sql, [], (err, data) => {
          if(err) {
            return res.json(Res(500, [], '列表获取失败!' + err));
          } else {
            let resData = {
              records: data.rows || data,
              size: body.page.pageSize,
              current: body.page.pageNum,
              total
            }
            res.json(Res(200, resData))
          }
        })
      }
    })
  },

  getItemInfo(req, res, next) {
    let body = req.body
    body.page = Page(body.page)
    let total = 0
    let whereStr = ''
    let whereArr = []
    if(body.name) {
      whereStr += `w.name LIKE ? AND `
      whereArr.push(`%${body.name}%`)
    }
    if(body.star != null && body.star != -2) {
      whereStr += `w.star = ? AND `
      whereArr.push(body.star)
    }
    if(body.week != null && body.week != -2) {
      whereStr += `w.week = ? AND `
      whereArr.push(body.week)
    }
    if(body.item != null && body.item != -2) {
      whereStr += `w.item = ? AND `
      whereArr.push(body.item)
    }
    whereStr += 'TRUE'
    let sql0 = SqlString.format(`SELECT COUNT(1) AS total FROM genshin_item w WHERE ${whereStr}`, whereArr)
    pool.query(sql0, [], (err0, data0) => {
      if(err0) {
        return res.json(Res(500, [], '总数获取失败!' + err0));
      } else {
        data0.rows = data0.rows || data0
        total = Number(data0.rows[0].total)
        let sql = SqlString.format(
          `SELECT
            w.id,
            w.name,
            w.star,
            w.mhy_url,
            w.wiki_url 
          FROM
            genshin_item w
          WHERE ${whereStr}
          LIMIT ? OFFSET ?
        `, [...whereArr, body.page.n, body.page.m])
        pool.query(sql, [], (err, data) => {
          if(err) {
            return res.json(Res(500, [], '列表获取失败!' + err));
          } else {
            let resData = {
              records: data.rows || data,
              size: body.page.pageSize,
              current: body.page.pageNum,
              total
            }
            res.json(Res(200, resData))
          }
        })
      }
    })
  },

  getBookInfo(req, res, next) {
    let body = req.body
    body.page = Page(body.page)
    let total = 0
    let whereStr = ''
    let whereArr = []
    if(body.name) {
      whereStr += `w.name LIKE ? AND `
      whereArr.push(`%${body.name}%`)
    }
    if(body.star != null && body.star != -2) {
      whereStr += `w.star = ? AND `
      whereArr.push(body.star)
    }
    if(body.week != null && body.week != -2) {
      whereStr += `w.week = ? AND `
      whereArr.push(body.week)
    }
    if(body.book != null && body.book != -2) {
      whereStr += `w.book = ? AND `
      whereArr.push(body.book)
    }
    whereStr += 'TRUE'
    let sql0 = SqlString.format(`SELECT COUNT(1) AS total FROM genshin_book w WHERE ${whereStr}`, whereArr)
    pool.query(sql0, [], (err0, data0) => {
      if(err0) {
        return res.json(Res(500, [], '总数获取失败!' + err0));
      } else {
        data0.rows = data0.rows || data0
        total = Number(data0.rows[0].total)
        let sql = SqlString.format(
          `SELECT
            w.id,
            w.name,
            w.star,
            w.mhy_url,
            w.wiki_url 
          FROM
            genshin_book w
          WHERE ${whereStr}
          LIMIT ? OFFSET ?
        `, [...whereArr, body.page.n, body.page.m])
        pool.query(sql, [], (err, data) => {
          if(err) {
            return res.json(Res(500, [], '列表获取失败!' + err));
          } else {
            let resData = {
              records: data.rows || data,
              size: body.page.pageSize,
              current: body.page.pageNum,
              total
            }
            res.json(Res(200, resData))
          }
        })
      }
    })
  },
}