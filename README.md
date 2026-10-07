# 毛地张的复古桌面博客

> 一个融合 **Windows XP 桌面交互** + **Y2K 霓虹美学** + **二次元元素** 的个人博客。
> 访客像操作一台复古 PC 一样浏览文章、作品和信息。

## 🎨 风格特色

- 🖥️ **Windows XP 桌面**：可拖拽窗口、任务栏、开始菜单、系统托盘时钟
- 🌈 **Y2K 霓虹配色**：霓虹粉/蓝/紫/绿，星空背景，CRT 扫描线滤镜
- 🌸 **二次元点缀**：桌面宠物、樱花色系、萌系文案
- 🕹️ **Boot 启动动画**：像素风 LOGO + 加载进度条
- 💾 **纯静态**：无需后端，完美适配 GitHub Pages

## 📂 项目结构

```
520maodizhang.github.io/
├── index.html      # 主页面（桌面 + 窗口 + 任务栏）
├── style.css       # 全部样式（XP + Y2K + 二次元）
├── app.js          # 窗口管理 + 拖拽 + 内容渲染
└── README.md       # 说明文档
```

## 🚀 本地预览

```bash
# 方式1：Python 简易服务器
python3 -m http.server 8000

# 方式2：Node serve
npx serve .

# 然后打开 http://localhost:8000
```

## 🌐 部署到 GitHub Pages

1. 在 GitHub 创建名为 `520maodizhang.github.io` 的仓库
2. 将本目录所有文件推送到 `main` 分支
3. 在仓库 Settings → Pages → Source 选择 `main` 分支
4. 等待几分钟后访问 https://520maodizhang.github.io

## 🖥️ 内置功能

| 功能 | 说明 |
|---|---|
| 📝 我的博客 | 文章列表 + 标签 + 摘要 |
| 👤 关于我 | 个人介绍 + 技能标签 |
| 🎨 作品集 | 卡片网格 + 悬停效果 |
| 💬 留言板 | 本地存储的访客留言 |
| 🎵 音乐盒 | 播放列表（演示模式） |
| 🔗 友情链接 | 参考项目 + 社交链接 |

## 🎯 参考项目

- [Yuimi-chaya.github.io](https://github.com/Yuimi-chaya/Yuimi-chaya.github.io) — Astro 多主题二次元博客
- [pcmoe.net](https://www.pcmoe.net/) — 复古 PC 萌系风格
- [MoeKernel_Desktop](https://github.com/NNNullptr/MoeKernel_Desktop) — Windows XP 风格桌面系统

## 📝 自定义

编辑 `app.js` 中的渲染函数来修改内容：
- `renderBlog()` — 修改博客文章
- `renderAbout()` — 修改个人信息
- `renderWorks()` — 修改作品集
- `renderLinks()` — 修改友情链接

编辑 `style.css` 顶部的 CSS 变量来调整配色。

## 📄 License

MIT
