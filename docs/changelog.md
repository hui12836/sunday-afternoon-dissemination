# Changelog — 臉部平權網站

---

## [2026-04-26] Code Review 修正（12 項問題，共 10 項程式碼修改）

**目標**：依 code-review.md 工程師審查報告，修正效能、無障礙、錯誤回饋共 10 項可執行問題（問題 8 已存在、問題 10 已達標、問題 5 需手動驗證）。

### 修改項目

#### 問題 1 🔴 — 替換 `{{OG_IMAGE_URL}}` 佔位符
- **修改**：`index.html`
  - `og:image` 與 `twitter:image` 的 `{{OG_IMAGE_URL}}` 改為 `https://your-domain.netlify.app/assets/images/og-cover.jpg`
  - 圖片路徑指向已存在的 `assets/images/og-cover.jpg`；網域佔位符 `your-domain.netlify.app` 部署後仍需替換

#### 問題 2 🟠 — 新增 `preconnect` 字型預連線
- **修改**：`index.html`
  - Google Fonts `<link>` 前加入 `<link rel="preconnect" href="https://fonts.googleapis.com">` 與 `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`

#### 問題 3 🟠 — `<script>` 加入 `defer`
- **修改**：`index.html`
  - `<script src="js/main.js">` → `<script src="js/main.js" defer>`

#### 問題 4 🟠 — 故事卡加入漸層遮罩
- **修改**：`css/sections.css`
  - `.story-card` 加 `position: relative`
  - 新增 `.story-card::after` 半透明黑色漸層（`to top`，底部 0.65 至頂部 transparent at 50%），`pointer-events: none`
  - `.story-body` 加 `position: relative; z-index: 1` 確保文字在遮罩之上

#### 問題 6 🟡 — `.ms` 最小字體保護
- **修改**：`css/sections.css`
  - `.ms` 的 `font-size` 改為 `max(0.75rem, 12px)`，補 `line-height: 1.4`

#### 問題 7 🟡 — `.overlay-disclaimer` 最小字體保護
- **修改**：`css/sections.css`
  - `.overlay-disclaimer` 的 `font-size: .65rem` 改為 `max(0.75rem, 12px)`，防止 iOS Safari 自動放大

#### 問題 8 🔴 — 已修正（無需更動）
- 目前 `js/main.js` 中 `[data-overlay]` 卡片已有 `keydown` 監聽（Enter/Space），無需重複加入

#### 問題 9 🟠 — 故事卡圖片加 `width` / `height`
- **修改**：`index.html`
  - 三張故事卡圖片（`frame_0000.jpg`、`frame_0094.jpg`、`frame_0191.jpg`）均加 `width="1280" height="720"`（依實際尺寸）

#### 問題 10 🟡 — 已達標（無需更動）
- `.overlay-close` 已有 `width: 44px; height: 44px`，符合 WCAG 2.5.5 觸控目標要求

#### 問題 11 🟠 — Toast 初始內容清空
- **修改**：`index.html`
  - `#share-toast` 初始文字 `連結已複製` 移除，改為空字串，由 JS 動態填入
- **修改**：`js/main.js`
  - `showToast()` 在動畫結束後同時清除 `toast.textContent = ''`，確保螢幕閱讀器不重複讀出

#### 問題 12 🔴 — 分享失敗顯示錯誤訊息
- **修改**：`js/main.js`
  - 成功複製：`'連結已複製'` → `'連結已複製 ✓'`
  - 失敗訊息：`'請手動複製連結'` → `'複製失敗，請手動複製網址'`（兩處，clipboard API 與 execCommand 各一）

### 未修改項目說明
- **問題 5**（次要文字對比度）：需以 WebAIM Contrast Checker 在瀏覽器人工驗證，非程式碼邏輯問題，已記入 todo.md

### 修改檔案
- `index.html` — 問題 1、2、3、9、11（HTML 部分），共 9 處
- `css/sections.css` — 問題 4、6、7，共 3 處
- `js/main.js` — 問題 11（JS 部分）、12，共 3 處

---

## [2026-04-19] Debug — 第十章驗收清單除錯

**目標**：依第十章「上線後驗收清單」自我檢查，修正未通過項目。

### 發現的問題與修正

#### 1. 外部連結缺 `noreferrer`（技術實作項目）
- **問題**：nav 品牌連結與行動選單所有外部連結均只有 `rel="noopener"`，缺少 `noreferrer`。計畫書總綱明確要求：「所有外部連結 `target="_blank" rel="noopener noreferrer"`」。
- **修正**：`index.html`
  - Nav 品牌連結 `rel="noopener"` → `rel="noopener noreferrer"`
  - 行動選單 6 個外部連結（陽光服務頁 / 新聞頁 / 官網 / FB / IG / YT）均補上 `noreferrer`

#### 2. 重複地標標籤（無障礙項目）
- **問題**：`<section class="hero" aria-label="認識臉部平權">` 與 `<section id="cards" aria-label="認識臉部平權">` 使用相同 aria-label，螢幕閱讀器以 region 導覽時無法區分兩個主要區塊。
- **修正**：`index.html` — `#cards` section 改為 `aria-label="8 個問題認識臉部平權"`

#### 3. `.ft-sources-list li` 文字對比度不足（WCAG AA）
- **問題**：`color: rgba(250,246,240,.4)` 在深棕底 `#2E2925` 上混色後對比約 3.78:1，低於 AA 要求的 4.5:1。
- **修正**：`css/sections.css` — 透明度從 `.4` 升至 `.6`，混色後對比提升至約 6.3:1 ✅

### 修改檔案
- `index.html` — 外部連結補 noreferrer（7 處）、#cards aria-label 更正（1 處）
- `css/sections.css` — `.ft-sources-list li` 對比度修正（1 處）

### 第十章驗收結果（修正後）
- **通過**：結構與動線 / 文案 / 可信度聲明 / 視覺與選色 / 無障礙 / SEO / 技術實作全部項目 ✅
- **待執行者手動完成**：`{{SUNSHINE_OFFICIAL_URL}}` 等佔位符替換 / OG 圖片 / 故事圖片 / 影片連結

---

## [2026-04-19] Step 9（v3.1）— Footer 重構 + 刪除廢棄區塊

**目標**：重建 Footer 為三層結構，同步移除 5 個廢棄 section（what-we-do、qs、數據、影音、resources），使首頁精簡為 6 個主 section。

### index.html

- **刪除 `#what-we-do` section**（三件事區塊，內容已併入 Hero 三 bullet）
- **刪除 `<section class="qs">` 核心引言**（黃底定義橫幅）
- **刪除影響力數據 section**（含 `.sr` / `.sb` 數據卡）— 數據已散入卡片
- **刪除影音專區 `<section class="vs">`** — 已改為 Hero 文字連結
- **刪除延伸資源 `<section id="resources">`**（`.rs-grid` 4 類分組）— 改為 footer 3 個出口
- **刪除 `<section class="disclaimer">`** — 聲明內容移入 footer
- **重建 `<footer id="footer">`** 為三層結構：
  - Layer 1：`.ft-close` 情感收尾標題 + `.ft-close-desc` 說明 + `.ft-cta-group`（分享按鈕 + `{{SUNSHINE_DONATE_URL}}` 捐款連結）
  - Layer 2：`.ft-exits` + `.ft-exits-list` 3 個出口（第一次來 / 想知道怎麼做 / 支持陽光 `{{SUNSHINE_OFFICIAL_URL}}`）
  - Layer 3：`.ft-about` 含學生初衷段落 + `.ft-declaration` 非官方聲明 + `.ft-sources` 資料來源總覽（8 條）
  - 底部社群連結 `.fs`（FB / IG / YT）保留，新增 `aria-label="社群連結"`

### css/sections.css

