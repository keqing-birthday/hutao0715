const OPENLIST = 'https://list.moonedge.cn'
const ALBUM_PATH = '/胡桃生日会'
const IMG_EXT = /\.(jpe?g|png|gif|webp|avif)$/i

/**
 * 列出目录下所有图片文件
 */
export async function listAlbumFiles() {
  const res = await fetch(`${OPENLIST}/api/fs/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: ALBUM_PATH,
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
  return content
    .filter((f) => !f.is_dir && IMG_EXT.test(f.name))
    .sort((a, b) => b.modified.localeCompare(a.modified))
}

/**
 * 批量并发获取 raw_url（分批，每批 10 个）
 */
export async function fetchImageUrls(files, { onProgress } = {}) {
  const BATCH_SIZE = 10
  const results = []

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.all(
      batch.map(async (f) => {
        try {
          const url = await getRawUrl(f.name)
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
 * 获取单个文件的 raw_url
 */
async function getRawUrl(name) {
  const res = await fetch(`${OPENLIST}/api/fs/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: `${ALBUM_PATH}/${name}` }),
  })

  const json = await res.json()
  return json.code === 200 ? json.data?.raw_url : null
}
