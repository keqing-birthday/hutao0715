import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  ArrowLeft,
  RefreshCw,
  Images,
  Folder,
  FolderOpen,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PlumBlossoms from '../components/effects/PlumBlossoms'
import Tag from '../components/ui/Tag'
import { listAlbum, loadFolderCover, listFolderFiles, ALBUM_PATH } from '../services/openlist'
import { usePagedImages } from '../hooks/usePagedImages'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const PAGE_SIZE = 24

/* ---------- Lightbox ---------- */

function AlbumLightbox({ items, activeIndex, onClose, onPrevious, onNext }) {
  const closeButtonRef = useRef(null)
  const closingRef = useRef(false)
  const [closing, setClosing] = useState(false)
  const item = items[activeIndex]

  // 先播放关闭动画，动画结束后再真正卸载
  const requestClose = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    window.setTimeout(onClose, 160)
  }, [onClose])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') requestClose()
      if (event.key === 'ArrowLeft') onPrevious()
      if (event.key === 'ArrowRight') onNext()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onNext, onPrevious, requestClose])

  if (!item) return null

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-ink/90 p-4 sm:p-8 backdrop-blur-md motion-reduce:animate-none ${
        closing ? 'animate-lightbox-backdrop-out' : 'animate-lightbox-backdrop'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="查看图片"
      onClick={requestClose}
    >
      <div
        className="relative flex h-full w-full max-w-6xl items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={requestClose}
          className="absolute right-0 top-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 bg-ink/75 text-paper transition-colors hover:border-plum hover:text-plum focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
          aria-label="关闭大图浏览"
        >
          <X size={22} aria-hidden="true" />
        </button>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={onPrevious}
              className="absolute left-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 bg-ink/75 text-paper transition-colors hover:border-plum hover:text-plum focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
              aria-label="查看上一张图片"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 bg-ink/75 text-paper transition-colors hover:border-plum hover:text-plum focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
              aria-label="查看下一张图片"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </>
        )}

        <figure
          className={`flex max-h-full max-w-[calc(100%-3.5rem)] flex-col items-center motion-reduce:animate-none ${
            closing ? 'animate-lightbox-image-out' : 'animate-lightbox-image'
          }`}
        >
          <img
            src={item.url}
            alt="图集照片"
            className="max-h-[78vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
        </figure>
      </div>
    </div>
  )
}

/* ---------- Gallery Grid ---------- */

function GalleryGrid({ images, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {images.map((item, index) => (
        <button
          key={item.name + index}
          type="button"
          onClick={() => onSelect(index)}
          className="group relative block w-full overflow-hidden rounded-lg border border-card-border bg-card text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-plum/60 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
          aria-label={`查看大图 第${index + 1}张`}
        >
          {/* 固定 4:3 占位，保证图片未加载时也有高度，无限滚动才不会误触发 */}
          <div className="aspect-[4/3] w-full overflow-hidden bg-ink/40">
            <img
              src={item.url}
              alt="图集照片"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 bg-ink/75 text-paper opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Expand size={17} aria-hidden="true" />
          </span>
        </button>
      ))}
    </div>
  )
}

/* ---------- Folder Card ---------- */

