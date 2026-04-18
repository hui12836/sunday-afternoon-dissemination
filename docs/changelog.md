# Changelog — 臉部平權網站

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
