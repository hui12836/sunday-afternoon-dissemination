/* =============================================
   MAIN.JS — 全站互動邏輯
   01 漢堡選單  02 Reveal
   ============================================= */

/* 確保每次進入頁面都從最頂端開始 */
if (history.scrollRestoration) history.scrollRestoration = 'manual';
if (!window.location.hash) window.scrollTo(0, 0);

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
    setTimeout(function () {
      toast.classList.remove('show');
      toast.textContent = '';
    }, 2500);
  }

  function copyFallback() {
    var url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        showToast('連結已複製 ✓');
      }).catch(function () {
        showToast('複製失敗，請手動複製網址');
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = url;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showToast('連結已複製 ✓'); }
      catch (e) { showToast('複製失敗，請手動複製網址'); }
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

/* ---- 04 Story Overlay ---- */
(function () {
  var lastTrigger = null;

  function getFocusable(el) {
    return Array.from(el.querySelectorAll(
      'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )).filter(function (n) { return !n.closest('[hidden]'); });
  }

  function trapFocus(ol, e) {
    var focusable = getFocusable(ol);
    if (!focusable.length) return;
    var first = focusable[0];
    var last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }

  function openOverlay(id, trigger) {
    var ol = document.getElementById(id);
    if (!ol) return;
    lastTrigger = trigger || null;
    ol.classList.add('open');
    document.body.style.overflow = 'hidden';
    var closeBtn = ol.querySelector('.overlay-close');
    if (closeBtn) closeBtn.focus();
    ol._trapHandler = function (e) { if (e.key === 'Tab') trapFocus(ol, e); };
    ol.addEventListener('keydown', ol._trapHandler);
  }

  function closeOverlay(ol) {
    ol.classList.remove('open');
    document.body.style.overflow = '';
    if (ol._trapHandler) { ol.removeEventListener('keydown', ol._trapHandler); delete ol._trapHandler; }
    if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
  }

  document.querySelectorAll('.story-overlay').forEach(function (ol) {
    ol.addEventListener('click', function (e) {
      if (e.target === ol) closeOverlay(ol);
    });
    var closeBtn = ol.querySelector('.overlay-close');
    if (closeBtn) closeBtn.addEventListener('click', function () { closeOverlay(ol); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.story-overlay.open').forEach(closeOverlay);
    }
  });

  document.querySelectorAll('[data-overlay]').forEach(function (card) {
    card.addEventListener('click', function () {
      openOverlay(card.getAttribute('data-overlay'), card);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openOverlay(card.getAttribute('data-overlay'), card);
      }
    });
  });
})();

/* ---- 05 Poll（單題投票） ---- */
(function () {
  var POLL_KEY    = 'sunshine_poll_voted';
  var COUNTS_KEY  = 'sunshine_poll_counts';
  var BASE_COUNTS = { know: 18, heard: 47, new: 35 };
  var LABELS      = { know: '早就知道', heard: '知道但沒深入', new: '首次了解' };
  var OPTIONS     = ['know', 'heard', 'new'];
  var SVG_NS      = 'http://www.w3.org/2000/svg';

  function getTotal(counts) {
    return OPTIONS.reduce(function (s, k) { return s + (counts[k] || 0); }, 0);
  }

  function animateCount(el, target, duration) {
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.round(p * target) + '%';
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function buildRingsSVG(counts, voted) {
    var total  = getTotal(counts);
    var radii  = [72, 52, 32];
    var SW     = 13;
    var SIZE   = 170;
    var CX     = SIZE / 2;
    var CY     = SIZE / 2;

    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + SIZE + ' ' + SIZE);
    svg.setAttribute('width',   SIZE);
    svg.setAttribute('height',  SIZE);

    OPTIONS.forEach(function (key, i) {
      var r     = radii[i];
      var circ  = 2 * Math.PI * r;
      var pct   = total > 0 ? counts[key] / total : 0;
      var color = key === voted ? '#C97B1E' : '#DDD3C6';

      var bg = document.createElementNS(SVG_NS, 'circle');
      bg.setAttribute('cx', CX); bg.setAttribute('cy', CY); bg.setAttribute('r', r);
      bg.setAttribute('fill', 'none');
      bg.setAttribute('stroke', '#EDE6DA');
      bg.setAttribute('stroke-width', SW);
      svg.appendChild(bg);

      var arc = document.createElementNS(SVG_NS, 'circle');
      arc.setAttribute('cx', CX); arc.setAttribute('cy', CY); arc.setAttribute('r', r);
      arc.setAttribute('fill', 'none');
      arc.setAttribute('stroke', color);
      arc.setAttribute('stroke-width', SW);
      arc.setAttribute('stroke-linecap', 'round');
      arc.setAttribute('transform', 'rotate(-90 ' + CX + ' ' + CY + ')');
      arc.style.strokeDasharray  = String(circ);
      arc.style.strokeDashoffset = String(circ);
      arc.style.transition = 'stroke-dashoffset 800ms ease-out ' + (i * 120) + 'ms';
      svg.appendChild(arc);

      var targetOffset = circ * (1 - pct);
      setTimeout(function (a, t) {
        return function () { a.style.strokeDashoffset = String(t); };
      }(arc, targetOffset), 80 + i * 120);
    });

    /* 中央顯示投票選項的百分比 */
    var votedPct = total > 0 ? Math.round(counts[voted] / total * 100) : 0;
    var txtBg = document.createElementNS(SVG_NS, 'circle');
    txtBg.setAttribute('cx', CX); txtBg.setAttribute('cy', CY); txtBg.setAttribute('r', 18);
    txtBg.setAttribute('fill', '#FCF8F3');
    svg.appendChild(txtBg);

    var txt = document.createElementNS(SVG_NS, 'text');
    txt.setAttribute('x', CX); txt.setAttribute('y', CY);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('dominant-baseline', 'central');
    txt.setAttribute('font-size', '13');
    txt.setAttribute('font-weight', '900');
    txt.setAttribute('fill', '#C97B1E');
    txt.setAttribute('font-family', 'Noto Sans TC, sans-serif');
    txt.textContent = votedPct + '%';
    svg.appendChild(txt);

    return svg;
  }

  function buildLegend(counts, voted) {
    var total = getTotal(counts);
    var ul = document.createElement('ul');
    ul.className = 'poll-legend';

    OPTIONS.forEach(function (key) {
      var pct = total > 0 ? Math.round(counts[key] / total * 100) : 0;
      var li  = document.createElement('li');
      li.className = 'poll-legend-item' + (key === voted ? ' poll-legend-item--voted' : '');

      var dot = document.createElement('span');
      dot.className = 'poll-legend-dot';
      dot.style.background = key === voted ? '#C97B1E' : '#DDD3C6';

      var lbl = document.createElement('span');
      lbl.className = 'poll-legend-label';
      lbl.textContent = LABELS[key];

      var num = document.createElement('span');
      num.className = 'poll-legend-pct';
      num.textContent = '0%';

      li.appendChild(dot); li.appendChild(lbl); li.appendChild(num);
      ul.appendChild(li);

      setTimeout(function (el, t) {
        return function () { animateCount(el, t, 600); };
      }(num, pct), 150);
    });
    return ul;
  }

  function showResult(counts, voted) {
    var resultEl = document.getElementById('poll-result');
    if (!resultEl) return;
    var ringsEl = resultEl.querySelector('.poll-rings');
    if (ringsEl) {
      ringsEl.innerHTML = '';
      ringsEl.appendChild(buildRingsSVG(counts, voted));
      ringsEl.appendChild(buildLegend(counts, voted));
    }
    resultEl.hidden = false;
    resultEl.style.opacity = '0';
    setTimeout(function () {
      resultEl.style.transition = 'opacity 400ms';
      resultEl.style.opacity    = '1';
    }, 30);
  }

  function applyVoteUI(voted) {
    document.querySelectorAll('.poll-btn').forEach(function (btn) {
      btn.disabled = true;
      if (btn.getAttribute('data-value') === voted) {
        btn.classList.add('poll-btn--selected');
      } else {
        btn.classList.add('poll-btn--dimmed');
      }
    });
  }

  var voted  = localStorage.getItem(POLL_KEY);
  var counts = JSON.parse(localStorage.getItem(COUNTS_KEY) || 'null') || Object.assign({}, BASE_COUNTS);

  if (voted) {
    applyVoteUI(voted);
    showResult(counts, voted);
  } else {
    document.querySelectorAll('.poll-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val     = btn.getAttribute('data-value');
        var updated = JSON.parse(localStorage.getItem(COUNTS_KEY) || 'null') || Object.assign({}, BASE_COUNTS);
        updated[val] = (updated[val] || 0) + 1;
        localStorage.setItem(POLL_KEY,   val);
        localStorage.setItem(COUNTS_KEY, JSON.stringify(updated));
        applyVoteUI(val);
        showResult(updated, val);
      });
    });
  }
})();

