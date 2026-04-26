# index.html 程式碼審查報告

> 工具：`vercel-react-best-practices` + `web-design-guidelines` skill
> 審查日期：2026-04-26
> 審查檔案：`index.html`

---

## 前提說明

此檔案為**純靜態 HTML**，非 Next.js / React 元件，因此：

| 規則類別 | 適用？ | 原因 |
|---|---|---|
| `async-*`（Async Waterfall） | ❌ 不適用 | 無任何 `await` / `fetch` / 資料請求 |
| `rerender-*`（不必要 Re-render） | ❌ 不適用 | 無 React 狀態、Hook、元件 |
| `rendering-*` / `bundle-*` 效能規則 | ✅ 適用 | HTML 層級的效能問題 |
| Web Interface Guidelines（對比度、無障礙、互動） | ✅ 適用 | 通用 HTML/CSS/UX 規則 |

---

## 第一部分：效能問題
> 來源：`vercel-react-best-practices` skill

---

### 🔴 問題 1 — 未填的佔位符（部署前 Bug）

**位置：** 第 14、15、23 行

**現況（有問題的程式碼）：**

```html
<!-- 這兩個從來沒被替換 -->
<meta property="og:image"  content="{{OG_IMAGE_URL}}" />
<meta property="og:url"    content="https://your-domain.netlify.app/" />
<meta name="twitter:image" content="{{OG_IMAGE_URL}}" />
<link rel="canonical"      href="https://your-domain.netlify.app/" />
```

**影響：**
- FB / LINE / Twitter 分享時**沒有預覽圖**
- SEO canonical 指向錯誤網域，可能影響搜尋排名

**修正後：**

```html
<meta property="og:image"  content="https://你的實際網域/assets/og-cover.jpg" />
<meta property="og:url"    content="https://你的實際網域/" />
<meta name="twitter:image" content="https://你的實際網域/assets/og-cover.jpg" />
<link rel="canonical"      href="https://你的實際網域/" />
```

---

### 🟠 問題 2 — 缺少 `preconnect` 字型預連線

**位置：** 第 44 行 ｜ 規則 ID：`rendering-resource-hints`（影響程度：HIGH）

**現況（有問題的程式碼）：**

```html
<!-- 直接 link 字型，瀏覽器要先 DNS → TCP → TLS 才能開始下載 -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;900&display=swap" rel="stylesheet">
```

**影響：**
- Google Fonts 下載前需額外花費 100–300ms 建立連線
- 延遲 FCP（First Contentful Paint），使用者感受到頁面「慢」

**修正後：**

```html
<!-- 提前建立連線，字型下載更快 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;900&display=swap" rel="stylesheet">
```

---

### 🟠 問題 3 — `<script>` 缺少 `defer`

**位置：** 第 665 行 ｜ 規則 ID：`rendering-script-defer-async`（影響程度：HIGH）

**現況（有問題的程式碼）：**

```html
<!-- 雖然在 </body> 前，但沒有 defer -->
<script src="js/main.js"></script>
```

**影響：**
- 缺少 `defer` 時，瀏覽器仍會暫停 HTML 解析並等待執行
- 拖慢 TTI（Time to Interactive）

**修正後：**

```html
<!-- defer：下載與 HTML 解析並行，DOM ready 後才執行，順序保證 -->
<script src="js/main.js" defer></script>
```

> **`defer` vs `async` 選哪個？**
> - `defer`：下載與解析並行，DOM 完成後依序執行 → 適合依賴 DOM 的腳本（如 `main.js`）
> - `async`：下載完立即執行，不保證順序 → 適合獨立的第三方腳本（如 Google Analytics）

---

## 第二部分：設計與無障礙問題
> 來源：`web-design-guidelines` skill（Web Interface Guidelines）

---

### 🎨 對比度（Contrast）

#### 🟠 問題 4 — 故事卡圖片上的文字疊層無遮罩

**位置：** 第 229–256 行

**現況（有問題的程式碼）：**

```html
<article class="story-card" role="button">
  <img src="assets/frame_0000.jpg" class="story-img">
  <div class="story-body"> <!-- 文字直接疊在照片上，無遮罩 -->
    <h3 class="story-card-title">她的履歷沒問題，問題是她的臉</h3>
    <p class="story-harm">...</p>
  </div>
</article>
```

**影響：**
- 照片背景顏色不固定，當背景偏亮時，深色文字對比度容易低於 WCAG AA 要求的 **4.5:1**

**修正後（CSS）：**

