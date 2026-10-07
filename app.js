/* ================================================
   三融合：MoeKernel XP + Fuyukawa 手账 + pcmoe 萌系
   ================================================ */

var windows = {};
var zCounter = 100;
var activeWin = null;

// 桌面图标 — MoeKernel 真实 PNG
var ICONS = [
  { id: 'blog',      label: 'My Blog',       src: 'assets/icons/Blog.png',         x: 20, y: 20 },
  { id: 'about',     label: 'About Me',      src: 'assets/icons/About.png',        x: 20, y: 100 },
  { id: 'portfolio', label: 'My Portfolio',  src: 'assets/icons/Portfolio.png',    x: 20, y: 180 },
  { id: 'chatbox',   label: 'ChatBox',       src: 'assets/icons/MSN.png',          x: 20, y: 260 },
  { id: 'winamp',    label: 'Winamp',        src: 'assets/icons/Winamp.png',       x: 20, y: 340 },
  { id: 'links',     label: 'Contact Me',    src: 'assets/icons/Contact.png',      x: 20, y: 420 },
  { id: 'recycle',   label: 'Recycle Bin',   src: 'assets/icons/Recycle.png',      x: 20, y: 500 },
  { id: 'admin',     label: 'Admin',         src: 'assets/icons/My Computer.png',  x: 20, y: 580 },
];

var APPS = {
  blog:      { title: 'My Blog',          icon: 'assets/icons/Blog.png',      w: 640, h: 460, render: renderBlog },
  about:     { title: 'About Me',         icon: 'assets/icons/About.png',     w: 520, h: 480, render: renderAbout },
  portfolio: { title: 'My Portfolio',     icon: 'assets/icons/Portfolio.png', w: 780, h: 560, render: renderPortfolio },
  chatbox:   { title: 'ChatBox - 留言板',  icon: 'assets/icons/MSN.png',       w: 520, h: 540, render: renderChatbox },
  winamp:    { title: 'Winamp',           icon: 'assets/icons/Winamp.png',    w: 350, h: 230, render: renderWinamp },
  links:     { title: 'Contact Me',       icon: 'assets/icons/Contact.png',   w: 480, h: 400, render: renderLinks },
  admin:     { title: 'Admin',           icon: 'assets/icons/My Computer.png', w: 800, h: 600, render: function () { return '<div style="height:100%;"><iframe src="admin.html" style="width:100%;height:100%;border:none;"></iframe></div>'; } },
};

// 桌宠 — MoeKernel 真实 GIF/PNG
var PETS = [
  { id: 'pet1', label: '桌宠1', iconSrc: 'assets/pets/avatars/1.png', petSrc: 'assets/pets/sprites/1.gif', size: 150 },
  { id: 'pet2', label: '桌宠2', iconSrc: 'assets/pets/avatars/2.png', petSrc: 'assets/pets/sprites/5.png', size: 120 },
];
var activePets = {};

// pcmoe 萌系彩色配色
var PCMOE_COLORS = ['#d9534f', '#eba000', '#d2d219', '#41c82d', '#23be9b', '#428bca', '#9b41cd'];

// ---- Boot → Login → Desktop ----
window.addEventListener('load', function () {
  setTimeout(function () {
    document.getElementById('boot-stage').classList.add('hidden');
    document.getElementById('login-stage').classList.remove('hidden');
  }, 3000);
});

document.getElementById('login-user-card').addEventListener('click', function () {
  var ls = document.getElementById('login-stage');
  ls.style.transform = 'scale(0.94)'; ls.style.opacity = '0';
  ls.style.transition = 'transform 700ms ease-in, opacity 700ms ease-in'; ls.style.pointerEvents = 'none';
  setTimeout(function () { ls.classList.add('hidden'); document.getElementById('desktop').classList.remove('hidden'); initSakura(); }, 700);
});

