/* =============================================
   MAIN.JS — 全站互動邏輯
   01 漢堡選單  02 詳情頁  03 滑動關閉  04 Reveal
   ============================================= */

/* ---- 01 漢堡選單 ---- */
function toggleMenu() {
  document.getElementById('m').classList.toggle('open');
}

/* ---- 02 詳情頁：開啟 ---- */
function openDetail(id) {
  var el = document.getElementById(id);
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
  el.scrollTop = 0;
  setupSwipe(el, id);
}

/* ---- 02 詳情頁：關閉 ---- */
function closeDetail(id) {
  var el = document.getElementById(id);
  el.style.transform = '';
  el.style.transition = 'transform .4s cubic-bezier(.4,0,.2,1)';
  el.classList.remove('open');
  document.body.style.overflow = '';
}

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