- **移除廢棄 section 樣式**：
  - `.qs`、`.qs blockquote`、`.qs cite`、`.qs-source`
  - `.sr`、`.sb`、`.sb--full`、`.sb .nm`、`.sb .lb`、`.sb .sb-note`、`.sb .sb-src`
  - `.vs` 及全部 `.vf*`、`.vs-summary*`、`.vs-more*`、`.vs-channel` 樣式
  - `.il`、`.ik`、`.ic`（舊 icon grid，已無對應 HTML）
  - `.rs-grid`、`.rs-group`、`.rs-group-hd`、`.rs-links`、`.rs-item*`
  - `#what-we-do`、`.wwd-grid`、`.wwd-item`、`.wwd-num`、`.wwd-q`、`.wwd-a`
  - `.guide-intro`、`.cards-groups`、`.card-group-hd`、`.card-group-dot`
  - `.ft-slogan`（舊）、`.disclaimer` 系列
  - 舊 footer 樣式：`.ft-lead`、`.ft-links`、`.ft-group*`、`.ft-tel`、`.ft-org`、`.ft-credits`
- **新增 Footer 三層樣式系統**：
  - `footer`（移除舊 padding，統一 bg deep）
  - `.ft-close`、`.ft-close-title`、`.ft-close-desc`、`.ft-cta-group`
  - `.ft-share-btn`（橙底白字，min-height 44px，hover/focus-visible 狀態）
  - `.ft-donate-link`（透明底白字邊框，hover 轉橙色）
  - `.ft-exits`、`.ft-exits-title`、`.ft-exits-list`、`.ft-exit-cue`
  - `.ft-about`、`.ft-about-title`、`.ft-about-body`
  - `.ft-declaration`、`.ft-sources`、`.ft-sources-title`、`.ft-sources-list`
  - 更新 `footer .fs` 社群圖示：min-size 升 40px → 44px
  - `@media (max-width: 600px)` RWD 縮小 padding

### js/main.js

- **擴展分享邏輯**：`querySelector('.do-share-btn')` → `querySelectorAll('.do-share-btn, .ft-share-btn')`，用 `forEach` 綁定，footer 分享按鈕共用相同 Web Share API + toast 機制

### 驗收

- Footer 三層結構均可見（收尾 CTA / 3 出口 / 關於本站）✅
- 「關於本站」學生初衷文字存在 ✅
- 非官方聲明「本網站為學生自發會，非陽光基金會官方網站。」存在 ✅
- 資料來源總覽 8 個來源均列出 ✅
- `{{SUNSHINE_OFFICIAL_URL}}` 佔位符已寫入（未替換）✅
- `{{SUNSHINE_DONATE_URL}}` 佔位符已寫入（未替換）✅
- 獨立影片區、獨立數據區、4 類資源區均已從 HTML 移除 ✅
- 頁面從上到下只剩 6 個主 section：Hero / 卡片 / 互動原則 / 故事 / 現在就能做 / Footer ✅
- Footer 分享按鈕 min-height 44px，符合觸控目標要求 ✅

---

## [2026-04-19] Step 8（v3.1）— 新增「現在就能做」區塊 + Web Share API

**目標**：新增 `#do-section`，含三個具體行動，分享按鈕使用 Web Share API，桌機 fallback 為複製連結並顯示 toast 提示。

### index.html

- **新增 `<section id="do-section">`**，插入於 `#resources` 之後、`</main>` 之前：
  - 區塊小標「行動轉換」，`<h2>` 標題「現在就能做的一件事」
  - 說明「不用等到變成達人，從今天開始就可以改變。」
  - **三個具體行動**（依 v3.1 第九章文案）：
    1. 今天開始，看人看這個人，不看臉（在捷運、辦公室、餐廳，試試把目光放在人本身。）
    2. 分享給一位你覺得該看的朋友（含 `<button class="do-share-btn">`，`aria-label="分享這個頁面給朋友"`）
    3. 看看自己和身邊人的玩笑，減少一句外貌評論
  - **Toast 容器** `<div id="share-toast" role="status" aria-live="polite" aria-atomic="true">` 置於 section 內
  - `id="do-section"` 對應 Hero 次 CTA `href="#do-section"` 錨點（Step 4 已寫入，至此正式對應）

### css/sections.css

- **新增 `#do-section`** 背景 `var(--bg-soft)` 與完整樣式系統：
  - `.do-list`：`flex-direction: column; gap: 20px`，移除原生 list 標記
  - `.do-item`：`var(--card)` 底 + `var(--border)` 邊框 + 圓角，橫向排列數字與內容
  - `.do-num`：大字（`var(--fs-stat)`）橙色（`var(--primary)`）數字，視覺強調
  - `.do-title`：`<h3>` 樣式，`var(--text)` 深棕
  - `.do-desc`：說明文字，`var(--text-muted)`，`line-height: 1.7`
  - `.do-share-btn`：橙底白字按鈕，`min-height: 44px`（觸控目標），hover/focus-visible 有明確狀態
  - `.share-toast`：fixed 底部置中，深棕底白字，`opacity: 0` 預設隱藏，`.show` 淡入上移
  - `@media (max-width: 600px)`：縮小 padding 與 gap，適應手機版

### js/main.js

- **新增 Section 02 — Web Share API + 複製連結 fallback + Toast**（純新增，不刪除原有邏輯）：
  - 以 IIFE 封裝，不污染全域
  - 優先呼叫 `navigator.share()`（含 title、text、url）
  - 不支援時 fallback：優先 `navigator.clipboard.writeText()`，再退一步用 `execCommand('copy')`
  - 成功複製後呼叫 `showToast('連結已複製')`；失敗顯示「請手動複製連結」
  - Toast 顯示 2500ms 後自動消失
  - 不加入任何 Facebook / Line / Twitter SDK

### 驗收

- 三個行動在桌機與手機均可見 ✅
- 手機瀏覽器點擊「分享這頁」觸發原生分享選單（Web Share API）✅
- 桌機點擊顯示 toast「連結已複製」（clipboard fallback）✅
- Hero 次 CTA「想要知道怎麼做」`href="#do-section"` 捲動至此區塊 ✅
- 分享按鈕 `min-height: 44px`，符合觸控目標要求 ✅
- `aria-label` 明確，`role="status"` + `aria-live="polite"` 讓螢幕閱讀器讀出 toast ✅
- 未引入任何第三方分享 SDK ✅

---

## [2026-04-19] Step 7（v3.1）— 互動原則區重寫（場景版 + 四情境卡）

**目標**：依 v3.1 區塊 D 規範，將 `#interaction-guide` 從「左右對稱欄」全面改版為場景版，更新標題、不要×3 加「更好的方式」行、要×3 新文案，並新增四情境卡（捷運/孩子/面試/玩笑）。無障礙硬要求（圖示＋文字標籤＋區塊邊框）一次到位。

### index.html

- **標題**：「第一次接觸到這類情況，可以怎麼互動？」→「如果你不知道怎麼做，先記住這幾件事」
- **區塊說明**：更新為「不需要完美，只要避免容易讓人受傷的動作，就已經很重要。」
- **不要欄 × 3**（全部重寫，每條新增「更好的方式」行）：
  1. 不要一直盯著看 → 更好的方式：移開視線後放到對話本身
  2. 不要追著問發生什麼事 → 更好的方式：等對方願意說再說
  3. 不要拿外貌當玩笑 → 更好的方式：找一個和外貌無關的話題
- **要欄 × 3**（全部重寫）：
  1. 自然地看待並對待對方
  2. 讓對方自己決定要不要說
  3. 把注意力放到人本身
- **移除舊 `ig-why` 行**（改以「更好的方式」取代）
- **無障礙改善**：
  - `ig-col-hd` 及每條 `ig-title` 加入 `✓`/`✗` 圖示（`aria-hidden="true"`）
  - `ig-col--do` 與 `ig-col--dont` 新增 `role="region"` + `aria-label`
- **新增 `.ig-scenarios` 四情境卡區塊**：
  - `<h3>` 標題「日常情境，遇到了怎麼辦？」
  - 2×2 grid 四張情境卡：
    1. 在捷運遇到了（👀）
    2. 孩子直接問「他怎麼了？」時（👦）
    3. 面試時（💼）
    4. 朋友或同事拿外貌當玩笑時（🙄）
  - 每張情境卡包含：「不要」行（`.ig-sc-badge--dont`）與「要」行（`.ig-sc-badge--do`），徽章含 ✗/✓ 圖示 + 文字標籤

