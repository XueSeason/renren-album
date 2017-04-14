const path = require('path')
const cheerio = require('cheerio')
const Request = require('axer').request
const file = require('axer').file
const config = require('./config')

async function getPhoto(album) {
  const cookieJarPath = path.resolve(config.storageDir, 'cookieJar.json')
  const request = new Request(cookieJarPath)

  // 获取相册内照片连接
  const albumResponse = await request.get(`http://photo.renren.com/photo/${album.ownerId}/album-${album.albumId}/v7`)
  const regex = /photo = ((.|\n)*|);\n;/g
  const m = regex.exec(albumResponse.body)
  const photoListContent = m && m[1]
  const photoListInfo = JSON.parse(photoListContent.replace(/'/g, '"'))
  console.log(JSON.stringify(photoListInfo, null, 2))

  for (let i = 0; i < photoListInfo.photoList.photoList.length; i++) {
    const photo = photoListInfo.photoList.photoList[i]
    // 创建相册目录
    const albumPath = path.resolve(config.storageDir, `${album.ownerId}`, album.albumName)
    await file.mkdir(albumPath)

    const originalPhotoUrl = photo.url.replace('large', 'original')
    const photoSavePath = path.resolve(albumPath, `${photo.photoId}.jpg`)
    // 下载照片
    try {
      await request.download(originalPhotoUrl, photoSavePath)
    } catch (error) {
      console.log('下载出现错误，将再次尝试一次下载')
      await request.download(originalPhotoUrl, photoSavePath)
    } 
  }
}

async function getAlbum(ownerId) {
  const cookieJarPath = path.resolve(config.storageDir, 'cookieJar.json')
  const request = new Request(cookieJarPath)

  // 获取相册详情
  const albumlistResponse = await request.get(`http://photo.renren.com/photo/${ownerId}/albumlist/v7`)
  const regex = /photo = ((.|\n)*|);\nnx/g
  const m = regex.exec(albumlistResponse.body)
  const albumlistContent = m && m[1]
  const albumlistInfo = JSON.parse(albumlistContent.replace(/'/g, '"'))
  console.log(JSON.stringify(albumlistInfo, null, 2))

  for(let i = 0; i < albumlistInfo.albumList.albumList.length; i++) {
    const album = albumlistInfo.albumList.albumList[i]
    // 获取相册内到照片
    try {
      await getPhoto(album) 
    } catch (error) {
      console.log('获取照片失败', error)
    }
  }
}

async function getSelfAlbum() {
  const cookieJarPath = path.resolve(config.storageDir, 'cookieJar.json')
  const request = new Request(cookieJarPath)

  const homeResponse = await request.get('http://www.renren.com')

  const $ = cheerio.load(homeResponse.body)
  // 运行脚本获取数据并删除污染变量
  let nxcontent = $('script').first().text()
  console.log(homeResponse.body)
  eval(nxcontent)
  const user = nx.user
  delete nx
  console.log(user)

  await getAlbum(user.id)
}

exports.getSelfAlbum = getSelfAlbum
exports.getAlbum = getAlbum