// ---- 时钟 ----
function formatTime(d) { var h = d.getHours(); var m = String(d.getMinutes()).padStart(2,'0'); var ampm = h >= 12 ? 'PM' : 'AM'; return (h % 12 || 12) + ':' + m + ' ' + ampm; }
function updateClock() { document.getElementById('clock').textContent = formatTime(new Date()); }
setInterval(updateClock, 1000); updateClock();

// ---- Fuyukawa 樱花雨 ----
function initSakura() {
  var c = document.getElementById('sakura');
  for (var i = 0; i < 15; i++) {
    var s = document.createElement('div'); s.className = 'sakura';
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDuration = (8 + Math.random() * 6) + 's';
    s.style.animationDelay = Math.random() * 8 + 's';
    s.style.opacity = 0.3 + Math.random() * 0.2;
    c.appendChild(s);
  }
}

// ---- 桌面图标 ----
(function () {
  var area = document.getElementById('icon-area');
  ICONS.forEach(function (ic) {
    var el = document.createElement('div'); el.className = 'desktop-icon'; el.dataset.id = ic.id;
    el.style.left = ic.x + 'px'; el.style.top = ic.y + 'px';
    el.innerHTML = '<img class="icon-img" src="' + ic.src + '" alt="' + ic.label + '"><span class="icon-label">' + ic.label + '</span>';
    area.appendChild(el);
    var lastClick = 0;
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      document.querySelectorAll('.desktop-icon').forEach(function (i) { i.classList.remove('selected'); });
      el.classList.add('selected');
      var now = Date.now();
      if (now - lastClick < 350) { openWindow(ic.id); lastClick = 0; } else { lastClick = now; }
    });
  });
})();

// ---- 开始菜单 ----
(function () {
  var p = document.getElementById('start-programs');
  ICONS.filter(function (i) { return i.id !== 'recycle'; }).forEach(function (ic) {
    var el = document.createElement('div'); el.className = 'start-program'; el.dataset.window = ic.id;
    el.innerHTML = '<img src="' + ic.src + '" style="width:32px;height:32px;object-fit:contain;"><span>' + ic.label + '</span>';
    p.appendChild(el);
  });
  var pl = document.getElementById('start-places');
  ['My Documents', 'My Pictures', 'My Music', 'Favorites'].forEach(function (name) {
    var el = document.createElement('div'); el.className = 'start-place';
    el.innerHTML = '<span style="font-size:20px;">📁</span><span>' + name + '</span>';
    pl.appendChild(el);
  });
})();

var startBtn = document.getElementById('start-btn');
var startMenu = document.getElementById('start-menu');
startBtn.addEventListener('click', function (e) { e.stopPropagation(); startMenu.classList.toggle('hidden'); startBtn.classList.toggle('active'); });
document.addEventListener('click', function () { startMenu.classList.add('hidden'); startBtn.classList.remove('active'); document.querySelectorAll('.desktop-icon').forEach(function (i) { i.classList.remove('selected'); }); });
startMenu.addEventListener('click', function (e) { e.stopPropagation(); });
document.querySelectorAll('[data-window]').forEach(function (el) { el.addEventListener('click', function () { openWindow(el.dataset.window); startMenu.classList.add('hidden'); startBtn.classList.remove('active'); }); });
document.getElementById('shutdown-btn').addEventListener('click', function () { document.getElementById('desktop').classList.add('hidden'); document.getElementById('shutdown').classList.remove('hidden'); });