```css
.story-card {
  position: relative;
}
.story-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%);
  border-radius: inherit;
  pointer-events: none;
}
.story-body {
  position: relative;
  z-index: 1;
  color: #fff;
}
```

---

#### 🟡 問題 5 — 次要文字對比度待驗證

**位置：** 第 72、111、136、235、245、254、322 行

以下元素通常設計為「弱化色」（灰色），需確認前景色對背景色的對比度 ≥ **4.5:1**（WCAG AA）：

| 行號 | 元素 | 說明 |
|---|---|---|
| 72 | `.hero-credibility` | 頁面頂部免責聲明小字 |
| 111, 136 | `.acc-source` | 資料來源文字 |
| 235, 245, 254 | `.story-cta-hint` | 「點擊閱讀完整故事 →」提示文字 |
| 322, 382, 443 | `.overlay-disclaimer` | Overlay 底部免責聲明 |

**建議：** 使用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 逐一驗證。

---

### 🔤 字體大小（Typography）

#### 🟡 問題 6 — `<small>` 在行動選單中可能過小

**位置：** 第 63–64 行

**現況（有問題的程式碼）：**

```html
<a href="#cards" onclick="toggleMenu()">
  先看八大重點
  <small class="ms">從 8 個問題開始了解臉部平權</small>
</a>
```

**影響：**
- `<small>` 預設渲染為父元素的 80%，若父字體為 16px 則為 12.8px；若父字體更小，可能低於 **12px** 可讀下限

**修正後（CSS）：**

```css
.ms {
  font-size: max(0.75rem, 12px); /* 至少 12px */
  display: block;
  line-height: 1.4;
}
```

---

#### 🟡 問題 7 — Overlay 免責聲明無最小字體保護

**位置：** 第 322、382、443 行

**現況：**
```html
<p class="overlay-disclaimer">以下為根據真實調查數據改寫的情境描寫，非特定真人事件</p>
```

**影響：**
- 若字體設定過小（< 12px），iOS Safari 可能觸發**自動字體放大**，破壞版面

**修正後（CSS）：**
```css
.overlay-disclaimer {
  font-size: max(0.75rem, 12px);
}
```

---

### 👆 按鈕可點性（Button Interaction）

#### 🔴 問題 8 — `role="button"` 缺少鍵盤事件處理器

**位置：** 第 229、239、249 行

**現況（有問題的程式碼）：**

```html
<!-- ❌ 三張卡片都有同樣問題，無 onkeydown / onkeyup -->
<article class="story-card"
  data-overlay="overlay-1"
  role="button"
  tabindex="0"
  aria-label="展開求職現場故事">
</article>
```

**影響：**
- 原生 `<button>` 自動響應 **Enter** 和 **Space** 鍵；`role="button"` 加在非 button 元素上時，鍵盤使用者**完全無法開啟 Overlay**
- 違反 WCAG 2.1 SC 2.1.1（鍵盤可操作）

**修正後（`main.js`）：**

```js
document.querySelectorAll('.story-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openOverlay(card.dataset.overlay)
    }
  })
})
```

---

#### 🟠 問題 9 — 故事卡圖片缺少明確尺寸，造成版面位移（CLS）

**位置：** 第 230、240、250 行

**現況（有問題的程式碼）：**

```html
<!-- ❌ 缺少 width / height -->
<img src="assets/frame_0000.jpg"
  alt="求職現場：..."
  class="story-img"
  loading="lazy">
```

**影響：**
- 圖片載入後推擠文字，**CLS（版面位移分數）上升**，影響 Core Web Vitals

**修正後：**

```html
<img src="assets/frame_0000.jpg"
  alt="求職現場：顏面傷者在職場遭遇外貌歧視的情境"
  class="story-img"
  width="800" height="533"
  loading="lazy">
```

> 數字依實際圖片尺寸填入，維持正確比例即可。

---

#### 🟡 問題 10 — Overlay 關閉按鈕觸控目標需確認

**位置：** 第 269、329、389 行

```html
<button class="overlay-close" aria-label="關閉">✕</button>
```

`aria-label` 正確 ✅，但 `✕` 字元視覺偏小，需確認 CSS 中 `.overlay-close` 的 `width` + `height` + `padding` 加總 ≥ **44×44px**（Apple HIG / WCAG 2.5.5）。

---

### ⚠️ 錯誤訊息可見性（Error / Status Visibility）

#### 🟠 問題 11 — Toast 初始狀態可能被螢幕閱讀器讀到

**位置：** 第 583 行

**現況（有問題的程式碼）：**

