/* ================================================
   复古桌面博客 — 应用逻辑
   基于 MoeKernel 的窗口管理 + Yuimi/Fuyukawa 内容风格
   ================================================ */

var windows = {};
var zCounter = 100;
var activeWin = null;

// ---- 桌面图标定义 ----
var ICONS = [
  { id: 'blog',      label: '我的博客',  icon: '📝', x: 20,  y: 20 },
  { id: 'about',     label: '关于我',    icon: '👤', x: 20,  y: 100 },
  { id: 'works',     label: '作品集',    icon: '🎨', x: 20,  y: 180 },
  { id: 'guestbook', label: '留言板',    icon: '💬', x: 20,  y: 260 },
  { id: 'music',     label: '音乐盒',    icon: '🎵', x: 20,  y: 340 },
  { id: 'links',     label: '友情链接',  icon: '🔗', x: 20,  y: 420 },
];

var APPS = {
  blog:      { title: '我的博客',  icon: '📝', w: 620, h: 440, render: renderBlog },
  about:     { title: '关于我',    icon: '👤', w: 520, h: 460, render: renderAbout },
  works:     { title: '作品集',    icon: '🎨', w: 580, h: 420, render: renderWorks },
  guestbook: { title: '留言板',    icon: '💬', w: 520, h: 440, render: renderGuestbook },
  music:     { title: '音乐盒',    icon: '🎵', w: 460, h: 400, render: renderMusic },
  links:     { title: '友情链接',  icon: '🔗', w: 520, h: 360, render: renderLinks },
};

// ---- Boot 动画 ----
window.addEventListener('load', function () {
  setTimeout(function () {
    var boot = document.getElementById('boot');
    boot.style.opacity = '0';
    setTimeout(function () {
      boot.classList.add('hidden');
      document.getElementById('desktop').classList.remove('hidden');
      initSakura();
      showPetBubble('欢迎来到毛地张的复古桌面~');
    }, 800);
  }, 2800);
});

// ---- 时钟（XP 格式 H:MM AM/PM） ----
function formatTime(d) {
  var h = d.getHours();
  var m = String(d.getMinutes()).padStart(2, '0');
  var ampm = h >= 12 ? 'PM' : 'AM';
  var hour = h % 12 || 12;
  return hour + ':' + m + ' ' + ampm;
}
function updateClock() {
  document.getElementById('clock').textContent = formatTime(new Date());
}
setInterval(updateClock, 1000);
updateClock();

// ---- 樱花雨 ----
function initSakura() {
  var container = document.getElementById('sakura');
  for (var i = 0; i < 15; i++) {
    var s = document.createElement('div');
    s.className = 'sakura';
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDuration = (8 + Math.random() * 6) + 's';
    s.style.animationDelay = Math.random() * 8 + 's';
    s.style.opacity = 0.3 + Math.random() * 0.3;
    container.appendChild(s);
  }
}

// ---- 渲染桌面图标 ----
(function renderIcons() {
  var area = document.getElementById('icon-area');
  ICONS.forEach(function (ic) {
    var el = document.createElement('div');
    el.className = 'desktop-icon';
    el.dataset.id = ic.id;
    el.style.left = ic.x + 'px';
    el.style.top = ic.y + 'px';
    el.innerHTML =
      '<div class="icon-img">' + ic.icon + '</div>' +
      '<span class="icon-label">' + ic.label + '</span>';
    area.appendChild(el);

    var lastClick = 0;
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      document.querySelectorAll('.desktop-icon').forEach(function (i) { i.classList.remove('selected'); });
      el.classList.add('selected');
      var now = Date.now();
      if (now - lastClick < 350) {
        openWindow(ic.id);
        lastClick = 0;
      } else {
        lastClick = now;
      }
    });
  });
})();

// ---- 渲染开始菜单程序列表 ----
(function renderStartPrograms() {
  var container = document.getElementById('start-programs');
  ICONS.forEach(function (ic) {
    var el = document.createElement('div');
    el.className = 'start-program';
    el.dataset.window = ic.id;
    el.innerHTML = '<span class="start-program-icon">' + ic.icon + '</span><span>' + ic.label + '</span>';
    container.appendChild(el);
  });
})();

// ---- 开始菜单 ----
var startBtn = document.getElementById('start-btn');
var startMenu = document.getElementById('start-menu');
startBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  startMenu.classList.toggle('hidden');
  startBtn.classList.toggle('active');
});
document.addEventListener('click', function () {
  startMenu.classList.add('hidden');
  startBtn.classList.remove('active');
  document.querySelectorAll('.desktop-icon').forEach(function (i) { i.classList.remove('selected'); });
});
startMenu.addEventListener('click', function (e) { e.stopPropagation(); });

