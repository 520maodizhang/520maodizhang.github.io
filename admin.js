/* ================================================
   管理后台 — 严格基于 MoeKernel admin 组件
   XP GroupBox / 3D 按钮 / 图片预览 / 成功对话框 / 分栏列表
   ================================================ */

var FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';
var currentPage = 'dashboard';

// 导航项 — 从 MoeKernel _layout.tsx NAV_ITEMS 提取
var NAV_ITEMS = [
  { icon: '🖥️', label: '仪表盘',     page: 'dashboard' },
  { icon: '🎨', label: '主题设置',   page: 'theme' },
  { icon: '📝', label: '博客管理',   page: 'blog' },
  { icon: '👤', label: '关于设置',   page: 'about' },
  { icon: '🗂️', label: '作品集',     page: 'portfolio' },
  { icon: '💬', label: '留言板',     page: 'chatbox' },
  { icon: '📬', label: '联系设置',   page: 'links' },
  { icon: '🐾', label: '桌宠管理',   page: 'pets' },
];

// ---- 登录 ----
function doLogin() {
  var pw = document.getElementById('admin-pw').value;
  if (pw === (localStorage.getItem('admin_password') || 'admin')) {
    sessionStorage.setItem('admin_authed', '1');
    showApp();
  } else { alert('密码错误！'); }
}
function doLogout() { sessionStorage.removeItem('admin_authed'); document.getElementById('admin-app').classList.add('hidden'); document.getElementById('admin-login').classList.remove('hidden'); document.getElementById('admin-pw').value = ''; }
function showApp() { document.getElementById('admin-login').classList.add('hidden'); document.getElementById('admin-app').classList.remove('hidden'); renderAdmin(); }
if (sessionStorage.getItem('admin_authed') === '1') showApp();

// ---- 渲染 ----
function renderAdmin() { renderSidebar(); renderContent(); }
function renderSidebar() {
  var sb = document.getElementById('admin-sidebar');
  sb.innerHTML = '<div class="admin-sidebar-title">控制面板</div>';
  NAV_ITEMS.forEach(function (item) {
    sb.innerHTML += '<div class="admin-nav-item' + (item.page === currentPage ? ' active' : '') + '" onclick="currentPage=\'' + item.page + '\';renderAdmin()"><span>' + item.icon + '</span><span>' + item.label + '</span></div>';
  });
}
function renderContent() {
  var c = document.getElementById('admin-content');
  var pages = { dashboard: renderDashboard, theme: renderTheme, blog: renderBlog, about: renderAbout, portfolio: renderPortfolio, chatbox: renderChatbox, links: renderLinks, pets: renderPets };
  c.innerHTML = pages[currentPage] ? pages[currentPage]() : '';
}

