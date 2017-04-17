const path = require('path')
const Request = require('axer').request
const file = require('axer').file
const readlineSync = require('readline-sync')
const exec = require('child_process').exec
const r = require('./encrypt')
const NodeRSA = require('node-rsa')
const config = require('./config')

async function login(account, password) {
  const cookieJarPath = path.resolve(config.storageDir, 'cookieJar.json')
  await file.touch(cookieJarPath)
  const request = new Request(cookieJarPath)

  // 获取 _rtk 参数
  const home = await request.get('http://www.renren.com')
  const regex = /_rtk : '(.*)'/
  const m = regex.exec(home.body)
  const rtk = m && m[1]
  console.log(rtk)

  const showCaptchaResponse = await request.post('http://www.renren.com/ajax/ShowCaptcha', {
    email: account,
    _rtk: rtk,
  })

  let icode = ''
  console.log(showCaptchaResponse.body)
  if (showCaptchaResponse.body === '1') { // 需要验证码
    const icodePath = path.resolve(dir, 'code.jpg')
    await request.download('http://icode.renren.com/getcode.do?t=web_login&rnd=Math.random()', icodePath)
    exec(`open ${icodePath}`)
    icode = readlineSync.question('输入验证码:')
  }

  // 获取 key
  const keyResponse = await request.get('http://login.renren.com/ajax/getEncryptKey')
  const keyInfo = JSON.parse(keyResponse.body)
  console.log(keyInfo)

  // 登录
  const loginUrl = `http://www.renren.com/ajaxLogin/login?1=1&uniqueTimestamp=${(new Date).getTime}`
  r.getKeys(keyInfo.e, keyInfo.n, keyInfo.maxdigits)

  // const key = new NodeRSA(null, {
  //   encryptionScheme: 'pkcs1',
  // })
  // key.importKey({
  //   n: new Buffer(keyInfo.n, 'hex'),
  //   e: parseInt(keyInfo.e, 16),
  // }, 'components-public')

  const loginResponse = await request.post(loginUrl, {
    email: account,
    icode, // 验证码
    password: r.encrypt(password),
    // password: key.encrypt(password, 'hex'),
    rkey: keyInfo.rkey,
    f: '',
    origURL: 'http://www.renren.com/home',
    domain: 'renren.com',
    key_id: 1,
    captcha_type: 'web_login',
  })
  const loginInfo = JSON.parse(loginResponse.body)
  console.log(loginInfo)

  const result = {
    code: -1,
    msg: '登录成功'
  }
  if (!loginInfo.code) {
    result.code = loginInfo.failCode
    result.msg = loginInfo.failDescription
  }

  console.log(result)
}

module.exports = login