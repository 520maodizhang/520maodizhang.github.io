/* ================================================
   管理后台逻辑 — 基于 MoeKernel admin 结构
   纯前端 localStorage 存储
   ================================================ */

var FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

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

var currentPage = 'dashboard';

// ---- 登录 ----
function doLogin() {
  var pw = document.getElementById('admin-pw').value;
  var savedPw = localStorage.getItem('admin_password') || 'admin';
  if (pw === savedPw) {
    sessionStorage.setItem('admin_authed', '1');
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-app').classList.remove('hidden');
    renderAdmin();
  } else {
    alert('密码错误！');
  }
}

function doLogout() {
  sessionStorage.removeItem('admin_authed');
  document.getElementById('admin-app').classList.add('hidden');
  document.getElementById('admin-login').classList.remove('hidden');
  document.getElementById('admin-pw').value = '';
}

// 自动登录检查
(function () {
  if (sessionStorage.getItem('admin_authed') === '1') {
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-app').classList.remove('hidden');
    renderAdmin();
  }
})();

// ---- 渲染后台 ----
function renderAdmin() {
  renderSidebar();
  renderContent();
}

function renderSidebar() {
  var sb = document.getElementById('admin-sidebar');
  sb.innerHTML = '<div class="admin-sidebar-title">控制面板</div>';
  NAV_ITEMS.forEach(function (item) {
    var el = document.createElement('div');
    el.className = 'admin-nav-item' + (item.page === currentPage ? ' active' : '');
    el.innerHTML = '<span>' + item.icon + '</span><span>' + item.label + '</span>';
    el.addEventListener('click', function () { currentPage = item.page; renderAdmin(); });
    sb.appendChild(el);
  });
}

function renderContent() {
  var c = document.getElementById('admin-content');
  switch (currentPage) {
    case 'dashboard':  c.innerHTML = renderDashboard(); break;
    case 'theme':      c.innerHTML = renderThemePage(); bindTheme(); break;
    case 'blog':       c.innerHTML = renderBlogPage(); bindBlog(); break;
    case 'about':      c.innerHTML = renderAboutPage(); bindAbout(); break;
    case 'portfolio':  c.innerHTML = renderPortfolioPage(); bindPortfolio(); break;
    case 'chatbox':    c.innerHTML = renderChatboxPage(); bindChatbox(); break;
    case 'links':      c.innerHTML = renderLinksPage(); bindLinks(); break;
    case 'pets':       c.innerHTML = renderPetsPage(); bindPets(); break;
  }
}

// ---- 仪表盘 ----
function renderDashboard() {
  var cards = [
    { icon: '🎨', label: '主题设置', desc: '修改壁纸、头像和品牌名', page: 'theme' },
    { icon: '📝', label: '博客管理', desc: '新建、编辑、删除博客文章', page: 'blog' },
    { icon: '👤', label: '关于设置', desc: '修改个人介绍和技能标签', page: 'about' },
    { icon: '🗂️', label: '作品集', desc: '管理作品展示卡片', page: 'portfolio' },
    { icon: '💬', label: '留言板', desc: '查看和删除访客留言', page: 'chatbox' },
    { icon: '📬', label: '联系设置', desc: '管理友情链接', page: 'links' },
    { icon: '🐾', label: '桌宠管理', desc: '管理桌面宠物', page: 'pets' },
  ];
  return pageHeader('🖥️', '管理后台', '欢迎回来，管理员') +
    '<div class="admin-cards">' + cards.map(function (c) {
      return '<div class="admin-card" onclick="currentPage=\'' + c.page + '\';renderAdmin()"><span class="admin-card-icon">' + c.icon + '</span><div><div class="admin-card-label">' + c.label + '</div><div class="admin-card-desc">' + c.desc + '</div></div></div>';
    }).join('') + '</div>';
}

function pageHeader(icon, title, sub) {
  return '<div class="admin-page-title"><span style="font-size:24px;">' + icon + '</span><div><h1>' + title + '</h1><p>' + sub + '</p></div></div>';
}