// ---- UI 组件（从 MoeKernel theme.tsx 提取）----
function pageHeader(icon, title, sub) { return '<div class="admin-page-header"><span style="font-size:28px;">' + icon + '</span><div><h1>' + title + '</h1><p>' + sub + '</p></div></div>'; }
function section(title, body) { return '<fieldset class="admin-section"><legend>' + title + '</legend>' + body + '</fieldset>'; }
function fieldRow(label, content) { return '<div class="admin-field-row"><label class="admin-field-label">' + label + '：</label>' + content + '</div>'; }
function xpInput(id, val, placeholder, width) { return '<input class="admin-input" id="' + id + '" value="' + esc(val || '') + '" placeholder="' + esc(placeholder || '') + '" style="width:' + (width || 320) + 'px;">'; }
function xpTextarea(id, val, rows) { return '<textarea class="admin-textarea" id="' + id + '" rows="' + (rows || 6) + '">' + esc(val || '') + '</textarea>'; }
function xpButton(label, onclick, primary) { return '<button class="admin-btn' + (primary ? ' primary' : '') + '" onclick="' + onclick + '">' + label + '</button>'; }
function xpButtonDanger(label, onclick) { return '<button class="admin-btn danger" onclick="' + onclick + '">' + label + '</button>'; }
function imgPreview(src, aspect, maxWidth, label) {
  var isUrl = src && (src.startsWith('http') || src.startsWith('/'));
  return '<div class="admin-img-preview"><div class="admin-img-preview-label">' + label + '</div><div class="admin-img-preview-box" style="width:' + maxWidth + 'px;aspect-ratio:' + aspect + ';">' + (isUrl ? '<img src="' + esc(src) + '" alt="' + label + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\'"><span style="display:none;font-size:10px;color:#888;">加载失败</span>' : '<span style="font-size:10px;color:#888;">（未填写）</span>') + '</div></div>';
}
function successDialog(title, msg) {
  return '<div class="admin-modal-overlay" onclick="this.remove()"><div class="admin-modal" onclick="event.stopPropagation()"><div class="admin-modal-titlebar"><img src="assets/icons/1.png"><span>' + title + '</span></div><div class="admin-modal-body"><div class="admin-modal-body-content"><span class="icon">✅</span><div><div class="title">设置已保存</div><div class="desc">' + msg + '</div></div></div><div style="display:flex;justify-content:flex-end;"><button class="admin-btn primary" onclick="this.closest(\'.admin-modal-overlay\').remove()">确定</button></div></div></div></div>';
}
function subsecTitle(title) { return '<div class="admin-subsection-title">' + title + '</div>'; }

// ================================================
// 仪表盘
// ================================================
function renderDashboard() {
  var cards = [
    { icon: '🎨', label: '主题设置', desc: '修改壁纸、Logo 和身份信息', page: 'theme' },
    { icon: '📝', label: '博客管理', desc: '新建、编辑、删除博客文章', page: 'blog' },
    { icon: '👤', label: '关于设置', desc: '修改个人介绍和技能标签', page: 'about' },
    { icon: '🗂️', label: '作品集', desc: '管理作品展示卡片', page: 'portfolio' },
    { icon: '💬', label: '留言板', desc: '查看和删除访客留言', page: 'chatbox' },
    { icon: '📬', label: '联系设置', desc: '管理友情链接', page: 'links' },
    { icon: '🐾', label: '桌宠管理', desc: '管理桌面宠物', page: 'pets' },
  ];
  return pageHeader('🖥️', '管理后台', '欢迎回来，管理员') + '<div class="admin-cards">' + cards.map(function (c) {
    return '<div class="admin-card" onclick="currentPage=\'' + c.page + '\';renderAdmin()"><span class="admin-card-icon">' + c.icon + '</span><div><div class="admin-card-label">' + c.label + '</div><div class="admin-card-desc">' + c.desc + '</div></div></div>';
  }).join('') + '</div>';
}

