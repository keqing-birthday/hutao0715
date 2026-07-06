# 胡桃生日会网站视觉优化任务

## 项目信息
- 路径: /tmp/hutao0715
- 技术栈: Vite + React 19 + Tailwind CSS 3 + lucide-react
- 当前分支: dev
- 执行环境: Linux (root)

## 10 项视觉优化需求（按优先级执行）

### 1. 轮播触控滑动优化（重点）
- 修改 `src/components/ui/ImageCarousel.jsx`
- 添加触摸滑动支持：touchstart/touchmove/touchend 事件处理
- 添加鼠标拖拽支持：mousedown/mousemove/mouseup 事件
- 边界阻力：拖拽到第一张/最后一张时增加阻力效果
- 滑动视觉反馈：拖拽时图片跟随手指/鼠标移动，释放后自动吸附到最近图片
- 键盘导航：左右箭头键切换图片
- 当前图片下方显示指示点（小圆点），当前高亮
- 保留原有的自动轮播和悬停暂停功能

### 2. Hero 背景层次增强
- 修改 `src/sections/Hero.jsx` 和 `src/index.css`
- 添加水墨/梅花剪影背景装饰层（SVG 或 CSS 实现）
- 添加宣纸纹理背景（使用 subtle 的 CSS 纹理或 SVG 图案）
- 卡片悬停浮起效果：在 ImageCarousel 的包裹容器上添加悬停时 translateY(-8px) + shadow 加深

### 3. 标题排版优化
- 修改 `src/sections/Hero.jsx`
- "雪霁梅香" 四字做错落排版：每个字有独立的旋转角度和偏移量
- "雪" -3deg，"霁" -1deg，"梅" +2deg，"香" +4deg
- 每个字之间增加微妙间距
- 标题周围添加梅花装饰元素（小型 SVG 梅花或 CSS 实现）

### 4. 花瓣效果增强
- 修改 `src/components/effects/PlumBlossoms.jsx`
- 将圆形花瓣改为 SVG 梅花瓣形状（5瓣梅花）
- 添加 3D 旋转效果：花瓣下落时带有 rotateX/rotateY 的 3D 翻转
- 深色模式发光：在 dark 模式下花瓣增加发光效果（box-shadow 或 filter: drop-shadow）
- 增加花瓣数量至 24 个，增加密度

### 5. 滚动动画增强
- 修改 `src/index.css` 和 `tailwind.config.js`
- 添加 fade-up 动画的 stagger 效果：子元素依次入场
- 添加视差滚动效果：Hero 背景光晕随滚动缓慢移动
- 在 About 和 Recruitment 板块的卡片上添加 scroll-triggered 动画
- 可使用 Intersection Observer API 实现滚动触发

### 6. 懒加载骨架屏
- 修改 `src/App.jsx`
- 为 Suspense 的 fallback 添加梅花 Loading 骨架屏组件
- 创建 `src/components/loading/SkeletonLoader.jsx`
- 设计：梅花轮廓旋转 + "加载中..." 文字，古风风格
- 替换现有的 `fallback={null}`

### 7. 页脚卷轴样式
- 修改 `src/components/layout/Footer.jsx`
- 添加卷轴/卷轴展开的装饰边框（CSS 边框样式）
- 在页脚顶部添加装饰性图案（梅花或彼岸花 CSS 图案）
- 保持现有内容不变，只添加装饰层

### 8. 播放器（如果存在）
- 检查项目中是否有音乐播放器组件
- 如果有，添加：唱片旋转动画、古风进度条（梅花或卷轴样式）
- 如果没有，跳过此项

### 9. 交互效果增强
- 修改 `src/components/ui/Button.jsx` 和 `src/components/ui/Card.jsx`
- 涟漪效果：点击按钮时产生水波纹/涟漪扩散效果
- 卡片放大：悬停时卡片轻微放大 scale(1.02) + 阴影加深
- 下划线动画：链接类文字的下划线从中心向两侧展开

### 10. 入口动画
- 修改 `src/App.jsx` 或 `src/main.jsx`
- 添加页面加载时的梅花绽放/蝴蝶引入动画
- 可作为页面加载覆盖层，2-3 秒后淡出
- 创建 `src/components/loading/IntroAnimation.jsx`

## 实现要求
- 所有修改都在 dev 分支上
- 保持代码风格与现有项目一致
- 使用 React hooks 和函数组件
- 优先使用 CSS 动画和 Tailwind utilities，必要时用 Framer Motion 或类似库（但项目目前没装，建议用 CSS 实现）
- 深色模式适配：所有新效果在 dark 模式下也要正确显示
- 性能考虑：避免过多重渲染，使用 useMemo/useCallback 优化
- 不要安装新的依赖包（除非用户明确要求），用现有技术栈实现
- 修改完成后运行 `npm run build` 验证构建成功
- 修改完成后运行 `git add . && git commit -m "feat: visual optimization — 10 项视觉增强"` 提交代码

## 开始执行
请逐个实现上述 10 项优化，每完成一项简要说明修改了哪些文件。如果某项因技术限制无法实现，说明原因并给出替代方案。