```html
<!-- ❌ DOM 中始終有文字，部分螢幕閱讀器會在頁面載入時朗讀「連結已複製」 -->
<div class="share-toast" id="share-toast"
  role="status"
  aria-live="polite"
  aria-atomic="true">連結已複製</div>
```

**修正後：** 初始為空，由 JS 填入：

```html
<!-- ✅ 初始為空 -->
<div class="share-toast" id="share-toast"
  role="status"
  aria-live="polite"
  aria-atomic="true"></div>
```

```js
const toast = document.getElementById('share-toast')
toast.textContent = '連結已複製'
setTimeout(() => { toast.textContent = '' }, 3000)
```

---

#### 🔴 問題 12 — 分享失敗時無錯誤回饋

**位置：** 第 569、601 行

**現況：**
- 目前 Toast 只有成功訊息「連結已複製」
- Clipboard API 在 HTTP 環境、使用者拒絕權限、舊瀏覽器時會**靜默失敗**，使用者完全不知道發生了什麼

**修正後（`main.js`）：**

```js
async function handleShare() {
  const toast = document.getElementById('share-toast')
  try {
    await navigator.clipboard.writeText(location.href)
    toast.textContent = '連結已複製 ✓'
  } catch {
    toast.textContent = '複製失敗，請手動複製網址'
  }
  setTimeout(() => { toast.textContent = '' }, 3000)
}
```

---

## 修正優先序總覽

| 優先 | # | 問題 | 規則 / 來源 | 行號 | 預估工時 |
|---|---|---|---|---|---|
| 🔴 立即修 | 1 | `{{OG_IMAGE_URL}}` 與 domain 佔位符未替換 | 部署前必填 | 14, 15, 23 | 5 分鐘 |
| 🔴 立即修 | 8 | `role="button"` 缺鍵盤事件，鍵盤用戶無法操作 | WCAG 2.1.1 | 229, 239, 249 | 15 分鐘 |
| 🔴 立即修 | 12 | 分享失敗無錯誤回饋 | Content & Copy | 569, 601 | 10 分鐘 |
| 🟠 部署前 | 2 | 缺 `preconnect` 字型預連線 | `rendering-resource-hints` | 44 | 2 分鐘 |
| 🟠 部署前 | 3 | `<script>` 缺 `defer` | `rendering-script-defer-async` | 665 | 1 分鐘 |
| 🟠 部署前 | 4 | 故事卡文字疊圖無遮罩，對比度不足 | Contrast / WCAG AA | 229–256 | 20 分鐘 |
| 🟠 部署前 | 9 | 圖片缺 `width` / `height`，CLS 上升 | Images / Performance | 230, 240, 250 | 5 分鐘 |
| 🟠 部署前 | 11 | Toast 初始文字被螢幕閱讀器讀出 | Accessibility | 583 | 5 分鐘 |
| 🟡 待查 | 5 | 次要文字對比度需 CSS 驗證 | Contrast / WCAG AA | 72, 111, 136… | 10 分鐘 |
| 🟡 待查 | 6 | `<small>` 字體可能低於 12px | Typography | 63–64 | 5 分鐘 |
| 🟡 待查 | 7 | Overlay 免責聲明無最小字體保護 | Typography | 322, 382, 443 | 5 分鐘 |
| 🟡 待查 | 10 | Overlay 關閉按鈕觸控目標需確認 ≥ 44px | Touch / WCAG 2.5.5 | 269, 329, 389 | 5 分鐘 |

---

## 做得好的地方

| 項目 | 說明 |
|---|---|
| ✅ 圖片全部有 `loading="lazy"` | 延遲載入畫面外圖片，節省初始頻寬 |
| ✅ 外部連結全部有 `rel="noopener noreferrer"` | 防止 `target="_blank"` 安全漏洞 |
| ✅ 語意化標籤使用完整 | `<nav>` `<main>` `<section>` `<article>` `<footer>` 均正確使用 |
| ✅ ARIA 標籤覆蓋完整 | `aria-label`、`aria-hidden`、`role="dialog"` 均正確標注 |
| ✅ JSON-LD 結構化資料 | 有助於 Google 搜尋理解頁面內容 |
| ✅ Toast 有 `aria-live="polite"` + `aria-atomic="true"` | 狀態更新能被螢幕閱讀器正確通知 |
| ✅ Overlay 有 `role="dialog"` + `aria-modal="true"` | 符合無障礙對話框規範 |
| ✅ 漢堡選單有 `aria-expanded` + `aria-controls` | 狀態管理完整 |