// ---- 窗口管理 ----
function openWindow(id) {
  if (windows[id]) { focusWindow(id); return; }
  var app = APPS[id]; if (!app) return;
  var win = document.createElement('div'); win.className = 'window'; win.style.zIndex = ++zCounter;
  var offset = Object.keys(windows).length * 22;
  win.style.left = (80 + offset) + 'px'; win.style.top = (40 + offset) + 'px'; win.style.width = app.w + 'px'; win.style.height = app.h + 'px';
  win.innerHTML = '<div class="window-titlebar"><img src="' + app.icon + '" style="width:16px;height:16px;object-fit:contain;flex-shrink:0;"><span class="window-title">' + app.title + '</span><div class="window-btns"><button class="win-btn min" title="Minimize">_</button><button class="win-btn max" title="Maximize">□</button><button class="win-btn close" title="Close">✕</button></div></div><div class="window-body">' + app.render() + '</div>';
  document.getElementById('windows').appendChild(win);
  windows[id] = { el: win, minimized: false, maximized: false, prev: null }; activeWin = id;
  win.querySelector('.close').addEventListener('click', function (e) { e.stopPropagation(); closeWindow(id); });
  win.querySelector('.min').addEventListener('click', function (e) { e.stopPropagation(); minimizeWindow(id); });
  win.querySelector('.max').addEventListener('click', function (e) { e.stopPropagation(); toggleMax(id); });
  makeDraggable(win, id); win.addEventListener('mousedown', function () { focusWindow(id); }); addTaskbarItem(id, app);
}
function closeWindow(id) { if (!windows[id]) return; windows[id].el.remove(); delete windows[id]; var tb = document.querySelector('.taskbar-win[data-id="' + id + '"]'); if (tb) tb.remove(); }
function minimizeWindow(id) { if (!windows[id]) return; windows[id].el.style.display = 'none'; windows[id].minimized = true; var tb = document.querySelector('.taskbar-win[data-id="' + id + '"]'); if (tb) tb.classList.remove('active'); }
function toggleMax(id) { var w = windows[id]; if (!w) return; if (w.maximized) { var p = w.prev; w.el.style.left = p.left; w.el.style.top = p.top; w.el.style.width = p.width; w.el.style.height = p.height; w.maximized = false; } else { w.prev = { left: w.el.style.left, top: w.el.style.top, width: w.el.style.width, height: w.el.style.height }; w.el.style.left = '0px'; w.el.style.top = '0px'; w.el.style.width = '100%'; w.el.style.height = 'calc(100% - 30px)'; w.maximized = true; } }
function focusWindow(id) { var w = windows[id]; if (!w) return; if (w.minimized) { w.el.style.display = 'flex'; w.minimized = false; } w.el.style.zIndex = ++zCounter; activeWin = id; document.querySelectorAll('.taskbar-win').forEach(function (tb) { tb.classList.toggle('active', tb.dataset.id === id); }); }
function makeDraggable(win, id) { var tb = win.querySelector('.window-titlebar'); var d = false, sx, sy, sl, st; tb.addEventListener('mousedown', function (e) { if (e.target.classList.contains('win-btn')) return; if (windows[id] && windows[id].maximized) return; d = true; sx = e.clientX; sy = e.clientY; sl = parseInt(win.style.left); st = parseInt(win.style.top); focusWindow(id); e.preventDefault(); }); document.addEventListener('mousemove', function (e) { if (!d) return; win.style.left = Math.max(0, Math.min(window.innerWidth - 80, sl + e.clientX - sx)) + 'px'; win.style.top = Math.max(0, Math.min(window.innerHeight - 60, st + e.clientY - sy)) + 'px'; }); document.addEventListener('mouseup', function () { d = false; }); }
function addTaskbarItem(id, app) { var btn = document.createElement('button'); btn.className = 'taskbar-win active'; btn.dataset.id = id; btn.innerHTML = '<img src="' + app.icon + '" style="width:14px;height:14px;object-fit:contain;flex-shrink:0;"><span>' + app.title + '</span>'; btn.addEventListener('click', function () { if (windows[id] && windows[id].minimized) { focusWindow(id); } else if (activeWin === id) { minimizeWindow(id); } else { focusWindow(id); } }); document.getElementById('taskbar-windows').appendChild(btn); }