function FolderCard({ folder, onOpen }) {
  const cardRef = useRef(null)
  const [meta, setMeta] = useState(null)

  // 滚动到可视区附近时再取封面与张数，避免一次性请求所有文件夹
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    let cancelled = false
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()
        loadFolderCover(folder.name)
          .then((res) => {
            if (!cancelled) setMeta(res)
          })
          .catch(() => {
            if (!cancelled) setMeta({ cover: null, count: 0 })
          })
      },
      { rootMargin: '300px 0px' }
    )

    observer.observe(el)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [folder.name])

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onOpen(folder.name)}
      aria-label={`打开相册 ${folder.name}`}
      className="group relative block w-full overflow-hidden rounded-xl border border-card-border bg-card text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-plum/60 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-ink/40">
        {meta?.cover ? (
          <img
            src={meta.cover}
            alt={`${folder.name} 封面`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-paper-dim/40">
            <Folder size={44} aria-hidden="true" className={meta === null ? 'animate-pulse' : ''} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <span className="min-w-0">
          <span className="block text-title text-base text-paper truncate">{folder.name}</span>
          <span className="mt-0.5 block text-xs text-paper-dim">
            {meta ? `${meta.count} 张` : '加载中…'}
          </span>
        </span>
        <FolderOpen
          size={18}
          aria-hidden="true"
          className="shrink-0 text-paper-dim transition-colors group-hover:text-plum"
        />
      </div>
    </button>
  )
}

/* ---------- Album Page ---------- */

export default function AlbumPage() {
  const navigate = useNavigate()
  const containerRef = useScrollAnimation()
  const sentinelRef = useRef(null)

  const [folders, setFolders] = useState([])
  const [activeFolder, setActiveFolder] = useState(null)

  const [loading, setLoading] = useState(true)
  const [folderLoading, setFolderLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lightbox, setLightbox] = useState(null)

  // 根目录散图 与 文件夹内图片 各自分页
  const rootPaged = usePagedImages(PAGE_SIZE)
  const folderPaged = usePagedImages(PAGE_SIZE)

  const inFolder = activeFolder !== null
  const paged = inFolder ? folderPaged : rootPaged
  const { hasMore: pagedHasMore, loadingMore: pagedLoadingMore, loadMore: pagedLoadMore } = paged

  const loadIndex = useCallback(async () => {
    setLoading(true)
    setError(null)
    setActiveFolder(null)
    folderPaged.clear()

    try {
      const { folders: dirs, images: rootFiles } = await listAlbum()
      setFolders(dirs)
      rootPaged.reset(ALBUM_PATH, rootFiles)
      rootPaged.loadMore()
    } catch (err) {
      setError(err.message || '加载失败，请检查网络')
    } finally {
      setLoading(false)
    }
  }, [folderPaged, rootPaged])

  useEffect(() => {
    loadIndex()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openFolder = useCallback(
    async (name) => {
      setActiveFolder(name)
      setFolderLoading(true)
      setError(null)
      folderPaged.clear()

      try {
        const { path, files } = await listFolderFiles(name)
        folderPaged.reset(path, files)
        folderPaged.loadMore()
      } catch (err) {
        setError(err.message || '加载失败，请检查网络')
      } finally {
        setFolderLoading(false)
      }
    },
    [folderPaged]
  )

  const backToFolders = () => {
    setActiveFolder(null)
    folderPaged.clear()
    setError(null)
  }

  // 滚动到底部自动加载下一批
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !pagedHasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) pagedLoadMore()
      },
      { rootMargin: '400px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [pagedHasMore, pagedLoadingMore, pagedLoadMore])

  const closeLightbox = () => setLightbox(null)
  const showPrevious = () =>
    setLightbox((s) => (s ? { ...s, index: (s.index + s.items.length - 1) % s.items.length } : s))
  const showNext = () =>
    setLightbox((s) => (s ? { ...s, index: (s.index + 1) % s.items.length } : s))

  const loadingBlock = (
    <div className="rounded-lg border border-card-border bg-card/40 py-20 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-plum/10 text-plum mb-4 animate-spin">
        <RefreshCw size={20} />
      </div>
      <p className="text-paper-dim mb-2">正在加载图集…</p>
      {paged.total > 0 && (
        <p className="text-sm text-paper-dim/60">
          已加载 {paged.images.length} / {paged.total} 张图片
        </p>
      )}
    </div>
  )

  const errorBlock = (
    <div className="rounded-lg border border-card-border bg-card/40 py-20 text-center">
      <p className="text-fire mb-4">{error}</p>
      <button
        onClick={() => (inFolder ? openFolder(activeFolder) : loadIndex())}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-plum text-paper text-sm font-medium hover:bg-fire transition-colors"
      >
        <RefreshCw size={16} />
        重新加载
      </button>
    </div>
  )

  const emptyBlock = (text) => (
    <div className="rounded-lg border border-dashed border-card-border bg-card/40 py-20 text-center text-paper-dim">
      <Images size={40} className="mx-auto mb-3 opacity-40" />
      <p>{text}</p>
    </div>
  )

  // 当前上下文「有文件但首批还没回来」时，展示加载态而不是空状态
  const firstPageLoading = paged.total > 0 && paged.images.length === 0

  const gridBlock = (
    <>
      {paged.images.length > 0 && (
        <GalleryGrid
          images={paged.images}
          onSelect={(index) => setLightbox({ items: paged.images, index })}
        />
      )}
      {paged.hasMore && (
        <div
          ref={sentinelRef}
          className="mt-8 flex items-center justify-center gap-2 py-6 text-sm text-paper-dim"
        >
          <RefreshCw size={16} className="animate-spin" />
          <span>
            正在加载更多…（{paged.images.length} / {paged.total}）
          </span>
        </div>
      )}
    </>
  )

  return (
    <div className="relative min-h-screen bg-ink text-paper overflow-x-hidden">
      <PlumBlossoms />
      <Navbar />

      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div ref={containerRef} className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-on-scroll">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <button
                  onClick={() => (inFolder ? backToFolders() : navigate('/'))}
                  className="inline-flex items-center gap-1.5 text-sm text-paper-dim hover:text-plum transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>{inFolder ? '返回相册' : '返回首页'}</span>
                </button>
              </div>
              <div className="mb-4 flex justify-start">
                <Tag className="text-base px-4 py-1.5">
                  <Images size={16} className="inline mr-1 -mt-0.5" />
                  生日会图集
                </Tag>
              </div>
              <h1 className="text-title text-3xl md:text-4xl text-paper mb-3">
                {inFolder ? activeFolder : '光影留存'}
              </h1>
              <p className="text-paper-dim max-w-xl">
                {inFolder
                  ? '点击单图可查看完整大图。'
                  : '每一张画面都承载着相遇与心意。点击分类进入相册，点击单图可查看完整大图。'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            {/* 分类视图 */}
            {!inFolder && loading && loadingBlock}
            {!inFolder && !loading && error && errorBlock}

            {!inFolder &&
              !loading &&
              !error &&
              (folders.length === 0 && rootPaged.total === 0
                ? emptyBlock('暂无相册，请前往 OpenList 上传后刷新页面。')
                : (
                  <>
                    {folders.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {folders.map((folder) => (
                          <FolderCard key={folder.name} folder={folder} onOpen={openFolder} />
                        ))}
                      </div>
                    )}

                    {rootPaged.total > 0 && (
                      <div className={folders.length > 0 ? 'mt-14' : ''}>
                        {folders.length > 0 && (
                          <h2 className="text-title text-xl text-paper mb-5">未分类</h2>
                        )}
                        {firstPageLoading && !inFolder ? loadingBlock : gridBlock}
                      </div>
                    )}
                  </>
                ))}

            {/* 文件夹视图 */}
            {inFolder && folderLoading && loadingBlock}
            {inFolder && !folderLoading && error && errorBlock}
            {inFolder &&
              !folderLoading &&
              !error &&
              (folderPaged.total === 0
                ? emptyBlock('该相册暂无图片。')
                : firstPageLoading
                  ? loadingBlock
                  : gridBlock)}
          </div>
        </div>
      </main>

      <Footer showContact={false} showGroupNumber={false} />

      {lightbox && (
        <AlbumLightbox
          items={lightbox.items}
          activeIndex={lightbox.index}
          onClose={closeLightbox}
          onPrevious={showPrevious}
          onNext={showNext}
        />
      )}
    </div>
  )
}