// ================================================
// 主题设置 — 从 MoeKernel theme.tsx 提取
// ================================================
function renderTheme() {
  var s = getSettings();
  return pageHeader('🎨', '主题设置', '修改壁纸、Logo 与身份信息，保存后前台即时生效') +
    section('🖼️  桌面壁纸', fieldRow('图片 URL', xpInput('theme-wallpaper', s.wallpaper, 'https://example.com/wallpaper.jpg 或 /assets/wallpapers/...', 420)) + imgPreview(s.wallpaper, '16/9', 280, '壁纸预览')) +
    section('🪟  Windows Logo（左下角图标）', fieldRow('图标 URL', xpInput('theme-logo', s.logo, 'https://example.com/logo.ico 或 /assets/...', 420)) + imgPreview(s.logo, '1/1', 48, 'Logo 预览')) +
    section('🪪  站点身份信息',
      '<p style="margin:0 0 10px;font-size:11px;color:#555;">配置欢迎屏内容与开始菜单显示信息，保存后前台刷新生效。</p>' +
      subsecTitle('网页信息') +
      fieldRow('站点标题', xpInput('theme-title', s.title, '毛地张的复古桌面', 340)) +
      fieldRow('站点描述', xpInput('theme-desc', s.description, '个人主页描述文字', 340)) +
      subsecTitle('欢迎屏 & 开始菜单') +
      fieldRow('品牌大字', xpInput('theme-brand', s.brand, 'Boot/Login 左栏大字', 340)) +
      fieldRow('Boot 副标题', xpInput('theme-boot', s.boot, 'Welcome', 340)) +
      fieldRow('角色/头衔', xpInput('theme-role', s.role, 'Software Developer', 340)) +
      fieldRow('用户名', xpInput('theme-username', s.username, 'Login 右栏 + Start 菜单', 340)) +
      fieldRow('头像 URL', xpInput('theme-avatar', s.avatar, '/assets/avatarSrc.jpg 或 https://...', 300) + (s.avatar ? '<img src="' + esc(s.avatar) + '" alt="预览" style="width:40px;height:40px;object-fit:cover;border:2px solid #aaa;border-radius:2px;flex-shrink:0;">' : '')) +
      subsecTitle('安全') +
      fieldRow('管理密码', '<input class="admin-input" type="password" id="theme-password" placeholder="留空不修改" style="width:300px;">')
    ) +
    '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:4px;">' + xpButton('💾  保存设置', 'saveTheme()', true) + '</div>';
}
function saveTheme() {
  var s = getSettings();
  s.wallpaper = val('theme-wallpaper') || s.wallpaper;
  s.logo = val('theme-logo') || s.logo;
  s.title = val('theme-title');
  s.description = val('theme-desc');
  s.brand = val('theme-brand');
  s.boot = val('theme-boot');
  s.role = val('theme-role');
  s.username = val('theme-username');
  s.avatar = val('theme-avatar') || s.avatar;
  saveSettings(s);
  var pw = val('theme-password');
  if (pw) localStorage.setItem('admin_password', pw);
  document.getElementById('admin-content').innerHTML += successDialog('主题设置', '主题设置已成功保存。<br>前台页面刷新后即可看到最新效果。');
}

// ================================================
// 博客管理 — 左右分栏（从 MoeKernel documents.tsx 提取）
// ================================================
function renderBlog() {
  var posts = getPosts();
  return '<div class="admin-split">' +
    '<div class="admin-split-left">' +
      '<div class="admin-split-left-header"><div style="font-size:13px;font-weight:bold;color:#003399;margin-bottom:6px;">📝 博客管理</div>' + xpButton('✚ 新建文章', 'newPost()', true) + '</div>' +
      '<div class="admin-split-list">' + (posts.length === 0 ? '<div style="padding:12px;font-size:11px;color:#888;text-align:center;"><div style="font-size:28px;margin-bottom:6px;">📂</div>暂无文章，点击「新建文章」开始</div>' :
        posts.map(function (p, i) {
          return '<div class="admin-split-item' + (i === window._selectedPost ? ' active' : '') + '" onclick="selectPost(' + i + ')"><span style="font-size:14px;">📄</span><div><div style="font-size:12px;color:#000;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(p.title || '未命名') + '</div><div style="font-size:10px;color:#888;">' + esc(p.category || '未分类') + ' · ' + esc(p.date || '') + '</div></div></div>';
        }).join('')) + '</div>' +
    '</div>' +
    '<div class="admin-split-right">' + (window._selectedPost != null && posts[window._selectedPost] ? renderPostEditor(posts[window._selectedPost], window._selectedPost) : '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#888;"><div style="font-size:48px;margin-bottom:12px;">📝</div><div style="font-size:13px;">从左侧选择一篇文章进行编辑，或点击「新建文章」</div></div>') + '</div>' +
  '</div>';
}
function renderPostEditor(p, idx) {
  return pageHeader('📝', '编辑文章', '修改文章信息，保存后前台即时生效') +
    section('📋  基本信息',
      fieldRow('标题', xpInput('post-title', p.title, '文章标题', 380)) +
      fieldRow('分类', xpInput('post-category', p.category, '如：技术、设计、公告', 200)) +
      fieldRow('日期', xpInput('post-date', p.date, '2026-10-07', 150))
    ) +
    section('✏️  摘要', xpTextarea('post-excerpt', p.excerpt, 5)) +
    '<div style="display:flex;justify-content:flex-end;gap:8px;">' + xpButton('💾  保存', 'savePost(' + idx + ')', true) + xpButtonDanger('🗑  删除', 'delPost(' + idx + ')') + '</div>';
}
function selectPost(idx) { window._selectedPost = idx; renderContent(); }
function newPost() { var posts = getPosts(); posts.unshift({ title: '新文章', category: '', date: new Date().toISOString().slice(0, 10), excerpt: '' }); localStorage.setItem('blog_posts', JSON.stringify(posts)); window._selectedPost = 0; renderContent(); }
function savePost(idx) { var posts = getPosts(); posts[idx] = { title: val('post-title'), category: val('post-category'), date: val('post-date'), excerpt: val('post-excerpt') }; localStorage.setItem('blog_posts', JSON.stringify(posts)); document.getElementById('admin-content').innerHTML += successDialog('博客管理', '文章已保存。'); renderContent(); }
function delPost(idx) { if (!confirm('确定删除这篇文章？')) return; var posts = getPosts(); posts.splice(idx, 1); localStorage.setItem('blog_posts', JSON.stringify(posts)); window._selectedPost = null; renderContent(); }