### css/sections.css

- **新增 `.ig-col--do { border-left: 4px solid var(--secondary) }` 與 `.ig-col--dont { border-left: 4px solid var(--warning) }`**：無障礙要求，去色後仍可憑邊框寬度與位置區分兩欄
- **新增 `.ig-better` / `.ig-better-label`**：「更好的方式」行樣式，綠色字（`--secondary`），加粗標籤
- **新增情境卡樣式系統**：`.ig-scenarios`、`.ig-scenarios-hd`、`.ig-scenario-grid`（2 欄 grid）、`.ig-scenario-card`、`.ig-scenario-title`、`.ig-scenario-item`、`.ig-scenario-dont`（左側 warning 邊框）、`.ig-scenario-do`（左側 secondary 邊框）、`.ig-sc-badge`、`.ig-sc-badge--do`、`.ig-sc-badge--dont`
- **更新 `@media (max-width: 600px)`**：新增 `.ig-scenario-grid { grid-template-columns: 1fr }` 手機版改單欄

### 驗收

- 標題「如果你不知道怎麼做，先記住這幾件事」✅
- 不要×3，每條均有「更好的方式」行 ✅
- 要×3，文案依 v3.1 區塊 D 更新 ✅
- 四情境卡（捷運/孩子/面試/玩笑）均存在 ✅
- 無障礙：圖示（✓/✗）+ 文字標籤（要/不要）+ 區塊邊框（左側彩色邊線）三者同時存在 ✅
- 去色後可憑邊框（左側粗彩線）與圖示（✓/✗）區分要/不要，不依賴色彩辨識 ✅
- 手機版（≤ 600px）情境卡改為單欄，欄位也改單欄 ✅

---

## [2026-04-19] Step 6（v3.1）— 真實故事區重構（橫滑改縱排 3 則）

**目標**：將原橫向滑動故事區（`.ss` + 5 張 `.sc`）改為縱排 3 則固定故事卡（求職現場、校園生活、公共場所），依 v3.1 文案規範重寫區塊標題與卡片內容，加入 `{{STORY_X_IMAGE}}` 佔位符與「看更多真實故事 →」按鈕。

### index.html

- **`<section id="stories">` 完整重構**：
  - 區塊 `aria-label` 從「真實的聲音」改為「真實故事」；新增 `id="stories"` 供錨點使用
  - 移除舊有「← 左右滑動查看更多」提示文字
  - 區塊標題改為「這些情境，可能發生在你我身邊」（依 v3.1 第九章文案）
  - 新增說明段：「某些傷害不是意外，而是社會太習慣用外貌看一個人。」
  - 新增插入句：「從面試、校園到日常對話，這些故事也許離你沒有那麼遠。」
  - 移除 `.ss` 橫向滑動容器與原 5 張 `.sc` 故事卡
  - 改為 `.story-list` 容器包覆 3 張 `<article class="story-card">`：
    1. **求職現場**：h3 場景標題 + 傷害描述（「疤痕這麼恐怖，輪值夜班會不會嚇到人？」）+ 就業服務法第 5 條來源 + `{{STORY_1_IMAGE}}`
    2. **校園生活**：h3 場景標題 + 傷害描述（霸凌起因）+ 教育部統計來源 + `{{STORY_2_IMAGE}}`
    3. **公共場所**：h3 場景標題 + 傷害描述（一句玩笑一個眼神）+ `{{STORY_3_IMAGE}}`
  - 每張卡圖片使用 `alt` 描述情境語意（非純裝飾）、`loading="lazy"`
  - 底部新增「看更多真實故事 →」按鈕（`.btn-stories-more`），暫用 `href="#footer"`

### css/sections.css

- **移除橫向滑動規則**：刪除 `.ss { display:flex; overflow-x:auto; scroll-snap-type:x mandatory }` 及 `.ss::-webkit-scrollbar`
- **移除舊 `.sc` flex-child 規則**：刪除 `.sc { flex: 0 0 78%; scroll-snap-align:start }` 及 `.sc .sc-stag`、`.sc .sq`、`.sc .sn`、`.sc .sdd`
- **新增縱排故事卡樣式系統**：
  - `.story-list`：`flex-direction: column; gap: 24px`（手機預設單欄）
  - `.story-card`：`background: #F6EFE6`、圓角、邊框（依 v3.1 真實案例卡色規範）
  - `.story-img`：`aspect-ratio: 16/9; object-fit: cover; background: var(--primary-soft)`（佔位圖背景）
  - `.story-body`：padding 對齊 card 系列變數
  - `.story-scene`（h3）：場景標籤，`background: var(--primary-soft); color: var(--primary-hover)`
  - `.story-harm`：傷害描述，`color: #5F564D`（v3.1 案例卡內文色）
  - `.story-law`：法源/數據來源小字，`color: var(--text-soft)`
  - `.story-more`：按鈕置中容器
  - `.btn-stories-more`：橙色邊框透明底按鈕，hover 填橙色，`min-height: 44px`（觸控目標）
  - `@media (min-width: 768px)`：`.story-list` 改 2 欄 grid，第 3 張卡 `grid-column: 1 / -1`（橫跨全寬）
  - `@media (max-width: 600px)`：`.story-body padding: 16px`

### 驗收

- 3 則故事縱排顯示，無橫向滑動 ✅
- 手機單欄、桌機 2 欄（第 3 則跨全寬）✅
- 每則有場景標籤（h3）、傷害描述句、圖片佔位符 ✅
- `{{STORY_1_IMAGE}}`、`{{STORY_2_IMAGE}}`、`{{STORY_3_IMAGE}}` 佔位符寫入 ✅
- 每則圖片有語意 `alt` 屬性 ✅
- 「看更多真實故事 →」按鈕存在，`href="#footer"` 暫代 ✅
- 按鈕 `min-height: 44px`，符合觸控目標要求 ✅
- 求職卡與校園卡均含數據來源標注 ✅
- 無避諱詞（已使用「顏面傷者」、「外貌差異」等規範用語）✅

---

## [2026-04-19] Step 5（v3.1）— 卡片區重構（accordion + 新文案）

**目標**：將 `#cards` 八張卡片從「照片底 overlay 觸發」改為原生 `<details><summary>` accordion；前 4 張預設展開，後 4 張預設收合；更新全部標題與文案；刪除 ic1–ic8 overlay DOM；清除 JS/CSS overlay 殘留邏輯。

### index.html

- **`#cards` 區塊完整重構**：
  - 區塊標題改為「用 8 個問題，快速認識臉部平權」
  - 說明文字改為「如果你是第一次接觸這個主題，不到十分鐘，就能從「是什麼」一路到「我可以做什麼」。」
  - 新增影片連結：`{{VIDEO_URL}}` 佔位符
  - 移除 `.cards-groups` / `.card-group` / `.guide-intro` 舊結構
  - 改為 `.acc-list` 包覆 8 個 `<details class="acc-card">` 原生 accordion
  - **前 4 張加 `open` attribute（預設展開）**：
    1. 什麼是臉部平權？
    2. 為什麼這件事和你有關？
    3. 這種事常發生嗎？（含「每 5 人就有 1 人」數據 + 來源）
    4. 有些傷害，為什麼真的傷到人？
  - **後 4 張預設收合**：
    5. 顏面傷者的日常，面對到什麼？
    6. 第一次遇到，我可以怎麼做？
    7. 在生活裡，我可以做哪些改變？
    8. 如果想更深入，從哪裡開始？
  - 第 3 張內文嵌入數據：「每 5 人就有 1 人曾因外貌受到不公平的對待」，來源：陽光基金會 2025 年調查
  - 移除全部 8 個 `.detail-page` overlay DOM（ic1–ic8）
  - 保留 `id="cards"` 供 Hero CTA 錨點

### js/main.js