// ================================================
// 主题设置
// ================================================
function renderThemePage() {
  var s = getSettings();
  return pageHeader('🎨', '主题设置', '修改壁纸、头像和品牌名') +
    '<div class="admin-form-group"><label class="admin-label">桌面壁纸 URL</label><input class="admin-input" id="theme-wallpaper" value="' + esc(s.wallpaper) + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">头像 URL</label><input class="admin-input" id="theme-avatar" value="' + esc(s.avatar) + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">品牌名（Boot 大字）</label><input class="admin-input" id="theme-brand" value="' + esc(s.brand) + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">用户名（Login 显示）</label><input class="admin-input" id="theme-username" value="' + esc(s.username) + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">角色说明</label><input class="admin-input" id="theme-role" value="' + esc(s.role) + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">管理密码（留空不修改）</label><input class="admin-input" type="password" id="theme-password" placeholder="新密码"></div>' +
    '<button class="admin-save-btn" onclick="saveTheme()">保存设置</button>';
}
function bindTheme() {}
function saveTheme() {
  var s = getSettings();
  s.wallpaper = val('theme-wallpaper') || s.wallpaper;
  s.avatar = val('theme-avatar') || s.avatar;
  s.brand = val('theme-brand') || s.brand;
  s.username = val('theme-username') || s.username;
  s.role = val('theme-role') || s.role;
  saveSettings(s);
  var pw = val('theme-password');
  if (pw) localStorage.setItem('admin_password', pw);
  alert('设置已保存！');
}

// ================================================
// 博客管理
// ================================================
function renderBlogPage() {
  var posts = getPosts();
  return pageHeader('📝', '博客管理', '新建、编辑、删除博客文章') +
    '<button class="admin-add-btn" onclick="showBlogEditor()">+ 新建文章</button>' +
    '<div id="blog-editor"></div>' +
    '<table class="admin-table"><tr><th>标题</th><th>分类</th><th>日期</th><th>操作</th></tr>' +
    posts.map(function (p, i) {
      return '<tr><td>' + esc(p.title) + '</td><td>' + esc(p.category || '') + '</td><td>' + esc(p.date || '') + '</td><td><button class="admin-table-btn edit" onclick="showBlogEditor(' + i + ')">编辑</button><button class="admin-table-btn del" onclick="delPost(' + i + ')">删除</button></td></tr>';
    }).join('') + '</table>';
}
function bindBlog() {}
function showBlogEditor(idx) {
  var posts = getPosts();
  var p = idx != null ? posts[idx] : { title: '', category: '', date: new Date().toISOString().slice(0, 10), excerpt: '' };
  var editor = document.getElementById('blog-editor');
  editor.innerHTML =
    '<div style="background:#f5f5f5;padding:16px;border-radius:4px;margin-bottom:16px;">' +
    '<div class="admin-form-group"><label class="admin-label">标题</label><input class="admin-input" id="blog-title" value="' + esc(p.title) + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">分类</label><input class="admin-input" id="blog-category" value="' + esc(p.category || '') + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">日期</label><input class="admin-input" id="blog-date" value="' + esc(p.date || '') + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">摘要</label><textarea class="admin-textarea" id="blog-excerpt">' + esc(p.excerpt || '') + '</textarea></div>' +
    '<button class="admin-save-btn" onclick="savePost(' + (idx != null ? idx : -1) + ')">保存</button>' +
    '<button class="admin-cancel-btn" onclick="document.getElementById(\'blog-editor\').innerHTML=\'\'">取消</button>' +
    '</div>';
}
function savePost(idx) {
  var posts = getPosts();
  var p = { title: val('blog-title'), category: val('blog-category'), date: val('blog-date'), excerpt: val('blog-excerpt') };
  if (idx >= 0) { posts[idx] = p; } else { posts.unshift(p); }
  localStorage.setItem('blog_posts', JSON.stringify(posts));
  renderContent();
}
function delPost(idx) {
  if (!confirm('确定删除这篇文章？')) return;
  var posts = getPosts(); posts.splice(idx, 1); localStorage.setItem('blog_posts', JSON.stringify(posts)); renderContent();
}

// ================================================
// 关于设置
// ================================================
function renderAboutPage() {
  var a = getAbout();
  return pageHeader('👤', '关于设置', '修改个人介绍') +
    '<div class="admin-form-group"><label class="admin-label">姓名</label><input class="admin-input" id="about-name" value="' + esc(a.name) + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">头衔</label><input class="admin-input" id="about-title" value="' + esc(a.title) + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">位置</label><input class="admin-input" id="about-location" value="' + esc(a.location) + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">个人介绍（Markdown）</label><textarea class="admin-textarea" id="about-content" style="min-height:200px;">' + esc(a.content) + '</textarea></div>' +
    '<div class="admin-form-group"><label class="admin-label">技能标签（逗号分隔）</label><input class="admin-input" id="about-skills" value="' + esc(a.skills) + '"></div>' +
    '<button class="admin-save-btn" onclick="saveAbout()">保存</button>';
}
function bindAbout() {}
function saveAbout() {
  var a = { name: val('about-name'), title: val('about-title'), location: val('about-location'), content: val('about-content'), skills: val('about-skills') };
  localStorage.setItem('about_config', JSON.stringify(a));
  alert('关于设置已保存！');
}

