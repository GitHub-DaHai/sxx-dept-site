/* ============================================================
   数字与信息技术产业系 · 站点交互脚本（原生 JS，无任何依赖）
   功能：
     1. 移动端导航菜单开合
     2. 相关链接页：关键词实时筛选（站名 / 简介 / 域名）
     3. 首页新闻分类标签切换
     4. 训练体系页「打印 / 存为 PDF」按钮
     5. 页脚年份自动填充
     6. 返回顶部按钮
   ============================================================ */
(function () {
  'use strict';

  /* ── 1. 移动端导航 ─────────────────────────────────────── */
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');

  function closeNav() {
    if (!siteNav || !siteNav.classList.contains('open')) return;
    siteNav.classList.remove('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    siteNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });
    document.addEventListener('click', function (e) {
      if (!siteNav.contains(e.target) && e.target !== navToggle) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeNav();
    });
  }

  /* ── 2. 相关链接页：实时筛选 ───────────────────────────── */
  var searchInput = document.getElementById('bmSearch');
  if (searchInput) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.bookmark[data-cat]'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('section[id^="cat-"]'));
    var emptyTip = document.getElementById('bmEmpty');

    var runFilter = function () {
      var q = searchInput.value.trim().toLowerCase();
      var total = 0;

      cards.forEach(function (card) {
        var hit = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
        card.hidden = !hit;
        if (hit) total++;
      });

      groups.forEach(function (sec) {
        var visible = sec.querySelectorAll('.bookmark:not([hidden])').length;
        sec.hidden = visible === 0;
      });

      if (emptyTip) emptyTip.classList.toggle('show', total === 0);
    };

    searchInput.addEventListener('input', runFilter);
    // 回车不提交（本页无表单，避免个别浏览器行为）
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') e.preventDefault();
    });
  }

  /* ── 3. 首页新闻分类切换 ───────────────────────────────── */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs button[data-filter]'));
  if (tabs.length) {
    var newsItems = Array.prototype.slice.call(document.querySelectorAll('.news-item[data-cat]'));
    var newsEmpty = document.getElementById('newsEmpty');

    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        tabs.forEach(function (b) { b.classList.toggle('active', b === btn); });

        var shown = 0;
        newsItems.forEach(function (item) {
          var hit = f === 'all' || item.getAttribute('data-cat') === f;
          item.hidden = !hit;
          if (hit) shown++;
        });
        if (newsEmpty) newsEmpty.classList.toggle('show', shown === 0);
      });
    });
  }

  /* ── 4. 打印按钮（训练体系页） ─────────────────────────── */
  var printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }

  /* ── 5. 页脚年份 ───────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── 5. 返回顶部 ───────────────────────────────────────── */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    var onScroll = function () {
      toTop.classList.toggle('show', window.pageYOffset > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