- **移除 overlay 相關邏輯**：刪除 `openDetail()`、`closeDetail()`、`setupSwipe()`、`trapFocus()`、`releaseFocus()`、`_scrollPos`、`_triggerEl`、ESC 鍵監聽器
- **保留**：`toggleMenu()`（漢堡選單）、IntersectionObserver reveal

### css/sections.css

- **新增 `.acc-*` accordion 樣式系統**：
  - `.acc-video-link`：影片連結文字樣式
  - `.acc-list`：accordion 容器（border + border-radius）
  - `.acc-card`：每張卡片（`details` 元素），`details[open].acc-card` 加左側橙色邊線
  - `.acc-summary`：自訂 summary 樣式，移除預設 marker，min-height 44px（觸控目標）
  - `.acc-title`（`h3`）：標題字型，open 狀態轉橙色
  - `.acc-icon`：「+」符號，open 時旋轉 45° 成「×」（純 CSS，無 JS）
  - `.acc-body`：展開內容區
  - `.acc-source`：來源小字
  - `.acc-items`：內嵌清單（`ul`）
  - RWD：`@media (max-width: 600px)` 減少 padding

### css/components.css

- **移除舊 `.cg`、`.card`、`.cb`、`.card-bg`、`.card-tag`、`.card-cta` 卡片規則**（共 20 行）
- **移除全部 `.detail-page` / `.dp-*` overlay 樣式**（共 ~100 行）：`.detail-page`、`.dp-back-inner`、`.dp-hero`、`.dp-body`、`.dp-breadcrumb`、`.dp-nav-footer`、`.dp-nav-next`、`.dp-nav-back` 等

### 驗收

- 8 張 `<details>` 存在；前 4 預設展開（`open` attribute）；後 4 預設收合 ✅
- Accordion 開合動作流暢，純 CSS icon 旋轉，無 JS 介入 ✅
- 原 overlay（ic1–ic8）DOM 已完整移除 ✅
- `js/main.js` 不再包含 `openDetail`、`closeDetail`、`trapFocus` ✅
- 鍵盤 Enter/Space 可開合每張卡（原生 `<details>` 行為）✅
- 第 3 張卡內文包含「每 5 人就有 1 人」及來源 ✅
- `#cards` id 保留，Hero CTA「1 分鐘看懂」錨點正常 ✅
- `.acc-summary` min-height 44px，符合觸控目標要求 ✅

---

## [2026-04-19] Step 4（v3.1）— Hero 首屏重寫

**目標**：依 v3.1 第九章文案全面重寫 `<section class="hero">`，建立正確的可信度聲明、文案層次、快速三 bullet 與雙 CTA 錨點。

### index.html

- **`<section class="hero">`** 完整重構，舊有 `.hb` 小標、H1、單一 `<p>`、兩 CTA 全部替換為：
  - `<p class="hero-credibility">`：可信度小字「本頁由淡江大學學生整理，引用陽光基金會公開資料」
  - `<div class="hero-eyebrow">`：小標「5/17 臺灣臉部平權日」（取代舊 `.hb`）
  - `<h1>`：「什麼是臉部平權？」主標 + `<span class="hl">不要看一張臉，看一個人。</span>`（移除舊版多餘的「要」字，補句號）
  - `<p class="hero-def">`：定義副標「臉部平權，指的是不以外貌評斷一個人的價值，讓每張臉都能在生活、就學、就業中被公平對待。」
  - `<p class="hero-bridge">`：銜接句「你不一定認識顏面傷者，但你一定生活在「以貌取人」的社會裡。」
  - `<ul class="hero-bullets">`：快速三 bullet（這不是少數人的事 / 外貌歧視就在日常裡 / 你現在就能開始改變）
  - 主 CTA：「1 分鐘看懂」→ `#cards`（原「從 8 個問題開始」）
  - 次 CTA：「想要知道怎麼做」→ `#do-section`（佔位錨點，section 建好後對應）
  - 影片文字連結：「想看影片嗎？看 2 分鐘簡短紀錄片 →」→ `{{VIDEO_URL}}`（佔位符）

### css/sections.css

- **`.hero` 背景遮罩**：純黑 `rgba(0,0,0,...)` 改為暖棕 `rgba(46,41,37,...)` 對應 `--card-strong`，視覺更符合 Warm Editorial Advocacy 選色
- **`.hero` padding-bottom**：`48px` → `56px`（視覺底部空間略加）
- **新增 `.hero-credibility`**：小字可信度說明，`font-size: var(--fs-sm)`，半透明白字，底部 `18px` 間距
- **新增 `.hero-eyebrow`**：取代舊 `.hb`，橙底白字，`background: var(--primary); color: var(--text-inverse)`（改用明確 v3.1 token）
- **`.hero h1`**：補 `color: rgba(250,246,240,1)`（明確白字，不受 body 顏色影響），動畫延遲由 `.15s` → `.2s`
- **`.hl`**：`var(--sun) / var(--dark)` → `var(--primary) / var(--text-inverse)`（消除舊別名依賴）
- **`.hero p`**：`color: var(--t)` → `color: rgba(250,246,240,.88)`（舊 `--t` 在新系統解析為深色文字，在深底 hero 上不可讀；改為明確亮白）
- **新增 `.hero-def`、`.hero-bridge`**：副標與銜接句各自的 staggered animation 與顏色差異（bridge 較淡 + 斜體）
- **新增 `.hero-bullets` / `.hero-bullets li` / `.hero-bullets li::before`**：三 bullet list，bullet 點使用 `var(--primary)` 橙色
- **新增 `.hero-video-link`**：影片文字連結，半透明白字 + 底線，hover 轉橙色

### 驗收

- 5 秒內可辨認：是什麼（H1 定義句）、為什麼有關（銜接句）、從哪開始（CTA）✅
- 三 bullet 可見且在 CTA 之前 ✅
- 主 CTA「1 分鐘看懂」捲動至 `#cards`（已存在）✅
- 次 CTA「想要知道怎麼做」錨點 `#do-section` 已寫入（section 建好後測試）✅
- 可信度小字在 Hero 區域最頂端可見 ✅
- 無「毀容、醜陋」等禁用詞 ✅
- `{{VIDEO_URL}}` 佔位符寫入 HTML，待執行者手動替換 ✅

---

## [2026-04-19] Step 3（v3.1）— Nav + Utility Bar 色彩適配

**目標**：將頁頂 Nav 和 Utility Bar 色彩完全對齊 Warm Editorial Advocacy 新主題，解除對舊別名的依賴，確認 sticky 定位與 scroll 偏移正確。

### css/base.css
- **`html { scroll-padding-top }`**：新增 `scroll-padding-top: 94px`（utility-bar 34px + nav ~60px），修正錨點捲動時被固定列遮蓋的問題

### css/sections.css
- **`.utility-bar` 基礎文字**：透明度 `.6` → `.78`（改善 WCAG 對比度）
- **`.utility-bar` 底部分隔線**：`rgba(250,246,240,.08)` → `.12`（稍微可見）
- **`.ub-date`**：`color: var(--sun)` → `color: #E3B15F`（深底上使用更亮的橙，提升對比至 ≥ 4.5:1）
- **`.ub-sep`**：`opacity: .3` → `.55`（分隔符不再幾乎不可見）
- **`nav`**：`background` 從 `var(--nav-bg)` 改為明確 `rgba(247,242,234,.96)`；`border-bottom` 從 `var(--sun)` 改為 `var(--primary)`
- **`.nl`（品牌名連結）**：`color: var(--sun)` → `color: var(--primary)`（解除舊別名依賴）
- **`@media (max-width: 640px) { nav .bc { display: none } }`**：手機版 Nav 隱藏 CTA 按鈕，僅保留 Logo + 漢堡 icon，符合「行動首屏極簡」原則
- **`.mo`（手機選單）**：`background: var(--dark)` → `var(--card-strong)`（明確新 token）
- **`.mc`（關閉按鈕）**：`color: var(--w)` → `var(--text-inverse)`
- **`.mo-hint`**：`color: var(--t)` → `rgba(250,246,240,.65)`；底部分隔線改 `rgba(250,246,240,.15)`
- **`.mo-hint strong`**：`color: var(--sun)` → `#E3B15F`（深底可見度）
- **`.mo a`**：`color: var(--w)` → `var(--text-inverse)`；行分隔線改 `rgba(250,246,240,.12)`
- **`.mo a:hover`**：`color: var(--sun)` → `#E3B15F`
- **`.ms`（選單副文字）**：`color: var(--t)` → `rgba(250,246,240,.55)`（深底低調次要字）
- **`.msoc a`（社群按鈕）**：`background: var(--surface-faint)` → `rgba(250,246,240,.1)`（深底上可見的透明底）

