/* ============================================
   复古桌面博客 - 应用逻辑
   融合 Windows XP + Y2K + 二次元
   ============================================ */

// ---- 窗口管理 ----
let windows = {};
let zIndexCounter = 100;
let activeWindow = null;

// ---- 启动动画 ----
window.addEventListener('load', () => {
  setTimeout(() => {
    const boot = document.getElementById('boot-screen');
    boot.style.opacity = '0';
    setTimeout(() => {
      boot.classList.add('hidden');
      document.getElementById('desktop').classList.remove('hidden');
      showPetBubble('欢迎来到毛地张的复古桌面~');
    }, 800);
  }, 3000);
});

// ---- 时钟 ----
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}`;
}
setInterval(updateClock, 1000);
updateClock();

// ---- 开始菜单 ----
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');

startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startMenu.classList.toggle('hidden');
  startBtn.classList.toggle('active');
});

document.addEventListener('click', () => {
  startMenu.classList.add('hidden');
  startBtn.classList.remove('active');
});

startMenu.addEventListener('click', (e) => e.stopPropagation());

// ---- 关机 ----
document.getElementById('shutdown-btn').addEventListener('click', () => {
  startMenu.classList.add('hidden');
  document.getElementById('desktop').classList.add('hidden');
  document.getElementById('shutdown-screen').classList.remove('hidden');
});

// ---- 桌面图标双击打开 ----
document.querySelectorAll('.desktop-icon').forEach(icon => {
  let clickCount = 0;
  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
    clickCount++;
    setTimeout(() => {
      if (clickCount === 2) {
        openWindow(icon.dataset.window);
      }
      clickCount = 0;
    }, 300);
  });
});

// ---- 开始菜单项打开窗口 ----
document.querySelectorAll('.start-menu-item[data-window]').forEach(item => {
  item.addEventListener('click', () => {
    openWindow(item.dataset.window);
    startMenu.classList.add('hidden');
    startBtn.classList.remove('active');
  });
});

// ---- 窗口内容定义 ----
const windowContents = {
  blog: { title: '📝 我的博客', render: renderBlog },
  about: { title: '👤 关于我', render: renderAbout },
  works: { title: '🎨 作品集', render: renderWorks },
  guestbook: { title: '💬 留言板', render: renderGuestbook },
  music: { title: '🎵 音乐盒', render: renderMusic },
  links: { title: '🔗 友情链接', render: renderLinks },
};

// ---- 打开窗口 ----
function openWindow(id) {
  if (windows[id]) {
    focusWindow(id);
    return;
  }

  const config = windowContents[id];
  if (!config) return;

  const win = document.createElement('div');
  win.className = 'window';
  win.id = `win-${id}`;
  win.style.zIndex = ++zIndexCounter;

  // 随机位置（避免完全重叠）
  const offset = Object.keys(windows).length * 30;
  win.style.left = `${100 + offset}px`;
  win.style.top = `${60 + offset}px`;
  win.style.width = '600px';
  win.style.height = '420px';

  win.innerHTML = `
    <div class="window-titlebar">
      <span class="window-title">${config.title}</span>
      <div class="window-controls">
        <button class="window-btn" onclick="minimizeWindow('${id}')">_</button>
        <button class="window-btn" onclick="toggleMaximize('${id}')">□</button>
        <button class="window-btn close" onclick="closeWindow('${id}')">✕</button>
      </div>
    </div>
    <div class="window-body"></div>
  `;

  document.getElementById('windows-container').appendChild(win);
  const body = win.querySelector('.window-body');
  body.innerHTML = config.render();

  windows[id] = { element: win, minimized: false, maximized: false, prevRect: null };
  activeWindow = id;

  // 拖拽
  makeDraggable(win, id);
  // 点击聚焦
  win.addEventListener('mousedown', () => focusWindow(id));

  // 添加到任务栏
  addTaskbarItem(id, config.title);
}

// ---- 关闭窗口 ----
function closeWindow(id) {
  if (!windows[id]) return;
  windows[id].element.remove();
  delete windows[id];
  const taskItem = document.querySelector(`.taskbar-item[data-window="${id}"]`);
  if (taskItem) taskItem.remove();
  if (activeWindow === id) activeWindow = null;
}

// ---- 最小化 ----
function minimizeWindow(id) {
  if (!windows[id]) return;
  windows[id].element.style.display = 'none';
  windows[id].minimized = true;
  const taskItem = document.querySelector(`.taskbar-item[data-window="${id}"]`);
  if (taskItem) taskItem.classList.remove('active');
}

// ---- 最大化/还原 ----
function toggleMaximize(id) {
  const w = windows[id];
  if (!w) return;
  if (w.maximized) {
    const r = w.prevRect;
    w.element.style.left = r.left;
    w.element.style.top = r.top;
    w.element.style.width = r.width;
    w.element.style.height = r.height;
    w.maximized = false;
  } else {
    w.prevRect = {
      left: w.element.style.left,
      top: w.element.style.top,
      width: w.element.style.width,
      height: w.element.style.height,
    };
    w.element.style.left = '0px';
    w.element.style.top = '0px';
    w.element.style.width = '100%';
    w.element.style.height = 'calc(100% - 40px)';
    w.maximized = true;
  }
}

// ---- 聚焦窗口 ----
function focusWindow(id) {
  if (!windows[id]) return;
  if (windows[id].minimized) {
    windows[id].element.style.display = 'flex';
    windows[id].minimized = false;
  }
  windows[id].element.style.zIndex = ++zIndexCounter;
  activeWindow = id;
  document.querySelectorAll('.taskbar-item').forEach(item => {
    item.classList.toggle('active', item.dataset.window === id);
  });
}

// ---- 拖拽实现 ----
function makeDraggable(win, id) {
  const titlebar = win.querySelector('.window-titlebar');
  let isDragging = false;
  let startX, startY, startLeft, startTop;

  titlebar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('window-btn')) return;
    if (windows[id]?.maximized) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(win.style.left);
    startTop = parseInt(win.style.top);
    focusWindow(id);
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    let newLeft = startLeft + e.clientX - startX;
    let newTop = startTop + e.clientY - startY;
    // 边界限制
    newLeft = Math.max(0, Math.min(window.innerWidth - 100, newLeft));
    newTop = Math.max(0, Math.min(window.innerHeight - 80, newTop));
    win.style.left = `${newLeft}px`;
    win.style.top = `${newTop}px`;
  });

  document.addEventListener('mouseup', () => { isDragging = false; });
}

// ---- 任务栏项 ----
function addTaskbarItem(id, title) {
  const item = document.createElement('div');
  item.className = 'taskbar-item active';
  item.dataset.window = id;
  item.innerHTML = `<span>${title}</span>`;
  item.addEventListener('click', () => {
    if (windows[id]?.minimized) {
      focusWindow(id);
    } else if (activeWindow === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  });
  document.getElementById('taskbar-items').appendChild(item);
}

// ---- 桌面宠物 ----
const pet = document.getElementById('pet');
const petBubble = document.getElementById('pet-bubble');
const petMessages = [
  '欢迎来到毛地张的复古桌面~',
  '双击图标可以打开窗口哦~',
  '点击开始菜单有更多内容~',
  '今天也要元气满满呢~ (≧▽≦)',
  'Y2K 永远滴神！',
  '这个桌面是不是很有复古感呢~',
];

let petClickCount = 0;
pet.addEventListener('click', () => {
  petClickCount++;
  showPetBubble(petMessages[petClickCount % petMessages.length]);
});

function showPetBubble(msg) {
  petBubble.textContent = msg;
  petBubble.classList.remove('hidden');
  setTimeout(() => petBubble.classList.add('hidden'), 3000);
}

// 定时显示宠物消息
setInterval(() => {
  if (Math.random() > 0.6) {
    showPetBubble(petMessages[Math.floor(Math.random() * petMessages.length)]);
  }
}, 10000);

// ============================================
// 窗口内容渲染函数
// ============================================

// ---- 博客 ----
function renderBlog() {
  const posts = [
    {
      title: '欢迎来到我的复古桌面博客！',
      date: '2026-10-07',
      tags: ['公告', '复古'],
      excerpt: '这是一个融合了 Windows XP 桌面交互、Y2K 霓虹美学和二次元元素的个人博客。你可以像操作一台复古 PC 一样浏览我的文章、作品和信息。双击桌面图标开始探索吧！',
    },
    {
      title: 'Y2K 美学：千禧年的赛博浪漫',
      date: '2026-10-05',
      tags: ['设计', 'Y2K'],
      excerpt: 'Y2K 美学是 2000 年前后的一种设计风格，以霓虹色、金属质感、像素艺术和未来主义为特征。本文将带你回顾这场视觉革命，并探讨它在现代设计中的复兴...',
    },
    {
      title: '用纯前端实现 Windows XP 桌面体验',
      date: '2026-10-03',
      tags: ['前端', 'CSS', 'JavaScript'],
      excerpt: '无需任何框架，仅用 HTML + CSS + JavaScript 就能实现一个完整的 XP 风格桌面系统。本文分享了窗口管理、拖拽交互、任务栏和开始菜单的实现思路...',
    },
    {
      title: 'CRT 扫描线效果的前端实现',
      date: '2026-09-28',
      tags: ['CSS', '复古'],
      excerpt: 'CRT 显示器的扫描线效果是复古风格的重要元素。通过 CSS 的 repeating-linear-gradient 和 radial-gradient，只需几行代码就能让现代屏幕焕发老式显示器的魅力...',
    },
    {
      title: '从 MoeKernel_Desktop 学到的全栈架构',
      date: '2026-09-25',
      tags: ['架构', '全栈'],
      excerpt: 'MoeKernel_Desktop 项目展示了微内核 + 插件层 + CMS 三层架构的优雅实践。本文分析其设计思路，并讨论如何在自己的项目中借鉴这种模式...',
    },
  ];

  return posts.map(p => `
    <div class="blog-post">
      <div class="blog-post-title">${p.title}</div>
      <div class="blog-post-date">📅 ${p.date}</div>
      <div class="blog-post-tags">
        ${p.tags.map(t => `<span class="blog-tag">${t}</span>`).join('')}
      </div>
      <div class="blog-post-excerpt">${p.excerpt}</div>
      <a class="read-more" onclick="alert('文章详情功能将在后续版本中开放~')">阅读全文 →</a>
    </div>
  `).join('');
}

// ---- 关于我 ----
function renderAbout() {
  return `
    <div class="about-card">
      <div class="about-avatar">🐱</div>
      <div class="about-name">毛地张</div>
      <div style="font-size:13px;color:#777;">Retro Desktop Enthusiast · Y2K Lover</div>
    </div>
    <div class="about-bio">
      <p>你好！我是毛地张，一个热爱复古美学和二次元文化的开发者。</p>
      <p style="margin-top:10px;">这个博客是我对 Windows XP 桌面、Y2K 霓虹美学和二次元元素的融合实验。希望能带给你一种"回到 2000 年"的赛博浪漫感。</p>
      <p style="margin-top:10px;">参考了以下优秀的开源项目：</p>
      <ul style="margin-top:6px;padding-left:20px;">
        <li>Yuimi-chaya.github.io — Astro 多主题二次元博客</li>
        <li>pcmoe.net — 复古 PC 萌系风格</li>
        <li>MoeKernel_Desktop — Windows XP 风格桌面系统</li>
      </ul>
      <div class="skill-tags">
        <span class="skill-tag">HTML/CSS</span>
        <span class="skill-tag">JavaScript</span>
        <span class="skill-tag">复古设计</span>
        <span class="skill-tag">Y2K 美学</span>
        <span class="skill-tag">二次元</span>
        <span class="skill-tag">GitHub Pages</span>
      </div>
    </div>
  `;
}

// ---- 作品集 ----
function renderWorks() {
  const works = [
    { icon: '🖥️', title: '复古桌面博客', desc: '本站本体 · XP+Y2K+二次元' },
    { icon: '🎮', title: '像素小游戏', desc: '用 Canvas 实现的复古小游戏' },
    { icon: '🎵', title: 'Winamp 风格播放器', desc: '复古音乐播放器 UI' },
    { icon: '📱', title: 'PDA 模拟器', desc: 'Y2K 风格的个人数字助理' },
    { icon: '🌈', title: '霓虹主题生成器', desc: '一键生成 Y2K 配色方案' },
    { icon: '📚', title: '复古阅读器', desc: 'CRT 效果的 Markdown 阅读器' },
  ];

  return `
    <div class="works-grid">
      ${works.map(w => `
        <div class="work-card" onclick="alert('作品详情即将上线~')">
          <div class="work-thumb">${w.icon}</div>
          <div class="work-info">
            <div class="work-title">${w.title}</div>
            <div class="work-desc">${w.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ---- 留言板 ----
function renderGuestbook() {
  const saved = JSON.parse(localStorage.getItem('guestbook') || '[]');
  const defaultEntries = [
    { name: '路过的旅行者', time: '2026-10-06 22:30', message: '这个桌面好有复古感！瞬间回到小时候了~' },
    { name: 'Y2K爱好者', time: '2026-10-05 15:20', message: '霓虹配色太赞了，Y2K 永远滴神！' },
  ];
  const entries = [...saved, ...defaultEntries];

  return `
    <div class="guestbook-form">
      <input type="text" id="gb-name" placeholder="你的名字（可选，默认"匿名旅人"）">
      <textarea id="gb-message" placeholder="说点什么吧~"></textarea>
      <button onclick="submitGuestbook()">发送留言</button>
    </div>
    <div id="guestbook-list">
      ${entries.map(e => `
        <div class="guestbook-entry">
          <div class="guestbook-name">${e.name}</div>
          <div class="guestbook-time">🕒 ${e.time}</div>
          <div class="guestbook-message">${e.message}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function submitGuestbook() {
  const nameEl = document.getElementById('gb-name');
  const msgEl = document.getElementById('gb-message');
  const name = nameEl.value.trim() || '匿名旅人';
  const message = msgEl.value.trim();
  if (!message) { alert('请输入留言内容~'); return; }

  const now = new Date();
  const time = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const entry = { name, time, message };
  const saved = JSON.parse(localStorage.getItem('guestbook') || '[]');
  saved.unshift(entry);
  localStorage.setItem('guestbook', JSON.stringify(saved));

  // 刷新留言板
  const win = windows['guestbook'];
  if (win) {
    win.element.querySelector('.window-body').innerHTML = renderGuestbook();
  }
}

// ---- 音乐盒 ----
function renderMusic() {
  const tracks = [
    { title: 'Y2K Anthem', artist: 'Retro Wave' },
    { title: '桜花夜 (Sakura Night)', artist: 'Anime OST' },
    { title: 'Windows XP 启动音', artist: 'System Sound' },
    { title: 'Neon Dreams', artist: 'Synthwave' },
    { title: '猫娘乐园', artist: 'Moe Moe~' },
    { title: 'Pixel Sunset', artist: 'Chiptune' },
  ];

  return `
    <div class="music-player">
      <div class="music-title">🎵 复古音乐盒</div>
      <ul class="music-list">
        ${tracks.map((t, i) => `
          <li class="music-item" onclick="playMusic(${i})" data-track="${i}">
            <span>🎶</span>
            <span>${t.title}</span>
            <span style="margin-left:auto;color:#999;font-size:12px;">${t.artist}</span>
          </li>
        `).join('')}
      </ul>
      <div id="now-playing" style="margin-top:16px;padding:12px;background:linear-gradient(135deg,var(--sakura-light),var(--moe-mint));border-radius:6px;font-size:13px;">
        点击歌曲开始播放~ (演示模式)
      </div>
    </div>
  `;
}

function playMusic(index) {
  const tracks = [
    'Y2K Anthem - Retro Wave',
    '桜花夜 - Anime OST',
    'Windows XP 启动音 - System Sound',
    'Neon Dreams - Synthwave',
    '猫娘乐园 - Moe Moe~',
    'Pixel Sunset - Chiptune',
  ];
  document.querySelectorAll('.music-item').forEach((el, i) => {
    el.classList.toggle('playing', i === index);
  });
  document.getElementById('now-playing').innerHTML = `▶ 正在播放: <b>${tracks[index]}</b><br><span style="font-size:11px;color:#777;">(纯前端演示，无实际音频)</span>`;
}

// ---- 友情链接 ----
function renderLinks() {
  const links = [
    { name: 'Yuimi Lab', desc: '二次元叙事 + 技术记录', icon: '🌸', url: 'https://yuimi-chaya.github.io' },
    { name: 'pcmoe.net', desc: '复古 PC 萌系', icon: '🖥️', url: 'https://www.pcmoe.net/' },
    { name: 'MoeKernel_Desktop', desc: 'XP 风格桌面系统', icon: '💻', url: 'https://github.com/NNNullptr/MoeKernel_Desktop' },
    { name: 'GitHub', desc: '我的 GitHub 主页', icon: '🐙', url: 'https://github.com/520maodizhang' },
  ];

  return `
    <div class="links-grid">
      ${links.map(l => `
        <a class="link-card" href="${l.url}" target="_blank" rel="noopener">
          <div class="link-avatar">${l.icon}</div>
          <div class="link-info">
            <div class="link-name">${l.name}</div>
            <div class="link-desc">${l.desc}</div>
          </div>
        </a>
      `).join('')}
    </div>
  `;
}