document.querySelectorAll('[data-window]').forEach(function (el) {
  el.addEventListener('click', function () {
    openWindow(el.dataset.window);
    startMenu.classList.add('hidden');
    startBtn.classList.remove('active');
  });
});

// ---- 关机 ----
document.getElementById('shutdown-btn').addEventListener('click', function () {
  document.getElementById('desktop').classList.add('hidden');
  document.getElementById('shutdown').classList.remove('hidden');
});

// ---- 打开窗口 ----
function openWindow(id) {
  if (windows[id]) { focusWindow(id); return; }
  var app = APPS[id];
  if (!app) return;

  var win = document.createElement('div');
  win.className = 'window';
  win.style.zIndex = ++zCounter;
  var offset = Object.keys(windows).length * 22;
  win.style.left = (80 + offset) + 'px';
  win.style.top = (40 + offset) + 'px';
  win.style.width = app.w + 'px';
  win.style.height = app.h + 'px';

  win.innerHTML =
    '<div class="window-titlebar">' +
      '<span class="window-title">' + app.icon + ' ' + app.title + '</span>' +
      '<div class="window-btns">' +
        '<button class="win-btn min" title="最小化">_</button>' +
        '<button class="win-btn max" title="最大化">□</button>' +
        '<button class="win-btn close" title="关闭">✕</button>' +
      '</div>' +
    '</div>' +
    '<div class="window-body"><div class="content">' + app.render() + '</div></div>';

  document.getElementById('windows').appendChild(win);
  windows[id] = { el: win, minimized: false, maximized: false, prev: null };
  activeWin = id;

  // 按钮
  win.querySelector('.close').addEventListener('click', function (e) { e.stopPropagation(); closeWindow(id); });
  win.querySelector('.min').addEventListener('click', function (e) { e.stopPropagation(); minimizeWindow(id); });
  win.querySelector('.max').addEventListener('click', function (e) { e.stopPropagation(); toggleMax(id); });

  // 拖拽
  makeDraggable(win, id);
  win.addEventListener('mousedown', function () { focusWindow(id); });

  // 任务栏
  addTaskbarItem(id, app);
}

function closeWindow(id) {
  if (!windows[id]) return;
  windows[id].el.remove();
  delete windows[id];
  var tb = document.querySelector('.taskbar-win[data-id="' + id + '"]');
  if (tb) tb.remove();
}
function minimizeWindow(id) {
  if (!windows[id]) return;
  windows[id].el.style.display = 'none';
  windows[id].minimized = true;
  var tb = document.querySelector('.taskbar-win[data-id="' + id + '"]');
  if (tb) tb.classList.remove('active');
}
function toggleMax(id) {
  var w = windows[id];
  if (!w) return;
  if (w.maximized) {
    var p = w.prev;
    w.el.style.left = p.left; w.el.style.top = p.top;
    w.el.style.width = p.width; w.el.style.height = p.height;
    w.maximized = false;
  } else {
    w.prev = { left: w.el.style.left, top: w.el.style.top, width: w.el.style.width, height: w.el.style.height };
    w.el.style.left = '0px'; w.el.style.top = '0px';
    w.el.style.width = '100%'; w.el.style.height = 'calc(100% - 30px)';
    w.maximized = true;
  }
}
function focusWindow(id) {
  var w = windows[id];
  if (!w) return;
  if (w.minimized) { w.el.style.display = 'flex'; w.minimized = false; }
  w.el.style.zIndex = ++zCounter;
  activeWin = id;
  document.querySelectorAll('.taskbar-win').forEach(function (tb) {
    tb.classList.toggle('active', tb.dataset.id === id);
  });
}

function makeDraggable(win, id) {
  var titlebar = win.querySelector('.window-titlebar');
  var dragging = false, sx, sy, sl, st;
  titlebar.addEventListener('mousedown', function (e) {
    if (e.target.classList.contains('win-btn')) return;
    if (windows[id] && windows[id].maximized) return;
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    sl = parseInt(win.style.left); st = parseInt(win.style.top);
    focusWindow(id);
    e.preventDefault();
  });
  document.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    var nl = Math.max(0, Math.min(window.innerWidth - 80, sl + e.clientX - sx));
    var nt = Math.max(0, Math.min(window.innerHeight - 60, st + e.clientY - sy));
    win.style.left = nl + 'px'; win.style.top = nt + 'px';
  });
  document.addEventListener('mouseup', function () { dragging = false; });
}

function addTaskbarItem(id, app) {
  var btn = document.createElement('button');
  btn.className = 'taskbar-win active';
  btn.dataset.id = id;
  btn.innerHTML = '<span>' + app.icon + '</span><span>' + app.title + '</span>';
  btn.addEventListener('click', function () {
    if (windows[id] && windows[id].minimized) { focusWindow(id); }
    else if (activeWin === id) { minimizeWindow(id); }
    else { focusWindow(id); }
  });
  document.getElementById('taskbar-windows').appendChild(btn);
}

