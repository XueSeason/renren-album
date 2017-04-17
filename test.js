const password = '123456'

const keyInfo = {
  isEncrypt: true,
  e: '10001',
  n: 'b5dbed3c4342363e3ecaf3ea4210cb1771270a7313315e82a227b906977245ad',
  maxdigits: '19',
  rkey: '386db1871dce1b360f18ae81a91aabdf'
}

const NodeRSA = require('node-rsa')
const key = new NodeRSA(null, {
  encryptionScheme: 'pkcs1',
})
key.importKey({
  n: new Buffer(keyInfo.n, 'hex'),
  e: parseInt(keyInfo.e, 16),
}, 'components-public')
const encrypted = key.encrypt(password, 'hex')
console.log(encrypted)

const r = require('./encrypt')
r.getKeys(keyInfo.e, keyInfo.n, keyInfo.maxdigits)
console.log(r.encrypt(password))


// http://hdn.xnimg.cn/photos/hdn321/20120825/1805/p/m3w307h230q85lt_h_large_y6jc_59cc00001fae1376.jpg
// http://hdn.xnimg.cn/photos/hdn321/20120825/1805/h_large_y6jc_59cc00001fae1376.jpg