// ---- 桌宠 ----
(function () { var sb = document.getElementById('right-sidebar'); PETS.forEach(function (pet) { var btn = document.createElement('button'); btn.className = 'sidebar-pet-btn'; btn.dataset.petId = pet.id; btn.innerHTML = '<img src="' + pet.iconSrc + '" style="width:20px;height:20px;object-fit:contain;">'; btn.addEventListener('click', function (e) { e.stopPropagation(); togglePet(pet.id); }); sb.appendChild(btn); }); })();
function togglePet(petId) {
  if (activePets[petId]) { activePets[petId].remove(); delete activePets[petId]; document.querySelector('[data-pet-id="' + petId + '"]').classList.remove('active'); }
  else { var pet = PETS.find(function (p) { return p.id === petId; }); var el = document.createElement('div'); el.className = 'desktop-pet'; el.style.left = (window.innerWidth - 160) + 'px'; el.style.top = (80 + Math.random() * 200) + 'px'; el.innerHTML = '<button class="pet-dismiss-btn" onclick="togglePet(\'' + petId + '\')">×</button><img src="' + pet.petSrc + '" style="width:' + pet.size + 'px;height:' + pet.size + 'px;">'; document.getElementById('pets').appendChild(el); activePets[petId] = el; document.querySelector('[data-pet-id="' + petId + '"]').classList.add('active'); makePetDraggable(el); }
}
function makePetDraggable(el) { var d = false, ox, oy; el.addEventListener('mousedown', function (e) { if (e.target.classList.contains('pet-dismiss-btn')) return; d = true; ox = e.clientX - parseInt(el.style.left); oy = e.clientY - parseInt(el.style.top); e.preventDefault(); }); document.addEventListener('mousemove', function (e) { if (!d) return; el.style.left = Math.max(0, Math.min(window.innerWidth - 80, e.clientX - ox)) + 'px'; el.style.top = Math.max(0, Math.min(window.innerHeight - 120, e.clientY - oy)) + 'px'; }); document.addEventListener('mouseup', function () { d = false; }); }

// ================================================
// 内容渲染 — 三融合
// ================================================

// 博客 — MoeKernel XP 资源管理器，读取 admin 存储的文章
function renderBlog() {
  var adminPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
  var defaultPosts = [
    { title: '欢迎来到我的复古桌面', icon: 'assets/icons/Blog.png', category: '公告' },
    { title: 'Y2K 美学：千禧年的赛博浪漫', icon: 'assets/icons/Blog.png', category: '设计' },
    { title: '用纯前端实现 XP 桌面体验', icon: 'assets/icons/Blog.png', category: '技术' },
    { title: 'CRT 扫描线效果实现', icon: 'assets/icons/Blog.png', category: '技术' },
    { title: '从 MoeKernel 学到的架构', icon: 'assets/icons/Blog.png', category: '技术' },
    { title: 'Fuyukawa 手账风格 Web 设计', icon: 'assets/icons/Blog.png', category: '设计' },
    { title: 'pcmoe 萌系配色方案', icon: 'assets/icons/Blog.png', category: '设计' },
  ];
  var posts = adminPosts.map(function (p) { return { title: p.title, icon: 'assets/icons/Blog.png', category: p.category || '未分类' }; }).concat(defaultPosts);
  var categories = ['全部']; posts.forEach(function (p) { if (categories.indexOf(p.category) === -1) categories.push(p.category); });
  return '<div style="height:100%;display:flex;flex-direction:column;background:#fff;">' +
    '<div class="explorer-toolbar"><div class="explorer-menu">' + ['File','Edit','View','Favorites','Tools','Help'].map(function (m) { return '<button>' + m + '</button>'; }).join('') + '</div><div class="explorer-address"><span style="color:#555;font-size:11px;">Address</span><div class="explorer-address-bar">My Blog</div></div></div>' +
    '<div class="category-tabbar">' + categories.map(function (c, i) { return '<button class="cat-tab' + (i === 0 ? ' active' : '') + '">' + c + '</button>'; }).join('') + '</div>' +
    '<div style="flex:1;display:flex;overflow:hidden;"><div class="blog-sidebar"><div><div class="blog-sidebar-title">Blog Tasks</div>' + categories.map(function (c, i) { return '<div class="blog-sidebar-link' + (i === 0 ? ' active' : '') + '">' + c + ' (' + (c === '全部' ? posts.length : posts.filter(function (p) { return p.category === c; }).length) + ')</div>'; }).join('') + '</div><div><div class="blog-sidebar-title">Details</div><div style="font-size:10px;color:#333;font-family:var(--font-xp);line-height:1.6;">共 ' + posts.length + ' 篇文章<br>点击文章图标即可阅读。</div></div></div>' +
    '<div class="article-grid">' + posts.map(function (p) { return '<div class="article-tile" onclick="alert(\'文章: ' + p.title + '\')"><img class="article-tile-icon" src="' + p.icon + '"><span class="article-tile-label">' + p.title + '</span></div>'; }).join('') + '</div></div></div>';
}