// ---- 桌宠 ----
var petMessages = [
  '欢迎来到毛地张的复古桌面~',
  '双击图标打开窗口哦~',
  '今天也要元气满满呢~',
  '这个桌面是不是很有复古感~',
  'Y2K 永远滴神！',
];
var petClickCount = 0;
document.getElementById('pet').addEventListener('click', function () {
  petClickCount++;
  showPetBubble(petMessages[petClickCount % petMessages.length]);
});
function showPetBubble(msg) {
  var bubble = document.getElementById('pet-bubble');
  bubble.textContent = msg;
  bubble.classList.remove('hidden');
  setTimeout(function () { bubble.classList.add('hidden'); }, 3000);
}
setInterval(function () {
  if (Math.random() > 0.6) {
    showPetBubble(petMessages[Math.floor(Math.random() * petMessages.length)]);
  }
}, 12000);

// ================================================
// 窗口内容渲染 — Fuyukawa 手账风格
// ================================================

function renderBlog() {
  var posts = [
    { title: '欢迎来到我的复古桌面博客！', date: '2026-10-07', tags: ['公告', '复古'], excerpt: '融合 Windows XP 桌面交互、Y2K 霓虹美学和二次元手账元素的个人博客。像操作一台复古 PC 一样浏览文章吧！' },
    { title: 'Y2K 美学：千禧年的赛博浪漫', date: '2026-10-05', tags: ['设计', 'Y2K'], excerpt: 'Y2K 美学以霓虹色、金属质感和未来主义为特征。本文带你回顾这场视觉革命，探讨它在现代设计中的复兴...' },
    { title: '用纯前端实现 Windows XP 桌面体验', date: '2026-10-03', tags: ['前端', 'CSS'], excerpt: '无需框架，仅用 HTML + CSS + JS 实现完整的 XP 风格桌面。分享窗口管理、拖拽交互、任务栏的实现思路...' },
    { title: 'CRT 扫描线效果的前端实现', date: '2026-09-28', tags: ['CSS', '复古'], excerpt: '通过 CSS 的 repeating-linear-gradient，只需几行代码就能让现代屏幕焕发老式 CRT 显示器的魅力...' },
    { title: '从 MoeKernel 学到的 XP 桌面架构', date: '2026-09-25', tags: ['架构', '全栈'], excerpt: 'MoeKernel_Desktop 展示了微内核 + 插件层 + CMS 三层架构的优雅实践。本文分析其设计思路...' },
  ];
  return '<h1>📝 我的博客</h1>' + posts.map(function (p) {
    return '<div class="post-card">' +
      '<div class="post-title">' + p.title + '</div>' +
      '<div class="post-date">📅 ' + p.date + '</div>' +
      '<div class="post-tags">' + p.tags.map(function (t) { return '<span class="post-tag">' + t + '</span>'; }).join('') + '</div>' +
      '<div class="post-excerpt">' + p.excerpt + '</div>' +
    '</div>';
  }).join('');
}

function renderAbout() {
  return '<div class="about-section">' +
    '<div class="about-avatar">🐱</div>' +
    '<div class="about-name">毛地张</div>' +
    '<div class="about-sub">Retro Desktop Enthusiast · Y2K Lover</div>' +
  '</div>' +
  '<div class="about-bio">' +
    '<p>你好！我是毛地张，一个热爱复古美学和二次元文化的开发者。</p>' +
    '<p>这个博客是对 Windows XP 桌面、Y2K 霓虹美学和二次元手账元素的融合实验。参考了以下优秀的开源项目：</p>' +
    '<ul>' +
      '<li>Yuimi-chaya.github.io — Astro 多主题二次元博客</li>' +
      '<li>pcmoe.net — 复古 PC 萌系风格</li>' +
      '<li>MoeKernel_Desktop — Windows XP 风格桌面系统</li>' +
    '</ul>' +
    '<div class="skill-tags">' +
      '<span class="skill-tag">HTML/CSS</span>' +
      '<span class="skill-tag">JavaScript</span>' +
      '<span class="skill-tag">复古设计</span>' +
      '<span class="skill-tag">Y2K 美学</span>' +
      '<span class="skill-tag">二次元</span>' +
    '</div>' +
  '</div>';
}

function renderWorks() {
  var works = [
    { icon: '🖥️', title: '复古桌面博客', desc: '本站 · XP+Y2K+二次元' },
    { icon: '🎮', title: '像素小游戏', desc: 'Canvas 复古小游戏' },
    { icon: '🎵', title: 'Winamp 播放器', desc: '复古音乐播放器 UI' },
    { icon: '🌈', title: '霓虹主题生成器', desc: 'Y2K 配色方案生成' },
    { icon: '📚', title: '复古阅读器', desc: 'CRT 效果阅读器' },
    { icon: '📱', title: 'PDA 模拟器', desc: 'Y2K 风格 PDA' },
  ];
  return '<h1>🎨 作品集</h1><div class="works-grid">' + works.map(function (w) {
    return '<div class="work-card">' +
      '<div class="work-thumb">' + w.icon + '</div>' +
      '<div class="work-info"><div class="work-title">' + w.title + '</div>' +
      '<div class="work-desc">' + w.desc + '</div></div>' +
    '</div>';
  }).join('') + '</div>';
}