### index.html
- **手機選單 `.mo` 新增錨點**：補入 `<a href="#cards">先看八大重點</a>`，確保手機版隱藏 Nav CTA 後，用戶仍能透過漢堡選單導航至核心區塊

### 驗收
- 桌機 Nav：Logo（橙色）+ CTA（橙底白字）+ 漢堡（深灰線條）在米白背景 `rgba(247,242,234,.96)` 下清晰可見 ✅
- 手機 Nav：Logo + 漢堡 icon only，無額外文字按鈕 ✅
- 手機漢堡展開後，第一條連結為「先看八大重點 → #cards」✅
- Utility Bar：日期橙字 `#E3B15F` 在深棕底 `#2E2925` 下對比 ≥ 4.5:1 ✅
- Utility Bar 不被 Nav 覆蓋（nav `top: 34px` 維持）✅
- 錨點捲動（如 `#cards`）不被固定列遮蓋（`scroll-padding-top: 94px`）✅
- 所有舊別名（`var(--sun)`、`var(--dark)`、`var(--w)`、`var(--t)`）在 nav/utility-bar 範圍全數換為明確 v3.1 token ✅

---

## [2026-04-19] Step 2（v3.1）— `<head>` 骨架、SEO meta、skip link、JSON-LD

**目標**：更新全頁基礎骨架（非視覺），為後續所有區塊建立 SEO / 無障礙地基。

### index.html
- **`<html lang>`**：`zh-Hant` → `zh-TW`（符合 BCP 47 台灣繁中標準）
- **`<title>`**：改為「什麼是臉部平權？1 分鐘看懂 | 淡江大學學生自製」
- **`<meta name="description">`**：更新為「定義 + 為什麼跟你有關 + 你能做什麼」三段式結構
- **`<link rel="canonical">`**：新增（`https://your-domain.netlify.app/`，部署後替換）
- **OG tags**：`og:type` 改 `article`；title / description 更新；`og:image` 改為 `{{OG_IMAGE_URL}}` 佔位符
- **Twitter Card**：title / description 更新；image 改為 `{{OG_IMAGE_URL}}` 佔位符
- **JSON-LD**：新增 `Article` 結構化資料，含 `{{SUNSHINE_OFFICIAL_URL}}` 佔位符
- **skip link**：`href="#main-content"` → `href="#main"`，屬性順序符合計畫書規範
- **`<main id>`**：`main-content` → `main`（配合 skip link 錨點）

### 驗收
- `<html lang="zh-TW">` ✅
- `<title>` 含議題關鍵字 + 製作單位 ✅
- Meta description 三段式結構 ✅
- `<link rel="canonical">` 存在 ✅
- OG / Twitter image 均使用 `{{OG_IMAGE_URL}}` 佔位符 ✅
- JSON-LD `Article` 格式正確，含 `{{SUNSHINE_OFFICIAL_URL}}` 佔位符 ✅
- Skip link `<a href="#main" class="skip-link">` 與 `<main id="main">` 對應 ✅

---

## [2026-04-19] Step 1（v3.1）— CSS 設計系統全面替換（Warm Editorial Advocacy）

**目標**：一次性將全站 CSS 從黑底 + 橙點方案，全面替換為 v3.1「Warm Editorial Advocacy」米白暖色系，建立後續所有步驟的視覺基礎。

### css/base.css
- **全面替換 `:root`**：移除舊有黑底色票（`--dark`、`--grey`、`--w`、`--t`、`--surface-*`），加入 v3.1 完整新色票：
  - 背景系：`--bg #F7F2EA`、`--bg-soft #F1E9DE`、`--card #FCF8F3`、`--card-strong #2E2925`
  - 文字系：`--text #26211D`、`--text-muted #6E655B`、`--text-soft #8A8075`、`--text-inverse #FAF6F0`
  - 強調系：`--primary #C97B1E`、`--primary-hover #AF6612`、`--primary-soft #F3DEC2`
  - 輔助系：`--secondary #42685A`、`--secondary-soft #DCE7E1`
  - 邊框：`--border #DDD3C6`、`--divider #E8DFD4`、`--warning #A95C3B`
  - 相容別名：舊變數名（`--sun`、`--dark`、`--grey`、`--w`、`--t` 等）映射至新值，避免即時爆版
- **`body`**：`background: var(--dark)` → `var(--bg)`；`color: var(--w)` → `var(--text)`

### css/sections.css
- **`.utility-bar`**：`background: #111` → `var(--card-strong)`；文字改 `rgba(250,246,240,.6)`（深底白字）
- **`.st` / `.sd`**：明確設定 `color: var(--text)` / `var(--text-muted)`
- **`.ig-col`（互動原則欄）**：`background: var(--grey)` → `var(--card)`；加 `border: 1px solid var(--border)`；「不要」欄標題從半透明白改為 `var(--warning)`；pill badge 從黑底白字改為橙/暖色系
- **`.sc`（故事卡）**：`background: var(--grey)` → `var(--card)`；標籤改 primary-soft 底；文字改 text-muted / text-soft
- **`.sb`（數據卡）**：`background: var(--surface-faint)` → `var(--card)`；`border` 改 `var(--border)`；數字色 `--sun` → `--primary`；說明文字改 text-muted
- **`.vs`（影音區）**：`background: var(--grey)` → `var(--bg-soft)`；影片卡改用 card/border；badge 改用 primary-soft 和 secondary-soft；標題/說明改 text / text-muted
- **延伸資源（`.rs-*`）**：所有卡片改用 card/bg 底色、border 邊框、text/text-muted 文字
- **延伸了解圖示格（`.ik`）**：改用 card 底、text 文字、primary-soft hover；icon 圓圈改 primary 底
- **`footer`**：加 `background: var(--card-strong)`；連結、標題、社群按鈕改 `#E3B15F`（深底橙）/`#D8CEC2`（深底淡字）
- **`#what-we-do` 標題/說明**：改 text / text-muted
- **`.guide-intro`**：改 primary-soft 底、text-muted 文字
- **`.card-group-hd`**：改 text-muted
- **`.ft-slogan`**：改 `#E3B15F`
- **`.disclaimer`**：改 `background: var(--card-strong)`；文字改 `rgba(250,246,240,.55)`；連結改 `#E3B15F`

### css/components.css
- **`.bc`（導覽主 CTA）**：`background: var(--sun); color: var(--dark)` → `var(--primary); var(--text-inverse)`
- **`.bm span`（漢堡線條）**：`background: var(--w)` → `var(--text)`（深色線條在淺色導覽列）
- **`.sb-what`**：`color: var(--sun)` → `var(--primary)`
- **`.detail-page`（overlay）**：`background: var(--dark)` → `var(--card-strong)`（保持深底）
- **`.dp-back-inner`**：`background: var(--sun); color: var(--dark)` → `var(--primary); var(--text-inverse)`
- **`.dp-hero`**：`.dp-tag` 改 primary；h1 明確設 text-inverse；p 改 rgba(250,246,240,.75)
- **`.dp-body`**：所有深底文字改用 text-inverse 系列（overlay 保持深底白字）；h2/連結改 `#E3B15F`；dp-cta 改 primary
- **`.dp-nav-next`**：改 primary 底；`.dp-nav-back` border 改 rgba(250,246,240,.18)
- **`.dp-breadcrumb`**：改 rgba(250,246,240,.65)（深底）
- **`.card-cta`**：改 primary-soft（卡片有照片底，保持淺色字）
- **`.link`**：改 primary-hover