// 关于我 — Fuyukawa 手账 + 读取 admin 存储
function renderAbout() {
  var a = JSON.parse(localStorage.getItem('about_config') || '{}');
  var name = a.name || '毛地张';
  var titleText = a.title || 'Software Developer · Retro Enthusiast';
  var location = a.location || 'null';
  var content = a.content || '';
  var skillsStr = a.skills || 'HTML/CSS, JavaScript, 复古设计, Y2K 美学, 二次元, GitHub Pages';
  var skills = skillsStr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  return '<div class="about-container">' +
    '<div class="about-header"><img class="about-avatar" src="assets/avatarSrc.jpg" alt="avatar"><div><div class="about-name">' + esc(name) + '</div><div class="about-title">' + esc(titleText) + '</div><div class="about-location">' + esc(location) + '</div></div></div>' +
    '<div class="about-content">' +
      '<h2>简介</h2>' +
      (content ? '<p>' + esc(content) + '</p>' : '') +
      '<p>这个博客融合了三个优秀项目的元素：</p>' +
      '<ul><li><strong>MoeKernel_Desktop</strong> — Windows XP 桌面交互（窗口、任务栏、开始菜单）</li><li><strong>Yuimi-chaya</strong> — Fuyukawa Kagari 手账风格（纸张色、樱花雨、动漫角色）</li><li><strong>pcmoe.net</strong> — 萌系彩色配色（红橙黄绿青蓝紫）</li></ul>' +
      '<h2>喜欢的作品</h2>' +
      '<div class="about-anime-row">' +
        '<img class="about-anime-img" src="assets/fuyukawa/about/engage-kiss.webp" alt="Engage Kiss">' +
        '<img class="about-anime-img" src="assets/fuyukawa/about/xp-catgirl.webp" alt="XP Catgirl">' +
        '<img class="about-anime-img" src="assets/fuyukawa/about/xp-pink-hair.webp" alt="Pink Hair">' +
        '<img class="about-anime-img" src="assets/fuyukawa/about/no-game-no-life.webp" alt="No Game No Life">' +
        '<img class="about-anime-img" src="assets/fuyukawa/about/cyberpunk-2077.webp" alt="Cyberpunk">' +
      '</div>' +
      '<h2>技术栈</h2>' +
      '<p>纯 HTML + CSS + JavaScript，无框架依赖，部署在 GitHub Pages。</p>' +
    '</div>' +
    '<div class="about-skills"><div class="about-skills-title">🛠 SKILLS</div><div>' + skills.map(function (s, i) { return '<span class="about-skill-tag" style="background:' + PCMOE_COLORS[i % PCMOE_COLORS.length] + ';">' + s + '</span>'; }).join('') + '</div></div>' +
  '</div>';
}

