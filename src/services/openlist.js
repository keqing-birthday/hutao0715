const OPENLIST = 'https://list.moonedge.cn'
export const ALBUM_PATH = '/胡桃生日会'
const IMG_EXT = /\.(jpe?g|png|gif|webp|avif)$/i

/**
 * 列出目录内容，拆分为「子文件夹」与「图片」
 * 注意：匿名访问下 refresh 必须为 false，传 true 会返回 403
 */
async function listDir(path) {
  const res = await fetch(`${OPENLIST}/api/fs/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path,
      password: '',
      page: 1,
      per_page: 0,
      refresh: false,
    }),
  })

  const json = await res.json()
  if (json.code !== 200) {
    throw new Error(json.message || '目录读取失败')
  }

  const content = json.data?.content || []
  return {
    folders: content
      .filter((f) => f.is_dir)
      .sort((a, b) => a.name.localeCompare(b.name, 'zh')),
    images: content
      .filter((f) => !f.is_dir && IMG_EXT.test(f.name))
      .sort((a, b) => b.modified.localeCompare(a.modified)),
  }
}

/**
 * 列出图集根目录：子文件夹 + 根目录下的散图
 */
export async function listAlbum() {
  return listDir(ALBUM_PATH)
}

/**
 * 获取单个文件的 raw_url
 */
async function getRawUrl(path) {
  const res = await fetch(`${OPENLIST}/api/fs/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  })

  const json = await res.json()
  return json.code === 200 ? json.data?.raw_url : null
}

/**
 * 批量并发获取 raw_url（分批，每批 10 个）
 * @param {string} path 图片所在目录
 * @param {Array} files 该目录下的文件列表
 */
export async function fetchImageUrls(path, files, { onProgress } = {}) {
  const BATCH_SIZE = 10
  const results = []

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.all(
      batch.map(async (f) => {
        try {
          const url = await getRawUrl(`${path}/${f.name}`)
          return url
            ? { name: f.name, time: f.modified, url, size: f.size }
            : null
        } catch {
          return null
        }
      })
    )
    results.push(...batchResults.filter(Boolean))
    if (onProgress) {
      onProgress(Math.min(i + BATCH_SIZE, files.length), files.length)
    }
  }

  return results
}

/**
 * 取单个文件夹的封面（该文件夹内最新的一张图）与图片数量
 * 由文件夹卡片在滚动到可视区时按需调用，避免一次性拉取所有封面
 */
export async function loadFolderCover(folderName) {
  const path = `${ALBUM_PATH}/${folderName}`
  const { images } = await listDir(path)
  if (images.length === 0) {
    return { cover: null, count: 0 }
  }
  const cover = await getRawUrl(`${path}/${images[0].name}`)
  return { cover, count: images.length }
}

/**
 * 列出某个子文件夹内的图片元数据（不换取 raw_url，交给分页加载）
 */
export async function listFolderFiles(folderName) {
  const path = `${ALBUM_PATH}/${folderName}`
  const { images } = await listDir(path)
  return { path, files: images }
}
