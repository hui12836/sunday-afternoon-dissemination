/* =============================================
   MAIN.JS — 全站互動邏輯
   01 漢堡選單  02 詳情頁  03 滑動關閉  04 Reveal
   ============================================= */

/* ---- 01 漢堡選單 ---- */
function toggleMenu() {
  var menu = document.getElementById('m');
  var btn = document.getElementById('hamburger');
  var isOpen = menu.classList.toggle('open');
  menu.setAttribute('aria-hidden', !isOpen);
  if (btn) btn.setAttribute('aria-expanded', isOpen);
  if (!isOpen && btn) btn.focus();
}

/* ---- 02 詳情頁：開啟 ---- */
var _scrollPos = 0;
var _triggerEl = null;

function openDetail(id) {
  _scrollPos = window.scrollY || window.pageYOffset;
  _triggerEl = document.activeElement;

  var prev = document.querySelector('.detail-page.open');
  if (prev) {
    prev.classList.remove('open');
    prev.setAttribute('aria-hidden', 'true');
  }

  var el = document.getElementById(id);
  el.classList.add('open');
  el.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  el.scrollTop = 0;

  /* 將焦點移至 overlay 內的關閉按鈕 */
  var closeBtn = el.querySelector('.dp-back-inner');
  if (closeBtn) closeBtn.focus();

  setupSwipe(el, id);
}

/* ---- 02 詳情頁：關閉 ---- */
function closeDetail(id) {
  var el = document.getElementById(id);
  el.style.transform = '';
  el.style.transition = 'transform .4s cubic-bezier(.4,0,.2,1)';
  el.classList.remove('open');
  el.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  window.scrollTo(0, _scrollPos);

  /* 將焦點還給觸發的卡片 */
  if (_triggerEl) { _triggerEl.focus(); _triggerEl = null; }
}

/* ---- 02 ESC 鍵關閉 overlay ---- */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    var open = document.querySelector('.detail-page.open');
    if (open) closeDetail(open.id);
  }
});

/* ---- 03 滑動關閉（向右滑 > 80px 即關閉） ---- */
function setupSwipe(el, id) {
  var startX = 0, startY = 0, dx = 0, isSwipe = false;

  el.ontouchstart = function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dx = 0; isSwipe = false;
    el.style.transition = 'none';
  };

  el.ontouchmove = function (e) {
    var mx = e.touches[0].clientX - startX;
    var my = e.touches[0].clientY - startY;
    if (!isSwipe && Math.abs(mx) > 10 && Math.abs(mx) > Math.abs(my)) {
      isSwipe = true;
    }
    if (isSwipe && mx > 0) {
      dx = mx;
      el.style.transform = 'translateX(' + dx + 'px)';
      e.preventDefault();
    }
  };

  el.ontouchend = function () {
    el.style.transition = 'transform .3s ease';
    if (dx > 80) {
      closeDetail(id);
    } else {
      el.style.transform = 'translateX(0)';
      dx = 0;
    }
  };
}

/* ---- 04 Scroll Reveal（IntersectionObserver） ---- */
document.querySelectorAll('.reveal').forEach(function (el) {
  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 }).observe(el);
});