// ================================================
// 关于设置
// ================================================
function renderAbout() {
  var a = getAbout();
  return pageHeader('👤', '关于设置', '修改个人介绍，保存后前台即时生效') +
    section('📋  基本信息',
      fieldRow('姓名', xpInput('about-name', a.name, '毛地张', 300)) +
      fieldRow('头衔', xpInput('about-title', a.title, 'Software Developer', 300)) +
      fieldRow('位置', xpInput('about-location', a.location, 'null', 200))
    ) +
    section('✏️  个人介绍（Markdown）', xpTextarea('about-content', a.content, 10)) +
    section('🛠  技能标签', '<p style="margin:0 0 8px;font-size:11px;color:#555;">用逗号分隔，每个标签会显示为彩色徽章。</p>' + xpInput('about-skills', a.skills, 'HTML/CSS, JavaScript, 复古设计', 400)) +
    '<div style="display:flex;justify-content:flex-end;gap:8px;">' + xpButton('💾  保存', 'saveAbout()', true) + '</div>';
}
function saveAbout() { localStorage.setItem('about_config', JSON.stringify({ name: val('about-name'), title: val('about-title'), location: val('about-location'), content: val('about-content'), skills: val('about-skills') })); document.getElementById('admin-content').innerHTML += successDialog('关于设置', '关于设置已保存。'); }