// ================================================
// 作品集管理
// ================================================
function renderPortfolioPage() {
  var works = getWorks();
  return pageHeader('🗂️', '作品集', '管理作品展示卡片') +
    '<button class="admin-add-btn" onclick="showWorkEditor()">+ 新建作品</button>' +
    '<div id="work-editor"></div>' +
    '<table class="admin-table"><tr><th>图标</th><th>标题</th><th>描述</th><th>操作</th></tr>' +
    works.map(function (w, i) {
      return '<tr><td>' + w.icon + '</td><td>' + esc(w.title) + '</td><td>' + esc(w.desc) + '</td><td><button class="admin-table-btn edit" onclick="showWorkEditor(' + i + ')">编辑</button><button class="admin-table-btn del" onclick="delWork(' + i + ')">删除</button></td></tr>';
    }).join('') + '</table>';
}
function bindPortfolio() {}
function showWorkEditor(idx) {
  var works = getWorks();
  var w = idx != null ? works[idx] : { icon: '🎨', title: '', desc: '' };
  document.getElementById('work-editor').innerHTML =
    '<div style="background:#f5f5f5;padding:16px;border-radius:4px;margin-bottom:16px;">' +
    '<div class="admin-form-group"><label class="admin-label">图标（emoji）</label><input class="admin-input" id="work-icon" value="' + esc(w.icon) + '" style="max-width:100px;"></div>' +
    '<div class="admin-form-group"><label class="admin-label">标题</label><input class="admin-input" id="work-title" value="' + esc(w.title) + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">描述</label><input class="admin-input" id="work-desc" value="' + esc(w.desc) + '"></div>' +
    '<button class="admin-save-btn" onclick="saveWork(' + (idx != null ? idx : -1) + ')">保存</button>' +
    '<button class="admin-cancel-btn" onclick="document.getElementById(\'work-editor\').innerHTML=\'\'">取消</button></div>';
}
function saveWork(idx) {
  var works = getWorks();
  var w = { icon: val('work-icon'), title: val('work-title'), desc: val('work-desc') };
  if (idx >= 0) { works[idx] = w; } else { works.push(w); }
  localStorage.setItem('portfolio_items', JSON.stringify(works));
  renderContent();
}
function delWork(idx) { if (!confirm('确定删除？')) return; var works = getWorks(); works.splice(idx, 1); localStorage.setItem('portfolio_items', JSON.stringify(works)); renderContent(); }

// ================================================
// 留言板管理
// ================================================
function renderChatboxPage() {
  var msgs = JSON.parse(localStorage.getItem('chatbox') || '[]');
  return pageHeader('💬', '留言板', '查看和删除访客留言（共 ' + msgs.length + ' 条）') +
    (msgs.length === 0 ? '<p style="color:#999;font-size:13px;">暂无留言</p>' :
    msgs.map(function (m, i) {
      return '<div class="admin-msg-item"><div class="admin-msg-name">' + esc(m.name) + '<span class="admin-msg-time">' + esc(m.time) + '</span></div><div class="admin-msg-text">' + esc(m.message) + '</div><div class="admin-msg-actions"><button class="admin-table-btn del" onclick="delMsg(' + i + ')">删除</button></div></div>';
    }).join(''));
}
function bindChatbox() {}
function delMsg(idx) { var msgs = JSON.parse(localStorage.getItem('chatbox') || '[]'); msgs.splice(idx, 1); localStorage.setItem('chatbox', JSON.stringify(msgs)); renderContent(); }