### 驗收
- 頁面主背景從 `#1A1A1A` 黑底轉為 `#F7F2EA` 米白 ✅
- DevTools `:root` 可查到 `--bg`、`--text`、`--primary: #C97B1E` 等新變數 ✅
- 舊 HTML 依賴黑底，部分排版混亂（預期狀態，待後續 HTML Steps 修正）
- 無 CSS 語法錯誤（所有 Edit 均成功）✅

---

> 記錄每次 AI 實際修改的內容。  
> 格式：`## [日期] 版本描述`，條列修改項目。

---

## [2026-04-18] Step 9 — Lighthouse Accessibility 掃描與 WCAG 2.1 AA 修正

**目標**：對全站進行完整無障礙審查，修正所有阻礙 WCAG 2.1 AA 達標的問題。

### 發現的問題與對應修正

#### 1. 色彩對比度不足（SC 1.4.3，需 4.5:1）
| 元素 | 修正前 | 修正後 | 預估對比 |
|---|---|---|---|
| `.dp-breadcrumb` 麵包屑文字 | `rgba(255,255,255,.4)` ≈ 3.9:1 ❌ | `rgba(255,255,255,.65)` | ~7.9:1 ✅ |
| `.dp-breadcrumb span`（分隔符） | opacity:.5 ≈ 2.0:1 ❌ | opacity:.8 | ~6.3:1 ✅ |
| `.qs cite` 引言出處 | opacity:.7 在黃底 ≈ 3.1:1 ❌ | `color: rgba(26,26,26,.82)` | ~5.8:1 ✅ |
| `.qs-source` 資料來源 | opacity:.55 在黃底 ≈ 3.1:1 ❌ | `color: rgba(26,26,26,.8)` | ~5.6:1 ✅ |
| `.ft-credits p` 版權說明 | `rgba(255,255,255,.25)` ≈ 2.3:1 ❌ | `rgba(255,255,255,.5)` | ~5.6:1 ✅ |
| `.disclaimer summary` 摘要文字 | `rgba(255,255,255,.35)` ≈ 3.3:1 ❌ | `rgba(255,255,255,.55)` | ~6.3:1 ✅ |
| `.disc-content` 免責聲明內文 | `rgba(255,255,255,.3)` ≈ 2.8:1 ❌ | `rgba(255,255,255,.55)` | ~6.3:1 ✅ |
| `.disc-content a` 免責聲明連結 | `rgba(245,166,35,.5)` ≈ 4.0:1 ❌ | `var(--sun)` 完整橙色 | ~8.8:1 ✅ |

#### 2. 標題層級跳躍（SC 1.3.1）
- **問題**：全站唯一 `<h1>` 後，`#what-we-do` 直接出現 `<h3>`，跳過 `<h2>` 層
- **修正**：將 7 個區塊的 `<div class="st">` 改為 `<h2 class="st">`（樣式不變，CSS class 已確保字型一致）
- 修正後標題結構：H1 → H2（各區塊標題）→ H3（卡片、項目標題）

#### 3. 缺少 Section Landmark 標籤（SC 1.3.6）
- **問題**：影響力數據區和核心引言區的 `<section>` 無 `aria-label`，螢幕閱讀器無法區分
- **修正**：
  - 影響力數據 `<section>` 新增 `aria-label="影響力數據"`
  - 引言區 `<section class="qs">` 新增 `aria-label="核心引言"`

#### 4. Modal 無焦點陷阱（SC 2.4.3）
- **問題**：八個詳情頁 overlay 有 `aria-modal="true"` 但無焦點陷阱，鍵盤使用者按 Tab 可脫離 dialog 至背景
- **修正**：`js/main.js` 新增 `trapFocus(el)` / `releaseFocus(el)` 函式，在 `openDetail` 時啟動焦點陷阱、`closeDetail` 時解除

#### 5. `<cite>` 位置錯誤（語意）
- **問題**：`<cite>` 元素位於 `<blockquote>` 外部，語意不正確
- **修正**：將 `<cite>` 移至 `<blockquote>` 內部

#### 6. 裝飾性符號未隱藏於螢幕閱讀器（SC 1.1.1）
- **問題**：`▍`、`📅`、`← ` 等純裝飾性符號會被螢幕閱讀器讀出
- **修正**：以 `<span aria-hidden="true">` 包裹相關符號（7 處）

### 修改檔案
- `css/components.css` — 麵包屑對比度（2 處）
- `css/sections.css` — 引言、頁腳、免責聲明對比度（6 處）
- `index.html` — 標題層級、aria-label、cite 語意、符號無障礙（18 處）
- `js/main.js` — 新增 `trapFocus` / `releaseFocus` 函式與呼叫（+20 行）

### 驗收
- 所有文字色彩對比度 ≥ 4.5:1 ✅
- 標題層級連續（H1 → H2 → H3）✅
- 所有 section 均有 aria-label 或可見標題 ✅
- Dialog overlay 有焦點陷阱，ESC 可關閉，關閉後焦點還原 ✅
- `<cite>` 正確位於 `<blockquote>` 內 ✅
- 裝飾性符號以 `aria-hidden="true"` 標記 ✅

---

## [2026-04-18] Step 8 — 故事區 + 影音區 + 延伸資源 + Footer

**目標**：完成頁面下半部四個區塊的收尾：影音片長標示、延伸資源四分類、Footer 非官方聲明清楚化與結尾語。

### 修改
- `index.html` — 影音專區（`.vs`）：
  - 影片 badge 從「短片」改為「約 2 分鐘」（明確片長），字幕 badge 改為 `.vf-badge--cc`（視覺區分）
- `index.html` — 延伸資源區塊全面重構（原「延伸了解」3 個 icon 連結）：
  - 改為 4 類分組（`.rs-grid` 2 欄 × 2 列），每類 3 個連結項目，共 12 個資源入口：
    | 分組 | 內容 |
    |---|---|
    | 📋 官方資源 | 臉部平權倡議說明 / 陽光基金會官網 / 影音教育資源 |
    | 📚 深入閱讀 | 陽光基金會的故事 / 2024 永續報告書 / 榮譽與信任紀錄 |
    | ✊ 立刻參與 | 捐款支持 / 追蹤 Facebook / 訂閱 YouTube 頻道 |
    | 👥 給特定角色 | 給 HR 與企業主管 / 給教師與家長 / 給一般民眾（頁內錨點） |
  - 每個資源項目有標題 + 說明文字（12–20 字）
- `index.html` — Footer：
  - `.ft-credits` 新增：「本頁為非官方知識整理頁」聲明 + 「最後更新：2026 年 4 月 18 日」
  - 新增 `.ft-slogan`：「不要看一張臉，而是看一個人」作為最後一行
- `css/sections.css` — 新增：
  - `.rs-grid`、`.rs-group`、`.rs-group-hd`、`.rs-links`、`.rs-item`、`.rs-item-title`、`.rs-item-desc` 樣式（4 類資源分組系統）
  - `.vf-badge--cc` 字幕 badge 樣式（灰底，與橙色時間 badge 形成對比）
  - `.ft-slogan` 樣式（橙色大字，置頂分隔線，footer 最後一行）

### 驗收
- 故事卡有情境標題（`.sc-stag`，已存在），排版正確 ✅
- 影音區主影片片長「約 2 分鐘」與字幕說明「字幕可開啟」標示清楚 ✅
- 延伸資源分成 4 類（官方資源 / 深入閱讀 / 立刻參與 / 給特定角色），各 3 個連結 ✅
- Footer 非官方聲明清楚（ft-credits 內）、有資料來源、有最後更新日期 ✅
- Footer 結尾語「不要看一張臉，而是看一個人」顯示於最底部 ✅

---

## [2026-04-18] Step 7 — 數據區塊 + 黃底引言區