// ================================================
// 作品集 — 左右分栏
// ================================================
function renderPortfolio() {
  var works = getWorks();
  return '<div class="admin-split"><div class="admin-split-left"><div class="admin-split-left-header"><div style="font-size:13px;font-weight:bold;color:#003399;margin-bottom:6px;">🗂️ 作品集</div>' + xpButton('✚ 新建作品', 'newWork()', true) + '</div><div class="admin-split-list">' + (works.length === 0 ? '<div style="padding:12px;font-size:11px;color:#888;text-align:center;">暂无作品</div>' : works.map(function (w, i) { return '<div class="admin-split-item' + (i === window._selectedWork ? ' active' : '') + '" onclick="selectWork(' + i + ')"><span style="font-size:18px;">' + w.icon + '</span><div><div style="font-size:12px;color:#000;">' + esc(w.title) + '</div><div style="font-size:10px;color:#888;">' + esc(w.desc) + '</div></div></div>'; }).join('')) + '</div></div><div class="admin-split-right">' + (window._selectedWork != null && works[window._selectedWork] ? renderWorkEditor(works[window._selectedWork], window._selectedWork) : '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#888;"><div style="font-size:48px;margin-bottom:12px;">🗂️</div><div style="font-size:13px;">从左侧选择一个作品进行编辑</div></div>') + '</div></div>';
}
function renderWorkEditor(w, idx) { return pageHeader('🗂️', '编辑作品', '修改作品信息') + section('📋  作品信息', fieldRow('图标', xpInput('work-icon', w.icon, '🎨', 80)) + fieldRow('标题', xpInput('work-title', w.title, '作品名称', 300)) + fieldRow('描述', xpInput('work-desc', w.desc, '一句话描述', 300))) + '<div style="display:flex;justify-content:flex-end;gap:8px;">' + xpButton('💾  保存', 'saveWork(' + idx + ')', true) + xpButtonDanger('🗑  删除', 'delWork(' + idx + ')') + '</div>'; }
function selectWork(idx) { window._selectedWork = idx; renderContent(); }
function newWork() { var works = getWorks(); works.push({ icon: '🎨', title: '新作品', desc: '' }); localStorage.setItem('portfolio_items', JSON.stringify(works)); window._selectedWork = works.length - 1; renderContent(); }
function saveWork(idx) { var works = getWorks(); works[idx] = { icon: val('work-icon'), title: val('work-title'), desc: val('work-desc') }; localStorage.setItem('portfolio_items', JSON.stringify(works)); document.getElementById('admin-content').innerHTML += successDialog('作品集', '作品已保存。'); renderContent(); }
function delWork(idx) { if (!confirm('确定删除？')) return; var works = getWorks(); works.splice(idx, 1); localStorage.setItem('portfolio_items', JSON.stringify(works)); window._selectedWork = null; renderContent(); }

// ================================================
// 留言板
// ================================================
function renderChatbox() {
  var msgs = JSON.parse(localStorage.getItem('chatbox') || '[]');
  return pageHeader('💬', '留言板', '查看和删除访客留言（共 ' + msgs.length + ' 条）') + (msgs.length === 0 ? '<div style="padding:40px;text-align:center;color:#888;font-size:13px;">暂无留言</div>' : msgs.map(function (m, i) { return '<div class="admin-msg-item"><div class="admin-msg-name">' + esc(m.name) + '<span class="admin-msg-time">' + esc(m.time) + '</span></div><div class="admin-msg-text">' + esc(m.message) + '</div><div style="margin-top:6px;">' + xpButtonDanger('🗑  删除', 'delMsg(' + i + ')') + '</div></div>'; }).join(''));
}
function delMsg(idx) { var msgs = JSON.parse(localStorage.getItem('chatbox') || '[]'); msgs.splice(idx, 1); localStorage.setItem('chatbox', JSON.stringify(msgs)); renderContent(); }

// ================================================
// 联系设置（友情链接）— 左右分栏
// ================================================
function renderLinks() {
  var links = getLinks();
  return '<div class="admin-split"><div class="admin-split-left"><div class="admin-split-left-header"><div style="font-size:13px;font-weight:bold;color:#003399;margin-bottom:6px;">📬 友情链接</div>' + xpButton('✚ 新增链接', 'newLink()', true) + '</div><div class="admin-split-list">' + (links.length === 0 ? '<div style="padding:12px;font-size:11px;color:#888;text-align:center;">暂无链接</div>' : links.map(function (l, i) { return '<div class="admin-split-item' + (i === window._selectedLink ? ' active' : '') + '" onclick="selectLink(' + i + ')"><span style="font-size:18px;">' + l.icon + '</span><div><div style="font-size:12px;color:#000;">' + esc(l.name) + '</div><div style="font-size:10px;color:#888;">' + esc(l.desc) + '</div></div></div>'; }).join('')) + '</div></div><div class="admin-split-right">' + (window._selectedLink != null && links[window._selectedLink] ? renderLinkEditor(links[window._selectedLink], window._selectedLink) : '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#888;"><div style="font-size:48px;margin-bottom:12px;">📬</div><div style="font-size:13px;">从左侧选择一个链接进行编辑</div></div>') + '</div></div>';
}
function renderLinkEditor(l, idx) { return pageHeader('📬', '编辑链接', '修改友情链接') + section('📋  链接信息', fieldRow('图标', xpInput('link-icon', l.icon, '🔗', 80)) + fieldRow('名称', xpInput('link-name', l.name, '站点名称', 300)) + fieldRow('描述', xpInput('link-desc', l.desc, '一句话描述', 300)) + fieldRow('URL', xpInput('link-url', l.url, 'https://...', 380))) + '<div style="display:flex;justify-content:flex-end;gap:8px;">' + xpButton('💾  保存', 'saveLink(' + idx + ')', true) + xpButtonDanger('🗑  删除', 'delLink(' + idx + ')') + '</div>'; }
function selectLink(idx) { window._selectedLink = idx; renderContent(); }
function newLink() { var links = getLinks(); links.push({ icon: '🔗', name: '新链接', desc: '', url: '' }); localStorage.setItem('links_config', JSON.stringify(links)); window._selectedLink = links.length - 1; renderContent(); }
function saveLink(idx) { var links = getLinks(); links[idx] = { icon: val('link-icon'), name: val('link-name'), desc: val('link-desc'), url: val('link-url') }; localStorage.setItem('links_config', JSON.stringify(links)); document.getElementById('admin-content').innerHTML += successDialog('联系设置', '链接已保存。'); renderContent(); }
function delLink(idx) { if (!confirm('确定删除？')) return; var links = getLinks(); links.splice(idx, 1); localStorage.setItem('links_config', JSON.stringify(links)); window._selectedLink = null; renderContent(); }