/* ────────────────────────────────────────
   Section 06 — Scenario IIFE（模組二：情境選擇）
   ──────────────────────────────────────── */
(function () {
  'use strict';

  var scenarios = [
    {
      situation: '通勤的捷運上，對面坐著一個陌生人，<strong>臉上有明顯的燒傷痕跡</strong>，你的第一反應是',
      options: ['忍不住多瞄幾眼', '自然移開視線', '假裝在看手機'],
      feedback: ['視線停太久，對方其實感覺得到', '自然移開，不特別盯著，就已經是一種尊重']
    },
    {
      situation: '走在路上，身邊的孩子突然指著說：<strong>「那個人的臉怎麼了？」</strong>你會',
      options: ['輕聲帶走，事後說明', '假裝沒聽到', '馬上喝止孩子'],
      feedback: ['孩子好奇很正常，重點是大人怎麼接', '輕聲帶開、事後說明，不讓場面難堪，就夠了']
    },
    {
      situation: '吃飯時，朋友模仿某人的<strong>外貌開起玩笑</strong>，大家都笑了，你會',
      options: ['跟著附和', '沉默不笑', '輕聲說一句'],
      feedback: ['不跟著笑，已經是一種立場', '一句「欸，這樣說好嗎」不需要大聲，但有人在意就不一樣']
    }
  ];

  var currentIndex = 0;
  var stage      = document.querySelector('.scenario-stage');
  var doneEl     = document.querySelector('.scenario-done');
  var counterEl  = document.querySelector('.scenario-counter');
  var fillEl     = document.querySelector('.scenario-bar-fill');
  var progressEl = document.querySelector('.scenario-progress');

  if (!stage || !doneEl) return;

  function updateProgress(idx) {
    var n     = idx + 1;
    var total = scenarios.length;
    counterEl.textContent = '第 ' + n + ' 題 / 共 ' + total + ' 題';
    fillEl.style.width    = Math.round(n / total * 100) + '%';
    progressEl.setAttribute('aria-valuenow', String(n));
    progressEl.setAttribute('aria-label',    '第 ' + n + ' 題 / 共 ' + total + ' 題');
  }

  function buildQuestion(idx) {
    var sc   = scenarios[idx];
    var wrap = document.createElement('div');
    wrap.className = 'scenario-q';

    var sit = document.createElement('p');
    sit.className   = 'scenario-situation';
    sit.innerHTML = sc.situation;

    var opts = document.createElement('div');
    opts.className = 'scenario-options';
    opts.setAttribute('role',       'group');
    opts.setAttribute('aria-label', '選項');

    var fb = document.createElement('div');
    fb.className = 'scenario-feedback';
    sc.feedback.forEach(function (line) {
      var p = document.createElement('p');
      p.textContent = line;
      fb.appendChild(p);
    });

    sc.options.forEach(function (text) {
      var btn = document.createElement('button');
      btn.className   = 'scenario-btn';
      btn.type        = 'button';
      btn.textContent = text;
      btn.addEventListener('click', function () { onSelect(btn, opts, fb, idx); });
      opts.appendChild(btn);
    });

    wrap.appendChild(sit);
    wrap.appendChild(opts);
    wrap.appendChild(fb);
    return wrap;
  }

  function onSelect(btn, optsEl, fb, qIdx) {
    optsEl.querySelectorAll('.scenario-btn').forEach(function (b) {
      b.disabled = true;
      b.classList.add(b === btn ? 'scn-selected' : 'scn-dimmed');
    });
    setTimeout(function () {
      fb.classList.add('open');
      var isLast = (qIdx === scenarios.length - 1);
      setTimeout(function () { appendNextBtn(fb.parentNode, isLast); }, 200);
    }, 300);
  }

  function appendNextBtn(wrap, isLast) {
    var btn = document.createElement('button');
    btn.className   = 'scenario-next';
    btn.type        = 'button';
    btn.textContent = isLast ? '看結果 →' : '下一題 →';
    btn.addEventListener('click', function () { goNext(); });
    wrap.appendChild(btn);
  }

  function showDone() {
    if (progressEl) progressEl.hidden = true;
    doneEl.hidden        = false;
    doneEl.style.opacity = '0';
    setTimeout(function () {
      doneEl.style.transition = 'opacity 400ms';
      doneEl.style.opacity    = '1';
    }, 30);
    doneEl.querySelectorAll('.scenario-done-checks li').forEach(function (li, i) {
      setTimeout(function () { li.classList.add('shown'); }, 200 + i * 150);
    });
  }

  function goNext() {
    currentIndex++;
    var old = stage.querySelector('.scenario-q');

    if (currentIndex >= scenarios.length) {
      if (old) {
        old.style.transition = 'transform 250ms ease, opacity 250ms ease';
        old.style.transform  = 'translateX(-40px)';
        old.style.opacity    = '0';
        setTimeout(function () { stage.innerHTML = ''; showDone(); }, 260);
      } else {
        showDone();
      }
      return;
    }

    var next = buildQuestion(currentIndex);
    next.style.opacity   = '0';
    next.style.transform = 'translateX(40px)';

    if (old) {
      stage.style.minHeight = old.offsetHeight + 'px';
      old.style.position    = 'absolute';
      old.style.width       = '100%';
      old.style.left        = '0';
      old.style.top         = '0';
      old.style.transition  = 'transform 250ms ease, opacity 250ms ease';
      old.style.transform   = 'translateX(-40px)';
      old.style.opacity     = '0';
      stage.appendChild(next);
      updateProgress(currentIndex);
      setTimeout(function () {
        old.remove();
        stage.style.minHeight = '';
        next.style.transition = 'transform 250ms ease, opacity 250ms ease';
        next.style.transform  = 'translateX(0)';
        next.style.opacity    = '1';
      }, 260);
    } else {
      stage.appendChild(next);
      updateProgress(currentIndex);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          next.style.transition = 'transform 250ms ease, opacity 250ms ease';
          next.style.transform  = 'translateX(0)';
          next.style.opacity    = '1';
        });
      });
    }
  }

  stage.appendChild(buildQuestion(0));
  updateProgress(0);
})();