function renderGuestbook() {
  var saved = JSON.parse(localStorage.getItem('guestbook') || '[]');
  var defaults = [
    { name: '路过的旅行者', time: '2026-10-06 22:30', message: '这个桌面好有复古感！瞬间回到小时候了~' },
    { name: 'Y2K爱好者', time: '2026-10-05 15:20', message: '霓虹配色太赞了，Y2K 永远滴神！' },
  ];
  var entries = saved.concat(defaults);
  return '<h1>💬 留言板</h1>' +
    '<div class="gb-form">' +
      '<input type="text" id="gb-name" placeholder="你的名字（默认"匿名旅人"）">' +
      '<textarea id="gb-msg" placeholder="说点什么吧~"></textarea>' +
      '<button onclick="submitGuestbook()">发送留言</button>' +
    '</div>' +
    entries.map(function (e) {
      return '<div class="gb-entry">' +
        '<div class="gb-name">' + e.name + '</div>' +
        '<div class="gb-time">🕒 ' + e.time + '</div>' +
        '<div class="gb-msg">' + e.message + '</div>' +
      '</div>';
    }).join('');
}

function submitGuestbook() {
  var name = (document.getElementById('gb-name').value || '').trim() || '匿名旅人';
  var msg = (document.getElementById('gb-msg').value || '').trim();
  if (!msg) { alert('请输入留言内容~'); return; }
  var now = new Date();
  var time = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  var saved = JSON.parse(localStorage.getItem('guestbook') || '[]');
  saved.unshift({ name: name, time: time, message: msg });
  localStorage.setItem('guestbook', JSON.stringify(saved));
  var w = windows['guestbook'];
  if (w) { w.el.querySelector('.content').innerHTML = renderGuestbook(); }
}

function renderMusic() {
  var tracks = [
    { title: 'Y2K Anthem', artist: 'Retro Wave' },
    { title: '桜花夜', artist: 'Anime OST' },
    { title: 'XP 启动音', artist: 'System' },
    { title: 'Neon Dreams', artist: 'Synthwave' },
    { title: '猫娘乐园', artist: 'Moe Moe' },
    { title: 'Pixel Sunset', artist: 'Chiptune' },
  ];
  return '<h1>🎵 音乐盒</h1>' +
    '<ul class="music-list">' + tracks.map(function (t, i) {
      return '<li class="music-item" onclick="playMusic(' + i + ')"><span>🎶</span><span>' + t.title + '</span><span style="margin-left:auto;color:#657491;font-size:11px;">' + t.artist + '</span></li>';
    }).join('') + '</ul>' +
    '<div class="now-playing" id="now-playing">点击歌曲开始播放~（演示模式）</div>';
}

function playMusic(i) {
  var tracks = ['Y2K Anthem - Retro Wave', '桜花夜 - Anime OST', 'XP 启动音 - System', 'Neon Dreams - Synthwave', '猫娘乐园 - Moe Moe', 'Pixel Sunset - Chiptune'];
  document.querySelectorAll('.music-item').forEach(function (el, j) { el.classList.toggle('playing', j === i); });
  document.getElementById('now-playing').innerHTML = '▶ 正在播放: <b>' + tracks[i] + '</b><br><span style="font-size:11px;color:#657491;">（纯前端演示，无实际音频）</span>';
}

function renderLinks() {
  var links = [
    { name: 'Yuimi Lab', desc: '二次元叙事+技术记录', icon: '🌸', url: 'https://yuimi-chaya.github.io' },
    { name: 'pcmoe.net', desc: '复古PC萌系', icon: '🖥️', url: 'https://www.pcmoe.net/' },
    { name: 'MoeKernel', desc: 'XP风格桌面系统', icon: '💻', url: 'https://github.com/NNNullptr/MoeKernel_Desktop' },
    { name: 'GitHub', desc: '我的GitHub主页', icon: '🐙', url: 'https://github.com/520maodizhang' },
  ];
  return '<h1>🔗 友情链接</h1><div class="links-grid">' + links.map(function (l) {
    return '<a class="link-card" href="' + l.url + '" target="_blank" rel="noopener">' +
      '<div class="link-icon">' + l.icon + '</div>' +
      '<div><div class="link-name">' + l.name + '</div><div class="link-desc">' + l.desc + '</div></div>' +
    '</a>';
  }).join('') + '</div>';
}