// ================================================
// 桌宠管理
// ================================================
function renderPets() {
  var pets = getPets();
  return pageHeader('🐾', '桌宠管理', '管理桌面宠物（共 ' + pets.length + ' 个）') + '<div class="admin-notice"><span style="font-size:16px;">ℹ️</span><span>桌宠素材来自 MoeKernel_Desktop 项目的真实 GIF/PNG 精灵图。</span></div>' + '<table class="admin-table"><tr><th>预览</th><th>ID</th><th>图标</th><th>精灵图</th><th>尺寸</th><th>操作</th></tr>' + pets.map(function (p, i) { return '<tr><td><img src="' + p.petSrc + '" style="width:50px;height:50px;object-fit:contain;"></td><td>' + esc(p.id) + '</td><td><img src="' + p.iconSrc + '" style="width:24px;height:24px;"></td><td style="font-size:11px;color:#666;">' + esc(p.petSrc) + '</td><td>' + p.size + 'px</td><td>' + xpButtonDanger('🗑  删除', 'delPet(' + i + ')') + '</td></tr>'; }).join('') + '</table>';
}
function delPet(idx) { if (!confirm('确定删除？')) return; var pets = getPets(); pets.splice(idx, 1); localStorage.setItem('pets_config', JSON.stringify(pets)); renderContent(); }

// ================================================
// 数据工具
// ================================================
function getSettings() { return JSON.parse(localStorage.getItem('site_settings') || '{}'); }
function saveSettings(s) { localStorage.setItem('site_settings', JSON.stringify(s)); }
function getPosts() { return JSON.parse(localStorage.getItem('blog_posts') || '[]'); }
function getAbout() { return JSON.parse(localStorage.getItem('about_config') || '{"name":"毛地张","title":"Software Developer · Retro Enthusiast","location":"null","content":"","skills":"HTML/CSS, JavaScript, 复古设计, Y2K 美学, 二次元, GitHub Pages"}'); }
function getWorks() { return JSON.parse(localStorage.getItem('portfolio_items') || '[]'); }
function getLinks() { return JSON.parse(localStorage.getItem('links_config') || '[]'); }
function getPets() { return JSON.parse(localStorage.getItem('pets_config') || JSON.stringify([{ id: 'pet1', iconSrc: 'assets/pets/avatars/1.png', petSrc: 'assets/pets/sprites/1.gif', size: 150 }, { id: 'pet2', iconSrc: 'assets/pets/avatars/2.png', petSrc: 'assets/pets/sprites/5.png', size: 120 }])); }
function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }
function esc(s) { if (s == null) return ''; return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
