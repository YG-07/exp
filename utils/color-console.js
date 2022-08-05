
// 各种颜色的console
// 字色编号：30黑，31红，32绿，33黄，34蓝，35紫，36深绿，37白色
// 背景编号：40黑，41红，42绿，43黄，44蓝，45紫，46深绿，47白色
module.exports = function (fnum, bnum = 40) {
  if(fnum == 0) { return '\033[0m' }
  return '\033[' + fnum + ';' + bnum + 'm';
}