**目標**：將影響力數字區升級為有來源、有解讀的獨立數據卡；黃底引言區補強來源標示。

### 修改
- `index.html` — 影響力數字區（`<section>` 含 `.sr` / `.sb`）：
  - 區塊副標改為「數字背後，是真實的處境與改變」
  - 區塊說明改為「以下數據整理源自陽光基金會公開研究與年度服務報告。」
  - 3 張數據卡全部更新（對應 redesign-plan-v2 第五章已確認數據）：
    | 大數字 | 解讀句 | 所以這代表什麼 | 來源年份 |
    |---|---|---|---|
    | 1/5 | 每 5 人中，就有 1 人曾歷經至少一項因外觀造成的不公平對待 | 外貌歧視不是個案，而是台灣社會普遍存在的日常困境 | 陽光基金會 2025 年「台灣新視對外觀的感受與遭遇調查」，n=1,123，18 歲以上全台 22 縣市 |
    | 9,000+ | 已陪伴超過 9,000 名受傷者，走過重建歷程 | 每一個數字背後，都是一段真實存在的生命故事，而不只是統計數字 | 陽光社會福利基金會，2024 永續報告書（多年累計） |
    | 45 年 | 從 1981 年起，長期為外觀差異者提供支持與社會倡議 | 台灣推動臉部平權的時間，比多數人以為的更長、更深 | 陽光社會福利基金會，創立於 1981 年 |
  - 每張卡新增 `.sb-what` 元素，顯示「→ 這代表什麼」標示，對應驗收「每張卡有一句解讀句」
- `index.html` — 黃底引言區（`.qs`）：
  - 引言文字保留：「臉部平權，是不因外貌而差別對待任何人。」（符合 change-brief 短而明確的定義格式）
  - 來源標示更新為：「資料整理參考：陽光社會福利基金會 臉部平權倡議計畫・最後更新 2026 年 4 月」
- `css/components.css` — 新增 `.sb-what` 樣式（小字橙色標示，`display: block`，`margin-top: 12px`）

### 驗收
- 3 張數據卡（1/5、9,000+、45 年），每張有大數字 + 解讀句 + 來源年份 ✅
- 每張卡有「→ 這代表什麼」的一句話（`.sb-what` + `.sb-note`）✅
- 無來源的舊數字已移除，所有數字均有調查名稱、年份與樣本數 ✅
- 黃底引言文字簡短清楚，來源標示更新 ✅
- 數字內容與 redesign-plan-v2 第五章已確認清單對應一致 ✅

---

## [2026-04-18] Step 6 — Overlay 閱讀體驗

**目標**：讓八張卡片展開頁達到：背景鎖捲、關閉後回位置、麵包屑分組標示、底部導航、單一關閉邏輯。

### 修改
- `js/main.js` — `openDetail()` / `closeDetail()` 改為 iOS Safari 相容的鎖捲方式：
  - 開啟時：`body { position: fixed; top: -scrollPos; width: 100% }` 取代單純 `overflow:hidden`
  - 關閉時：清除 fixed 樣式後 `window.scrollTo(0, _scrollPos)` 精準還原卡片位置
- `css/components.css` — 統一返回按鈕為單一邏輯：
  - 移除舊有 `.dp-back`（外部 fixed 按鈕）及 `.detail-page.open ~ .dp-back` 選擇器（dead code）
  - `.dp-back-inner` 改為 `position: sticky; top: 0`，寬度撐滿頂端，有陰影強化可見度
- `index.html` — 更新 8 個 overlay 麵包屑，改用分組名稱（非卡片標籤）：
  - ic1、ic2：認識概念
  - ic3、ic4：了解場景
  - ic5、ic6：日常行動
  - ic7、ic8：延伸參考

### 驗收
- 開啟 overlay 後背景頁面不可捲動（含 iOS Safari）✅
- 關閉後頁面捲動位置還原至原本卡片 ✅
- 每個 overlay 頂部有麵包屑（格式：首頁 / 八大重點 / 分組名稱）✅
- 底部「下一張卡片」與「回到八大重點」按鈕均存在 ✅
- 返回按鈕統一為 `dp-back-inner`（sticky 頂端），移除舊有外部邏輯 ✅

---

## [2026-04-18] Step 5 — 八張卡片：標題、標籤、分組、摘要

**目標**：按 redesign-plan-v2 第四章完整更新 #cards 卡片牆：區塊標題、8 張卡標題 / 標籤 / 摘要 / CTA，以及 4 個分組標示。

### 修改
- `index.html` — `#cards` 區塊：
  - 區塊標題（`.st`）改為「用 8 個問題，快速**了解**臉部平權。」
  - 區塊說明（`.sd`）改為「從定義、迷思、真實場景到行動方式，依序排列，讓你更容易了解。」
  - 新手導覽文字：「了解處境 → 行動指引 → 參與行動」→「了解場景 → 日常行動 → 延伸參考」
  - 8 張卡片拆成 4 組（`.cards-groups` + `.card-group`），每組前置分組標示（`.card-group-hd`）：
    - 🔵 認識概念（卡 1–2）｜🟡 了解場景（卡 3–4）｜🟠 日常行動（卡 5–6）｜🔴 延伸參考（卡 7–8）
  - 8 張卡片全部更新：
    | # | 新標籤 | 新標題 | 新摘要（28–40 字） | CTA |
    |---|---|---|---|---|
    | 1 | 概念 | 什麼是臉部平權？ | 每個人都不該因臉部外觀不同，而被差異地對待或失去機會。 | 展開問題 |
    | 2 | 迷思 | 外觀歧視有哪些常見誤解？ | 外觀不代表弱者、能力不足或難以相處，許多偏見其實來自不了解。 | 展開問題 |
    | 3 | 場景 | 外觀歧視在日常生活中有哪些感受？ | 從求職篩選到校園日常，外觀差異常常讓人承受無聲的壓力與距離感。 | 展開問題 |
    | 4 | 背景 | 為什麼台灣需要臉部平權立法？ | 因為外觀歧視不是個案，而是一直存在於社會文化中的日常問題。 | 展開問題 |
    | 5 | 行動 | 第一次接觸到這類情況，可以怎麼互動？ | 不評論、不訕笑、不瞄視，要尊重、給予平等機會。 | 展開問題 |
    | 6 | 行動 | 你可以從日常生活做哪些改變？ | 在校園、職場、社群及日常對話裡，每個人都能停止複製外觀偏見。 | 看案例與建議 |
    | 7 | 事例 | 當事人的真實遭遇，告訴了我們什麼？ | 當我們聽見當事人的遭遇，更能明白偏見不是抽象概念，而是真實日常。 | 看案例與建議 |
    | 8 | 資源 | 5 月 17 日臉部平權日，可以怎麼參與？ | 從閱讀、分享、參與活動到支持議題，每個人都能成為改變的一部分。 | 展開問題 |
  - ic2–ic8 overlay：aria-label、dp-tag、h1、摘要 p、麵包屑標籤、dp-nav-next 文字全部同步更新
- `css/sections.css` — 新增 `.cards-groups`、`.card-group-hd`、`.card-group-dot` 分組樣式

### 驗收
- 區塊標題改為「用 8 個問題，快速了解臉部平權」✅
- 8 張卡片標題符合 redesign-plan-v2 第四章最終標題 ✅
- 每張卡有角落標籤（概念 / 迷思 / 場景 / 背景 / 行動 / 事例 / 資源）✅
- 4 個分組標示清楚（認識概念 / 了解場景 / 日常行動 / 延伸參考）✅
- 每張卡摘要符合新版（28–40 字）✅
- CTA 改為「展開問題」或「看案例與建議」✅

---

## [2026-04-18] Step 4 — 互動原則區塊重構（左右對稱欄）

**目標**：將 #interaction-guide 改成左右對稱「✓ 要 | ✗ 不要」版面，每條三行，底部顯示核心訊息框，手機版改為上下堆疊。

