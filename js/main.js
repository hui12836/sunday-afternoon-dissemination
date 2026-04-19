/* =============================================
   MAIN.JS — 全站互動邏輯
   01 漢堡選單  02 Reveal
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

/* ---- 02 Web Share API + 複製連結 fallback + Toast ---- */
(function () {
  var shareBtns = document.querySelectorAll('.do-share-btn, .ft-share-btn');
  var toast = document.getElementById('share-toast');
  if (!shareBtns.length) return;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2500);
  }

  function copyFallback() {
    var url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        showToast('連結已複製');
      }).catch(function () {
        showToast('請手動複製連結');
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = url;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showToast('連結已複製'); }
      catch (e) { showToast('請手動複製連結'); }
      document.body.removeChild(ta);
    }
  }

  function doShare() {
    if (navigator.share) {
      navigator.share({
        title: '什麼是臉部平權？',
        text: '每 5 人就有 1 人因外貌受到不公平的對待。1 分鐘看懂臉部平權。',
        url: window.location.href
      }).catch(function () {});
    } else {
      copyFallback();
    }
  }

  shareBtns.forEach(function (btn) { btn.addEventListener('click', doShare); });
})();

/* ---- 03 Scroll Reveal（IntersectionObserver） ---- */
document.querySelectorAll('.reveal').forEach(function (el) {
  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 }).observe(el);
});
