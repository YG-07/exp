var express = require('express');
var router = express.Router();
var { pool } = require('../db/dbConnect')
var {
  getConstUrlInfo,
  getRoleInfo,
  getRelationInfo,
  getWeaponInfo,
  getItemInfo,
  getBookInfo
} = require('../api/genshin')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is a genshin api!');
});

// 获取常用Url数据
router.get('/common_url', (req, res, next) => getConstUrlInfo(req, res, next))
// 分页查询角色信息
router.post('/role', (req, res, next) => getRoleInfo(req, res, next))
// 获取关系列表
router.get('/relation', (req, res, next) => getRelationInfo(req, res, next))
// 分页查询武器信息
router.post('/weapon', (req, res, next) => getWeaponInfo(req, res, next))
// 分页查询材料信息
router.post('/item', (req, res, next) => getItemInfo(req, res, next))
// 分页查询天赋书信息
router.post('/book', (req, res, next) => getBookInfo(req, res, next))







module.exports = router;
