const path = require('path')
const cheerio = require('cheerio')
const Request = require('axer').request
const file = require('axer').file
const config = require('./config')

async function getKeywordPhoto(keyword, sum) {
  const cookieJarPath = path.resolve(config.storageDir, 'cookieJar.json')
  const request = new Request(cookieJarPath)

  const albumPath = path.resolve(config.storageDir, keyword)
  await file.mkdir(albumPath)

  let imageSrc = []
  for (let i = 0; i < sum; i += 20) {
    const response = await request.get(`http://browse.renren.com/s/album?q=${encodeURIComponent(keyword)}&offset=${i}&l=20&t=1`)
    const $ = cheerio.load(response.body)
    const imgs = $('.photocell').map((i, el) => {
      return el.children[0]
    }).get().filter(el => {
      return el.next.name === 'a'
    }).map(el => {
      return el.next.children[1].attribs.src
    })
    imageSrc = imageSrc.concat(imgs)
  }

  imageSrc = imageSrc.slice(0, sum)
  console.log(imageSrc)

  for (let i = 0; i < imageSrc.length; i++) {
    const link = imageSrc[i]
    const arr = link.split('/')
    const photoSavePath = path.resolve(albumPath, arr[arr.length - 1])
    // 下载照片
    try {
      await request.download(link, photoSavePath)
    } catch (error) {
      console.log('下载出现错误，将再次尝试一次下载')
      await request.download(link, photoSavePath)
    }
  }

}

exports.getPhoto = getKeywordPhoto