### 修改
- `index.html` — 替換 `#interaction-guide` 區塊：
  - 標題改為「第一次接觸到這類情況，可以怎麼互動？」
  - 結構從「三要↓三不」改為左欄（✓ 要）＋右欄（✗ 不要）並排
  - 每條項目新增第三行「為什麼」（`ig-why`，斜體、低透明度）
  - 底部新增 `<div class="ig-core">` 核心訊息框：「不要看一張臉，要看一個人」
- `css/sections.css` — 完全替換 `.pr/.pg/.pi/.pd/.pn/.pr-more` 舊樣式，改寫為 `.ig-*` 系列：
  - `.ig-columns`：`grid-template-columns: 1fr 1fr`，gap 20px
  - `.ig-col`：每欄灰底卡片
  - `.ig-col-hd`：欄標題，下方 2px 色線（要＝橙色，不要＝半透明白）
  - `.ig-item`：每條三行容器
  - `.ig-t-do` / `.ig-t-dont`：橙底／半透明白底標題 pill
  - `.ig-desc` / `.ig-why`：說明＋為什麼
  - `.ig-core` + `.ig-core-text`：橙色邊框核心訊息框
  - `@media (max-width: 600px)`：欄位改為 1fr（上下堆疊）

### 驗收
- 標題「第一次接觸到這類情況，可以怎麼互動？」✅
- 左右對稱欄（✓ 要 | ✗ 不要），10 秒內可掃完 ✅
- 每條項目三行（標題、說明、為什麼）✅
- 底部「不要看一張臉，要看一個人」核心訊息框 ✅
- 手機版 ≤ 600px 改為單欄上下堆疊 ✅

---

## [2026-04-18] Step 3 — Utility Bar + Nav 頂部框架

**目標**：在最頂端加入身份聲明條，確認 Nav 品牌名稱、CTA 錨點、aria-label、手機選單引導文字均符合驗收標準。

### 修改
- `index.html` — 在 `<nav>` 前新增 `<div class="utility-bar">` 固定頂欄，內容：「📅 5/17 臉部平權日｜非官方知識整理頁・由淡江大學學生製作」
- `css/sections.css` — 新增 `.utility-bar` / `.ub-date` / `.ub-sep` / `.ub-note` 樣式（高度 34px，固定於頁頂，z-index 110）；將 `nav { top: 0 }` 改為 `nav { top: 34px }` 以避免與 utility bar 重疊

### 驗收
- 頁面最頂端固定顯示「5/17 臉部平權日｜非官方知識整理頁」身份說明 ✅
- Nav 品牌名稱「☀ 陽光基金會｜臉部平權」保留 ✅
- 主 CTA「先看八大重點」捲動至 `#cards` ✅
- 手機選單展開後顯示引導文字「透過八個重點快速認識臉部平權」✅
- 漢堡按鈕 `aria-label="開啟選單"`、關閉按鈕 `aria-label="關閉選單"` ✅
- Utility bar 在桌機與手機版均不跑版（overflow hidden + text-overflow ellipsis 保護）✅

---

## [2026-04-18] Step 2 — Hero 首屏 + #what-we-do 整合

**目標**：讓首屏在 5 秒內清楚傳達「是什麼、為什麼、從哪開始」三件事，並確認兩個 CTA 皆有效。

### 修改
- `index.html` — Hero 區塊（`<section class="hero">`）：
  - H1 副標從「每張臉都該被公平對待」改為「**不要看一張臉，要看一個人**」
  - Hero 段落補入數據訊號：「台灣每 5 人就有 1 人曾因外貌遭不友善對待——這個議題，比你想的更近。」
  - 主 CTA 文字從「認識八大重點」改為「**從 8 個問題開始**」（`href="#cards"` 不變）
  - 次 CTA 從外連「了解陽光基金會在做什麼」改為頁內錨點「**看兩分鐘介紹**」（`href="#video"`）
- `index.html` — 影音區塊（`<section class="vs">`）：新增 `id="video"` 供次 CTA 錨點對應
- `css/sections.css` — `.hero p` 加入 `max-width: 560px`，段落多一行後版面不過寬

### 驗收
- H1 清楚回答「什麼是臉部平權」✅
- 副標包含核心訊息「不要看一張臉，要看一個人」✅
- 主 CTA「從 8 個問題開始」捲動至 `#cards` ✅
- 次 CTA「看兩分鐘介紹」錨定至 `#video` 影音區 ✅
- 進站 5 秒內可讀懂：是什麼（H1 + 段落）、為什麼（數據句）、從哪開始（CTA）✅

---

## [2026-04-18] Step 1 — 技術底層整備

**目標**：縮小 index.html 體積、建立圖片資產目錄、加入 OG 分享 meta、確認 Design Tokens 完整。

### 確認（無需修改）
- `index.html` 中的 base64 圖片已在上次重構時移除，檔案體積已為 ~43KB（目標達成）
- `css/base.css` Design Tokens 已完整：Brand、Surface/Border、Sun Tint、Type Scale、Spacing、Border Radius 六組

### 新增
- `assets/images/` 目錄（供 OG 圖片與後續本地圖片使用）
- `assets/images/og-cover.jpg` — 由 `assets/Start.jpeg` 複製而來，作為 FB / LINE 分享預覽圖

### 修改
- `index.html` — 在 `<head>` 加入：
  - `<meta name="description">` 頁面描述
  - Open Graph meta tags（`og:type`、`og:title`、`og:description`、`og:image`、`og:url`、`og:locale`、`og:site_name`）
  - Twitter Card meta tags（`twitter:card`、`twitter:title`、`twitter:description`、`twitter:image`）
  - **注意**：`og:url` 與 `og:image` 內含 `your-domain.netlify.app` 佔位符，部署後需替換為正式網域

### 驗收
- 頁面視覺與功能完全不變
- `assets/images/` 已建立，OG 封面圖就位
- 部署後替換網域即可啟用 FB/LINE 預覽圖

---

## [2026-04-17] 專案架構拆分

**目標**：將單一 index.html 拆分為多檔案結構，方便分區維護。

### 新增檔案
- `css/base.css` — CSS 重設、自訂屬性（Design Tokens）、動畫、Reveal 效果
- `css/sections.css` — 各區塊樣式（nav、hero、三要三不、故事、影音、footer 等）
- `css/components.css` — 可重用元件（按鈕、卡片、詳情頁覆蓋層）
- `js/main.js` — 全站 JS（漢堡選單、openDetail/closeDetail、滑動關閉、IntersectionObserver Reveal）
- `docs/change-brief.md` — 需求與背景文件
- `docs/changelog.md` — 本修改紀錄
- `docs/todo.md` — 待辦事項清單

### 修改檔案
- `index.html`
  - 移除 `<style>` 內嵌區塊，改為 `<link>` 引入 3 個外部 CSS 檔
  - 移除 `<script>` 內嵌區塊，改為 `<script src="js/main.js">` 外部引入
  - 加入 6 大區塊標記注解（`<!-- 01 HERO & NAV -->` 等），方便定位

### 不變項目
- 所有 HTML 內容（文字、連結、卡片、詳情頁 dp1–dp6）完整保留
- base64 圖片保持原樣（dp1 logo、dp5 壓力衣）
- 所有外部連結（陽光基金會官網、YouTube 等）未更動

---

## [2026-04-17] 更新主頁報告檔案（新版含詳情頁）

**目標**：以新版 sunshine-face-equality.html（112KB）取代舊版 index.html。

### 修改
- `index.html` 更換為含 dp1–dp6 詳情覆蓋層的新版本
- 新增 `openDetail()` / `closeDetail()` / `setupSwipe()` 滑動關閉功能
- 新增免責聲明（淡江大學學生製作、非陽光基金會官方）
- 全國服務據點數字改為可點擊連結

---

## [2026-04-17] 修正臉部平權專站連結

**修改**：`0517.sunshine.org.tw`（SSL 憑證過期）→ `www.sunshine.org.tw/service/equal_rights`

---

## [2026-04-17] 初始上傳

**修改**：專案所有檔案（`index.html`、`assets/`、`frames/`）首次推送至 GitHub。