// 留言板 — Fuyukawa 手账风
function renderChatbox() {
  var saved = JSON.parse(localStorage.getItem('chatbox') || '[]');
  var defaults = [{ name: '路过的旅行者', time: '2026-10-06 22:30', message: '这个桌面好有复古感！' }, { name: 'Y2K爱好者', time: '2026-10-05 15:20', message: '融合得不错~' }];
  var msgs = saved.concat(defaults);
  return '<div class="chatbox-container"><div class="chatbox-header">💬 留言板</div><div class="chatbox-messages">' + msgs.map(function (m) { return '<div class="chatbox-msg"><div class="chatbox-msg-name">' + m.name + '<span class="chatbox-msg-time">' + m.time + '</span></div><div class="chatbox-msg-text">' + m.message + '</div></div>'; }).join('') + '</div><div class="chatbox-form"><input type="text" id="cb-input" placeholder="说点什么..." onkeydown="if(event.key===\'Enter\')submitChatbox()"><button onclick="submitChatbox()">发送</button></div></div>';
}
function submitChatbox() { var input = document.getElementById('cb-input'); var msg = input.value.trim(); if (!msg) return; var now = new Date(); var time = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0'); var saved = JSON.parse(localStorage.getItem('chatbox') || '[]'); saved.unshift({ name: '访客', time: time, message: msg }); localStorage.setItem('chatbox', JSON.stringify(saved)); windows['chatbox'].el.querySelector('.window-body').innerHTML = renderChatbox(); }

// 作品集 — Fuyukawa 手账卡片
function renderPortfolio() {
  var works = [{ icon: '🖥️', title: '复古桌面博客', desc: '本站 · 三融合' }, { icon: '🎮', title: '像素小游戏', desc: 'Canvas 复古游戏' }, { icon: '🎵', title: 'Winamp 播放器', desc: '复古音乐 UI' }, { icon: '🎨', title: 'MS Paint', desc: '画板工具' }, { icon: '📚', title: '复古阅读器', desc: 'Markdown 阅读器' }, { icon: '📱', title: 'PDA 模拟器', desc: 'Y2K 风格 PDA' }];
  return '<div class="portfolio-container"><div class="portfolio-grid">' + works.map(function (w) { return '<div class="portfolio-card" onclick="alert(\'作品: ' + w.title + '\')"><div class="portfolio-thumb">' + w.icon + '</div><div class="portfolio-info"><div class="portfolio-title">' + w.title + '</div><div class="portfolio-desc">' + w.desc + '</div></div></div>'; }).join('') + '</div></div>';
}

// Winamp
function renderWinamp() { return '<div class="winamp-container"><div class="winamp-title">🎵 Winamp</div><div style="color:#aaa;font-size:11px;">It really whips the llama\'s ass!</div><div class="winamp-display"><div class="winamp-time">00:00 ━━━━━━━━━━━ 03:24</div></div><div style="display:flex;gap:8px;"><button style="width:32px;height:24px;background:linear-gradient(180deg,#d0d0d0,#a0a0a0);border:1px solid #888;border-radius:3px;cursor:pointer;font-size:12px;">⏮</button><button style="width:32px;height:24px;background:linear-gradient(180deg,#d0d0d0,#a0a0a0);border:1px solid #888;border-radius:3px;cursor:pointer;font-size:12px;">▶</button><button style="width:32px;height:24px;background:linear-gradient(180deg,#d0d0d0,#a0a0a0);border:1px solid #888;border-radius:3px;cursor:pointer;font-size:12px;">⏭</button></div></div>'; }

// 友情链接 — Fuyukawa 手账 + 三个参考源
function renderLinks() {
  var adminLinks = JSON.parse(localStorage.getItem('links_config') || '[]');
  var defaultLinks = [{ name: 'Yuimi Lab', desc: '二次元叙事+技术记录', icon: '🌸', url: 'https://yuimi-chaya.github.io' }, { name: 'pcmoe.net', desc: '复古PC萌系', icon: '🖥️', url: 'https://www.pcmoe.net/' }, { name: 'MoeKernel', desc: 'XP风格桌面系统', icon: '💻', url: 'https://github.com/NNNullptr/MoeKernel_Desktop' }, { name: 'GitHub', desc: '我的GitHub', icon: '🐙', url: 'https://github.com/520maodizhang' }];
  var links = adminLinks.length > 0 ? adminLinks : defaultLinks;
  return '<div class="links-container"><div class="links-grid">' + links.map(function (l) { return '<a class="link-card" href="' + l.url + '" target="_blank" rel="noopener"><div class="link-icon">' + l.icon + '</div><div><div class="link-name">' + l.name + '</div><div class="link-desc">' + l.desc + '</div></div></a>'; }).join('') + '</div></div>';
}

// 工具函数
function esc(s) { if (!s) return ''; return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