/* ============================================================
   Section 07 — Share Form IIFE（匿名分享）
============================================================ */
(function () {
  var wrap     = document.getElementById('share-form-wrap');
  var thanks   = document.getElementById('share-thanks');
  var textarea = document.getElementById('share-text');
  var counter  = document.getElementById('char-count');
  var submit   = document.getElementById('share-submit');
  var form     = wrap ? wrap.querySelector('form') : null;

  if (!wrap || !thanks || !textarea || !counter || !submit || !form) return;

  var MAX = 200;
  var WARN_THRESHOLD = 30;

  textarea.addEventListener('input', function () {
    var len = textarea.value.length;
    counter.textContent = len + ' / ' + MAX;
    if (MAX - len < WARN_THRESHOLD) {
      counter.classList.add('warn');
    } else {
      counter.classList.remove('warn');
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    submit.textContent = '送出中…';
    submit.disabled = true;

    var data = new FormData(form);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    })
      .catch(function () {})
      .finally(function () {
        showThanks();
      });
  });

  function showThanks() {
    wrap.classList.add('fading');
    setTimeout(function () {
      wrap.hidden = true;
      thanks.hidden = false;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          thanks.classList.add('visible');
        });
      });
    }, 300);
  }
})();

// ── Section 08 — Feedback Form ──────────────────────────────────────────────
(function () {
  var openBtn   = document.getElementById('open-feedback');
  var formWrap  = document.getElementById('feedback-form-wrap');
  var form      = formWrap && formWrap.querySelector('form');
  var submitBtn = document.getElementById('feedback-submit');
  var thanksEl  = document.getElementById('feedback-thanks');
  var teaser    = document.getElementById('feedback-teaser');

  if (!openBtn || !formWrap || !form || !submitBtn || !thanksEl || !teaser) return;

  // 展開表單
  openBtn.addEventListener('click', function () {
    formWrap.classList.add('expanded');
    formWrap.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    openBtn.disabled = true;
  });

  // 題目一：radio 按鈕式（選中 → selected；其他 → dimmed）
  var optLabels = formWrap.querySelectorAll('.feedback-opt');
  optLabels.forEach(function (label) {
    label.querySelector('input[type="radio"]').addEventListener('change', function () {
      optLabels.forEach(function (l) {
        l.classList.remove('selected');
        l.classList.add('dimmed');
      });
      label.classList.add('selected');
      label.classList.remove('dimmed');
    });
  });

  // 題目二：tag 按鈕式（scale 彈跳、背景填色）
  var tagLabels = formWrap.querySelectorAll('.feedback-tag');
  tagLabels.forEach(function (label) {
    label.querySelector('input[type="radio"]').addEventListener('change', function () {
      tagLabels.forEach(function (l) { l.classList.remove('selected'); });
      label.classList.add('selected');
    });
  });

  // 送出流程
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    submitBtn.textContent = '送出中…';
    submitBtn.disabled = true;

    var data = new FormData(form);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    })
      .catch(function () {})
      .finally(function () {
        showFeedbackThanks();
      });
  });

  function showFeedbackThanks() {
    formWrap.style.opacity = '0';
    formWrap.style.transition = 'opacity 300ms ease';
    setTimeout(function () {
      formWrap.hidden = true;
      teaser.hidden = true;
      thanksEl.hidden = false;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          thanksEl.classList.add('visible');
        });
      });
    }, 300);
  }
}());
