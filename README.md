# 胡桃生日会 · 雪霁梅香

一个为《原神》角色胡桃（往生堂第七十七代堂主）准备的生日会同人网站。

> 本网站为同人非官方作品，仅供交流学习使用。
> 本站使用的角色、音乐、图像等素材版权归原作者所有。

## 特性

- **开屏动画**：梅花枝头生长 + 花瓣绽放的入场动画
- **水墨古风视觉**：暗色主题、梅花飘落、蝴蝶、宣纸纹理
- **独立图集相册**：单独的相册页，图片源自动同步 OpenList 目录，支持瀑布流布局与大图浏览
- **主题切换**：深色 / 浅色 / 跟随系统，首屏无闪烁
- **响应式布局**：桌面端与移动端自适应，移动端侧滑菜单
- **滚动动画**：基于 `IntersectionObserver` 的分段入场与视差效果

## 技术栈

- [Vite](https://vitejs.dev/) 6
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 3
- [React Router](https://reactrouter.com/) 7（`HashRouter`）
- [lucide-react](https://lucide.dev/) 图标
- `clsx` + `tailwind-merge`（`src/lib/utils.js` 的 `cn` 工具）

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产版本（输出到 dist/）
npm run build

# 预览生产构建
npm run preview
```

### 可选：图片优化脚本

`scripts/optimize-images.mjs` 会用 `sharp` 把 `public/images` 下的头像与二维码重新压缩为 WebP：

```bash
node scripts/optimize-images.mjs
```

## 路由与页面

| 路径 | 说明 |
| --- | --- |
| `/` | 首页：开屏动画、Hero、招募大厅、贡献成员、线下活动 |
| `/album` | 图集相册页：OpenList 目录自动枚举 + 大图浏览 |

首页板块支持通过查询参数直达：`/#/?section=recruitment`（可选值：`recruitment`、`credits`）。

## 目录结构

```
public/                  # 静态资源（原样拷贝到构建产物）
  _headers               # Cloudflare Pages 安全响应头
  theme-init.js          # 首屏主题预置脚本（避免暗色闪烁）
  ghost.png              # 站点图标 / Logo
  images/                # 图片资源（avatars/ 为头像）
  music/                 # 背景音乐
scripts/
  optimize-images.mjs    # sharp 图片压缩脚本
src/
  components/
    effects/             # 视觉特效（PlumBlossoms 梅花、Butterflies 蝴蝶）
    layout/              # Navbar、Footer
    loading/             # IntroAnimation、SkeletonLoader
    ui/                  # Button、Card、Tag、TalismanCard、ImageCarousel
    Countdown.jsx
    MemberCard.jsx
  data/
    members.js           # 成员 / 贡献成员数据
  hooks/
    useScrollAnimation.js
    useTheme.js
  lib/
    utils.js             # cn() 样式合并工具
  pages/
    AlbumPage.jsx        # 图集相册页
  sections/              # 首页板块（Hero / Recruitment / Credits / OfflineEvents）
  services/
    openlist.js          # OpenList API 客户端
  App.jsx                # 路由与页面组装
  main.jsx               # 应用入口
  index.css              # 全局样式与动画
  theme.css              # 主题 CSS 变量
```

## 图集数据源（OpenList）

相册页通过 OpenList 动态枚举目录，无需手动维护图片列表：

- 服务地址：`https://list.moonedge.cn`
- 根目录：`/胡桃生日会`

展示规则：

- 根目录下的**子文件夹**会渲染为相册分类卡片（封面取该文件夹内最新的一张图，显示图片数量），点击进入查看该文件夹的图片，页面顶部可「返回相册」
- 直接放在根目录下的**散图**归入「未分类」区域，与分类卡片一起展示
- 目前只支持**一级文件夹**（不做多级嵌套）

上传图片或新建文件夹后，刷新 `/album` 即可看到，无需改代码。逻辑见 `src/services/openlist.js`：

1. `POST /api/fs/list` 列出目录，拆分为子文件夹与图片（图片按修改时间倒序）
2. 进入相册时**分批加载**：每批 24 张调用 `POST /api/fs/get` 换取 `raw_url`，滚到列表底部自动加载下一批，不会一次性请求全部图片
3. 文件夹卡片**滚动到可视区附近**时才请求该文件夹的封面（最新一张图）与图片数量

> 注意：匿名访问时 `refresh` 必须为 `false`，传 `true` 会返回 403。
> 图集网格使用统一 **4:3** 卡片占位，保证图片未加载时也有高度，否则底部哨兵会一直停留在视口内导致连续拉取多批。

## 成员与贡献成员

所有成员信息集中在 `src/data/members.js`：

- `credits: [{ groupId, role }]` 决定成员在「贡献成员」各分组中的展示与职责
- `bilibili` 填写哔哩哔哩个人空间链接，留空则不显示跳转

## 部署

推送到 `main` / `dev` 分支（或向 `main` 提 PR）会自动触发 `.github/workflows/deploy.yml`，构建后部署到 Cloudflare Pages 项目 `hutao0715`。

需要的仓库 Secrets：

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

安全策略集中在 `public/_headers`（CSP、HSTS、`X-Content-Type-Options` 等），构建后随 `dist/` 一起生效。

## 开源协议

[MIT](LICENSE)

## 免责声明

- 本站与 miHoYo / HoYoverse 官方无关。
- 网站中的角色、音乐及第三方素材版权归原作者所有。
- 如有侵权请联系项目维护者处理。
