const validateuser = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入账号'))
  } else if (!/^\w+$/.test(value)) {
    return callback(new Error('请输入数字(或英文字母或下划线组成的字符串)'))
  } else {
    callback()
  }
}
const validatenick = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('不能为空'))
  } else if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
    return callback(new Error('请输入正确用户名'))
  } else {
    callback()
  }
}

const validatechinese = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('不能为空'))
  } else if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
    return callback(new Error('请输入中文字符'))
  } else {
    callback()
  }
}
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (!/^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/.test(value)) {
    return callback(new Error('密码必须由最少6位英文字母和数字的字符串组成！'))
  } else {
    FormData.PassWord = value
    callback()
  }
}
const validatePass1 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (!/^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/.test(value)) {
    return callback(new Error('密码必须由最少6位英文字母和数字的字符串组成！'))
  } else {
    if(value!=FormData.PassWord){
      return callback(new Error('两次输入密码不一致'))
    }else{
      callback()
    }
  }
}

const validateAccount = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入账号信息'))
  } else if (!/^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/.test(value)) {
    return callback(new Error('账号由英文字母和数字的字符串组成！'))
  } else {
    callback()
  }
}
/** 验证折扣（大于0小于100） */
const validateDist = (rule, value, callback) => {
  if (value <= 0||value>100) {
    callback(new Error('超出范围'))
  } else {
    callback()
  }
}
/** 验证非空 */
const validateIsNull =  (rule, value, callback) => {
  if (!value) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}
/** 验证非空数组 */
const validateArrayIsNull =  (rule, value, callback) => {
  if (value.length==0) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}

/** 验证模板规格 */
const validateTempAttr =  (rule, value, callback) => {
  if (value.length==0) {
    callback(new Error('请添加模板规格'))
  } else {
    var errorcount = 0
    value.forEach((item)=>{
      if(!item.AttrName){
        errorcount++
      }
    })
    if(errorcount>0){
      callback(rule.message)
    } else {
      callback()
    }
  }
}
/** 验证钱，金额合法性 */
const validateMoney = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入金额'))
  } else if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
    return callback(new Error('格式错误'))
  } else {
    FormData.PassWord = value
    callback()
  }
}

/** 验证身份证合法性 */
const validateIdCardNo = function (id, backInfo) {
  var info = {
    y: '1900',
    m: '01',
    d: '01',
    sex: 'male',
    valid: false,
    length: 0
  }
  var initDate = function (length) {
    info.length = length
    var a = length === 15 ? 0 : 2 // 15:18
    var temp = ''
    info.y = (a ? '' : '19') + id.substring(6, 8 + a)
    info.m = id.substring(8 + a, 10 + a)
    info.d = id.substring(10 + a, 12 + a)
    info.sex = id.substring(14, 15 + a) % 2 === 0 ? 'female' : 'male'
    temp = new Date(info.y, info.m - 1, info.d)
    return (temp.getFullYear() === info.y * 1) && (temp.getMonth() + 1 === info.m * 1) && (temp.getDate() === info.d * 1)
  }
  var back = function () {
    return backInfo ? info : info.valid
  }
  if (typeof id !== 'string') return back()
  // 18
  if (/^\d{17}[0-9x]$/i.test(id)) {
    if (!initDate(18)) return back()
    id = id.toLowerCase().split('')
    var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    var y = '10x98765432'.split('')
    var sum = 0
    for (var i = 0; i < 17; i++) {
      sum += wi[i] * id[i]
    }
    if (y[sum % 11] === id.pop().toLowerCase()) {
      info.valid = true
    }
    return back()
  } else if (/^\d{15}$/.test(id)) { // 15位
    if (initDate(15)) {
      info.valid = true
    }
    return back()
  } else {
    return back()
  }
}

// 身份证号码验证
const validateIDCard = (rule, value, callback) => {
  var v = validateIdCardNo(value, false)
  if (!v) {
    callback(new Error('请输入正确的身份证号码！'))
  } else {
    callback()
  }
}

const validatePhone = (rule, value, callback) => {
  if (!/^(\+\d{2}-)?(\d{2,3}-)?([1][3,4,5,7,8][0-9]\d{8})$|^0\d{2,3}-?\d{7,8}$/.test(value)) {
    return callback(new Error('请输入正确的手机号！'))
  } else {
    callback()
  }
}
const validateEmail = (rule, value, callback) => {
  if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
    return callback(new Error('请输入正确电子邮件！'))
  } else {
    callback()
  }
}
const validatePassCheck = (rule, value, callback) => {
  if (value !== FormData.PassWord) {
    return callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}

const validateChar = (rule, value, callback) => {
  if (!/^\w+$/.test(value)) {
    return callback(new Error('请输入正确格式（数字、26个英文字母或下划线组成的字符串！）'))
  } else {
    callback()
  }
}
const validateInt = (rule, value, callback) => {
  if (!/^[0-9]*[1-9][0-9]*$/.test(value)) {
    return callback(new Error('请输入整数'))
  } else {
    callback()
  }
}
const validateFloat2 = (rule, value, callback) => {
  if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(value)) {
    return callback(new Error('最多只能包含两位小数'))
  } else {
    callback()
  }
}

export const verification = {
  validatePassCheck,
  validateuser,
  validatenick,
  validatePass,
  validatePass1,
  validatePhone,
  validateChar,
  validatechinese,
  validateEmail,
  validateIdCardNo,
  validateIDCard,
  validateAccount,
  validateMoney,
  validateIsNull,
  validateArrayIsNull,
  validateTempAttr,
  validateDist,
  validateInt,
  validateFloat2
}