// ================================================
// 联系设置（友情链接）
// ================================================
function renderLinksPage() {
  var links = getLinks();
  return pageHeader('📬', '联系设置', '管理友情链接') +
    '<button class="admin-add-btn" onclick="showLinkEditor()">+ 新增链接</button>' +
    '<div id="link-editor"></div>' +
    '<table class="admin-table"><tr><th>图标</th><th>名称</th><th>描述</th><th>URL</th><th>操作</th></tr>' +
    links.map(function (l, i) {
      return '<tr><td>' + l.icon + '</td><td>' + esc(l.name) + '</td><td>' + esc(l.desc) + '</td><td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;">' + esc(l.url) + '</td><td><button class="admin-table-btn edit" onclick="showLinkEditor(' + i + ')">编辑</button><button class="admin-table-btn del" onclick="delLink(' + i + ')">删除</button></td></tr>';
    }).join('') + '</table>';
}
function bindLinks() {}
function showLinkEditor(idx) {
  var links = getLinks();
  var l = idx != null ? links[idx] : { icon: '🔗', name: '', desc: '', url: '' };
  document.getElementById('link-editor').innerHTML =
    '<div style="background:#f5f5f5;padding:16px;border-radius:4px;margin-bottom:16px;">' +
    '<div class="admin-form-group"><label class="admin-label">图标（emoji）</label><input class="admin-input" id="link-icon" value="' + esc(l.icon) + '" style="max-width:100px;"></div>' +
    '<div class="admin-form-group"><label class="admin-label">名称</label><input class="admin-input" id="link-name" value="' + esc(l.name) + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">描述</label><input class="admin-input" id="link-desc" value="' + esc(l.desc) + '"></div>' +
    '<div class="admin-form-group"><label class="admin-label">URL</label><input class="admin-input" id="link-url" value="' + esc(l.url) + '"></div>' +
    '<button class="admin-save-btn" onclick="saveLink(' + (idx != null ? idx : -1) + ')">保存</button>' +
    '<button class="admin-cancel-btn" onclick="document.getElementById(\'link-editor\').innerHTML=\'\'">取消</button></div>';
}
function saveLink(idx) {
  var links = getLinks();
  var l = { icon: val('link-icon'), name: val('link-name'), desc: val('link-desc'), url: val('link-url') };
  if (idx >= 0) { links[idx] = l; } else { links.push(l); }
  localStorage.setItem('links_config', JSON.stringify(links));
  renderContent();
}
function delLink(idx) { if (!confirm('确定删除？')) return; var links = getLinks(); links.splice(idx, 1); localStorage.setItem('links_config', JSON.stringify(links)); renderContent(); }

// ================================================
// 桌宠管理
// ================================================
function renderPetsPage() {
  var pets = getPets();
  return pageHeader('🐾', '桌宠管理', '管理桌面宠物（共 ' + pets.length + ' 个）') +
    '<div class="admin-notice">桌宠素材来自 MoeKernel_Desktop 项目的真实 GIF/PNG 精灵图。</div>' +
    '<table class="admin-table"><tr><th>ID</th><th>图标</th><th>精灵图</th><th>尺寸</th><th>操作</th></tr>' +
    pets.map(function (p, i) {
      return '<tr><td>' + esc(p.id) + '</td><td><img src="' + p.iconSrc + '" style="width:24px;height:24px;"></td><td><img src="' + p.petSrc + '" style="width:40px;height:40px;object-fit:contain;"></td><td>' + p.size + 'px</td><td><button class="admin-table-btn del" onclick="delPet(' + i + ')">删除</button></td></tr>';
    }).join('') + '</table>';
}
function bindPets() {}
function delPet(idx) { if (!confirm('确定删除这个桌宠？')) return; var pets = getPets(); pets.splice(idx, 1); localStorage.setItem('pets_config', JSON.stringify(pets)); renderContent(); }

// ================================================
// 数据存取工具
// ================================================
function getSettings() { return JSON.parse(localStorage.getItem('site_settings') || '{}'); }
function saveSettings(s) { localStorage.setItem('site_settings', JSON.stringify(s)); }
function getPosts() { return JSON.parse(localStorage.getItem('blog_posts') || '[]'); }
function getAbout() { return JSON.parse(localStorage.getItem('about_config') || '{"name":"毛地张","title":"Software Developer","location":"null","content":"","skills":"HTML/CSS, JavaScript, 复古设计"}'); }
function getWorks() { return JSON.parse(localStorage.getItem('portfolio_items') || '[]'); }
function getLinks() { return JSON.parse(localStorage.getItem('links_config') || '[]'); }
function getPets() { return JSON.parse(localStorage.getItem('pets_config') || JSON.stringify([{ id: 'pet1', iconSrc: 'assets/pets/avatars/1.png', petSrc: 'assets/pets/sprites/1.gif', size: 150 }, { id: 'pet2', iconSrc: 'assets/pets/avatars/2.png', petSrc: 'assets/pets/sprites/5.png', size: 120 }])); }

function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }
function esc(s) { if (!s) return ''; return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
