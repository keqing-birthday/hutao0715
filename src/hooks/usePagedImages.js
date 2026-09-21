import { useCallback, useRef, useState } from 'react'
import { fetchImageUrls } from '../services/openlist'

/**
 * 分页加载图片：先拿到目录里的文件元数据，再按页换取 raw_url。
 * 用于「进入相册只加载首批，滚动到底部再加载下一批」。
 */
export function usePagedImages(pageSize = 24) {
  const [images, setImages] = useState([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // 用 ref 保存分页游标，避免闭包读到旧值或并发重复触发
  const cursorRef = useRef({ path: '', files: [], loaded: 0, running: false })

  const reset = useCallback((path, files) => {
    cursorRef.current = { path, files, loaded: 0, running: false }
    setImages([])
    setTotal(files.length)
    setHasMore(files.length > 0)
    setLoadingMore(false)
  }, [])

  const clear = useCallback(() => {
    cursorRef.current = { path: '', files: [], loaded: 0, running: false }
    setImages([])
    setTotal(0)
    setHasMore(false)
    setLoadingMore(false)
  }, [])

  const loadMore = useCallback(async () => {
    const cursor = cursorRef.current
    if (cursor.running || cursor.loaded >= cursor.files.length) return

    cursor.running = true
    setLoadingMore(true)

    const slice = cursor.files.slice(cursor.loaded, cursor.loaded + pageSize)
    cursor.loaded += slice.length

    try {
      const items = await fetchImageUrls(cursor.path, slice)
      setImages((prev) => [...prev, ...items])
    } catch {
      // 单批失败也继续翻页，避免卡死
    } finally {
      cursor.running = false
      setLoadingMore(false)
      setHasMore(cursor.loaded < cursor.files.length)
    }
  }, [pageSize])

  return { images, total, hasMore, loadingMore, reset, clear, loadMore }
}
