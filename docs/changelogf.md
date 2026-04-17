# Changelog

---

## 2026-04-17 — 除錯：可用性與可操作性修正

### 更動範圍
`css/sections.css`、`index.html`

### 更改內容

**更正｜Footer 分組連結版型破損（sections.css）**
- 問題：`.ft-links` 使用 `grid-template-columns: 1fr 1fr`，但有三個 `.ft-group`，第三組（聯絡我們）獨佔第二列左半，右側空白，版型不完整
- 修正：改為 `repeat(auto-fit, minmax(120px, 1fr))`，自動適配欄位數，三組皆可同列顯示

**更正｜影片折疊箭頭旋轉失效（sections.css）**
- 問題：`.vs-more[open] summary span` 的 `transform: rotate(180deg)` 只在 `[open]` 狀態加入 `display: inline-block`，基礎狀態為 `inline`，`transform` 在部分瀏覽器對 inline 元素無效；且折疊/展開時箭頭無動畫
- 修正：將 `display: inline-block` 移至基礎規則 `.vs-more summary span`，並補上 `transition: transform .25s`，箭頭現在可平滑旋轉

**更正｜border-radius token 誤用（sections.css）**
- 問題：`.vs-summary` 和 `.vs-more` 使用 `var(--gap-sm)`（間距 token，10px）作為圓角，語意錯誤
- 修正：改為 `var(--r-sm)`（border-radius token，8px），符合設計 token 系統語意

**更正｜HTML 區塊注解過期（index.html）**
- 問題：卡片區注解仍標示「六張議題卡片 + dp1-dp6」，與現有八張卡 ic1-ic8 不符
- 修正：更新為「八張議題卡片 + ic1-ic8 詳情覆蓋層」

---

## 2026-04-17 — CSS 全站 Token 化

### 更動範圍
`css/base.css`、`css/components.css`、`css/sections.css`

### 更改內容

**加入｜擴充 `:root` Design Token 集（base.css）**
- 原有 5 個基本品牌色 token 擴充為完整設計系統，新增四類共 28 個 token：
  - **Surface & Border**：`--surface-faint`（.04）、`--surface-low`（.06）、`--divider`（.08）、`--border-soft`（.10）、`--nav-bg`（導覽列背景）
  - **Sun Tint**：`--sun-bg`（.08 底色）、`--sun-bg-md`（.12 badge 底色）、`--sun-border`（.25 邊框）
  - **Type Scale**：`--fs-2xs`～`--fs-3xl` 共 10 級字級（.68rem → 2.2rem），另有 `--fs-stat`（2rem，數字展示專用）
  - **Spacing**：`--section-py/px`（52px/20px）、`--card-py/px`（22px/18px）、`--gap-sm/md`（10px/12px）
  - **Border Radius**：`--r-xs`（4px）至 `--r-pill`（24px）共 6 級，含 `--r-full`（50%）
- 符合 change-brief 建議：「建議改成 token 化，例如統一色彩層級、字級層級、卡片 spacing 與 button 樣式」

**更正｜components.css — 全面替換 hardcoded 值**
- 所有 `rgba(255,255,255,.04/.06/.08)` → 對應 `--surface-faint / --surface-low / --divider`
- `border-radius: 14px / 20px / 24px` → `var(--r-md) / var(--r-lg) / var(--r-pill)`
- `font-size: .68～2rem` 散落值 → 對應 `--fs-2xs`～`--fs-stat` token
- `gap: 10px / 12px` → `var(--gap-sm) / var(--gap-md)`
- sun tint `rgba(245,166,35,.08/.12/.25)` → `--sun-bg / --sun-bg-md / --sun-border`

**更正｜sections.css — 全面替換 hardcoded 值**
- `section { padding: 52px 20px }` → `var(--section-py) var(--section-px)`
- `nav { background: rgba(26,26,26,.95) }` → `var(--nav-bg)`
- 所有卡片 border-radius（14px/16px/20px）→ `var(--r-md) / var(--r-lg)`
- 所有字級散值（.65rem～2.2rem 共 15+ 種）→ 對應 type scale token
- footer、disclaimer、卡片區所有 `rgba(255,255,255,.X)` 邊框底色 → 對應 surface token

### 字級整合說明
為統一字級層級，相近尺寸合併至同一 token（誤差 ≤5%，視覺可忽略）：
- .65/.68/.72rem → `--fs-2xs`（.68rem）
- .74/.75/.76/.78/.80rem → `--fs-xs`（.78rem）
- .82/.85/.88rem → `--fs-sm`（.85rem）
- .90/.92rem → `--fs-md`（.92rem）
- 1rem/1.05rem → `--fs-lg`（1rem）
- 1.25/1.3/1.4rem → `--fs-xl`（1.3rem）
- 1.7/1.75/1.8rem → `--fs-2xl`（1.75rem）

---

## 2026-04-17 — 可及性細節全面補強

### 更動範圍
`index.html`、`js/main.js`、`css/base.css`

### 更改內容

**刪除｜移除阻止縮放的 viewport 設定**
- 舊：`maximum-scale=1.0`（阻止使用者以瀏覽器縮放頁面，違反 WCAG 1.4.4 Resize Text）
- 新：移除此屬性，使用者可自由縮放至 200%+

**加入｜跳至主要內容連結（`.skip-link`）**
- 位置：頁面最頂部，`<nav>` 之前
- 預設以 `top: -48px` 隱藏在視區外；Tab 聚焦時滑入畫面
- 讓鍵盤使用者可直接跳過導覽列進入主內容，不須 Tab 過每個 nav 連結
- CSS 加入 `.skip-link`（黃底深字）和 `.skip-link:focus`（滑入動畫）

**加入｜8 個 Overlay 的 dialog 語意**
- 每個 `.detail-page` 加入：`role="dialog"` + `aria-modal="true"` + `aria-hidden="true"` + `aria-label="[主題名稱]"`
- 螢幕閱讀器現在能正確識別 overlay 為對話框，而非一般頁面內容

**更正｜Overlay 焦點管理（`js/main.js`）**
- `openDetail()`：記錄觸發元素（`_triggerEl = document.activeElement`），開啟後將焦點移至 overlay 內關閉按鈕；同步將 overlay 設為 `aria-hidden="false"`
- `closeDetail()`：關閉後將焦點還給觸發的卡片（`_triggerEl.focus()`）；同步設回 `aria-hidden="true"`
- 符合 WCAG 2.1 SC 2.4.3 Focus Order

**加入｜ESC 鍵關閉 overlay**
- 新增全域 `keydown` 監聽，按 ESC 時關閉當前開啟的 overlay
- 符合 ARIA Authoring Practices Guide 對話框模式規範

**加入｜Section 語意標籤補強**
- `#what-we-do` 加 `aria-label="我們在做什麼"`
- `#interaction-guide` 加 `aria-label="互動原則：三要三不"`
- 故事區 `<section>` 加 `aria-label="真實的聲音"`
- 橫向滑動 `.ss` 加 `role="region" aria-label="真實故事卡片，可左右滑動瀏覽"`

**加入｜補齊缺漏的 `rel="noopener"`**
- 故事卡片 5 個外連（了解職場平權、職場行動指引、基金會起源、互動原則、TC News）均補上 `rel="noopener"`
- Overlay ic8 的 `.dp-cta` 連結補上 `rel="noopener"` + `aria-label`（含「另開新視窗」提示）

---

## 2026-04-17 — 加入「我們在做什麼」區塊 + 新手導覽引導條

### 更動範圍
`index.html`、`css/sections.css`

### 更改內容

**加入｜「我們在做什麼」說明區塊（`#what-we-do`）**
- 新增獨立 section，位置：Hero 首屏之後、八大卡片之前
- 以三格卡片（`.wwd-item`）呈現，各回答一個核心問題：
  1. **臉部平權是什麼？** — 核心定義：不因外表遭受歧視或限制機會
  2. **社會誤解有多普遍？** — 引用 2025 年調查（1,123 人），每 5 人就有 1 人受影響
  3. **這頁面能幫你做什麼？** — 說明八個問題的學習範疇（定義、迷思、處境、行動、故事、活動）
- 符合 change-brief 建議：「首屏不應只停在價值感訴求，而要直接回答三件事」、「在八張卡片前或緊接 hero 後」

**加入｜新手導覽引導條（`.guide-intro`）**
- 位置：八大卡片區塊標題之後、卡片格之前
- 文案：「新手導覽｜卡片已按理解順序排列，建議依序閱讀：認識概念 → 了解處境 → 行動指引 → 參與行動」
- 黃色左邊框樣式，讓首次進站者清楚知道卡片具有教學順序
- 符合 change-brief 建議：「增加一句引導文，讓八張卡片從一般卡片牆，變成一套有教學邏輯的閱讀路徑」

**加入｜CSS 新增（sections.css）**
- `#what-we-do`：max-width 960px，居中對齊
- `.wwd-grid`：自適應三欄 grid，最小寬度 240px
- `.wwd-item`：低透明度深色背景卡片，圓角 14px
- `.wwd-num`：黃色大號數字（01/02/03），粗體
- `.wwd-q`：問題標題，白色 1rem 粗體
- `.wwd-a`：說明文，低透明度 .88rem，行高 1.75
- `.guide-intro`：黃色左邊框引導條，低黃底背景
- `.guide-intro strong`：黃色強調「新手導覽」文字

---

---

## 2026-04-17 — 全站共通修改

### 更動範圍
`index.html`、`js/main.js`、`css/base.css`、`css/sections.css`、`css/components.css`

### 更改內容

**更正｜導覽列品牌名稱強化識別**
- 舊：`☀ 陽光基金會`（只放機構名稱）
- 新：`☀ 陽光基金會｜臉部平權`（同時呈現機構與議題）
- 符合 change-brief 建議：「改成『陽光基金會｜臉部平權』讓首次進站者更容易理解主題」

**更正｜導覽列主按鈕改為頁內 CTA**
- 舊：`臉部平權` → 外連陽光基金會倡議頁（`target="_blank"`）
- 新：`先看八大重點` → 頁內錨點捲動到 `#cards`
- 讓主行動從「離開頁面」改為「留在頁面深入閱讀」
- 符合 change-brief 建議：「把主按鈕改成頁內 CTA，讓它捲動到卡片區」

**更正｜手機選單精簡，移除分散使用者的外連**
- 刪除：服務項目、陽光的故事、影片專區（這三個把使用者從主頁流程拉走）
- 刪除：社群列表中的 LINE（與 footer 保持一致）
- 保留：臉部平權、職場臉部平權指引、陽光基金會官網（三個最具延伸價值的入口）
- 符合 change-brief 建議：「刪除導覽列中過早出現太多外部連結」

**加入｜手機選單頂部短說明（`.mo-hint`）**
- 新增：「透過**八個重點**快速認識臉部平權」
- 讓手機選單不只是連結清單，而有上下文說明
- 符合 change-brief 建議：「在手機選單最上方加入一句短說明」

**加入｜漢堡與關閉按鈕補上 `aria-label`**
- 漢堡按鈕：`aria-label="開啟選單"`
- 關閉按鈕：`aria-label="關閉選單"`
- 符合 change-brief 建議：「漢堡按鈕與關閉按鈕補上 aria-label，對無障礙不利」

**加入｜無障礙 ARIA 狀態管理（JS）**
- `toggleMenu()` 現在同步更新：`aria-expanded`（漢堡按鈕）、`aria-hidden`（選單容器）
- 關閉選單後焦點自動回到漢堡按鈕，符合鍵盤操作規範
- 手機選單加 `role="navigation"` + `aria-label="行動選單"`

**加入｜`<main>` 頁面主要內容 landmark**
- 以 `<main id="main-content">` 包住 Hero 至免責聲明之間所有內容
- `<footer>` 維持在 `<main>` 之外（語意正確）
- 讓螢幕閱讀器可直接跳到主要內容區

**加入｜section aria-label（語意補強）**
- `<section class="hero">` 加 `aria-label="認識臉部平權"`
- `<section id="cards">` 加 `aria-label="八大重點"`

**加入｜全站 `:focus-visible` 鍵盤聚焦樣式（base.css）**
- 預設移除 `:focus` outline（避免滑鼠使用者看到雜訊）
- 鍵盤 Tab 切換時顯示 `2px solid var(--sun)` 金色外框（`border-radius: 4px`）
- 卡片額外加 `3px solid var(--sun)`（`.card:focus-visible`）

**加入｜外連補 `rel="noopener"`**
- 所有 `target="_blank"` 的連結統一補上 `rel="noopener"`（安全規範）

**加入｜CSS 新增（sections.css）**
- `.mo-hint`：手機選單頂部說明文，灰色小字，底部分隔線
- `.mo-hint strong`：關鍵字黃色高亮

---

---

## 2026-04-17 — Footer 改版

### 更動範圍
`index.html`、`css/sections.css`

### 更改內容

**刪除｜精簡社群入口，從 4 個減為 3 個**
- 移除 LINE 連結（使用率較低，且無法量化對倡議傳播的貢獻）
- 保留 FB、IG、YT 三個主要平台，加入 `aria-label` 補完語意
- 符合 change-brief 建議：「刪掉過多重複的社群入口，保留真正常用的 2 到 3 個」

**更正｜Footer 最上方加總結導引句（`.ft-lead`）**
- 新增：「從理解開始，讓每張臉都被公平對待。」
- 作為整頁閱讀後的收尾，承接下一步而非只有出口
- 符合 change-brief 建議：「footer 最上方先放一句總結型導引」

**更正｜連結改為三欄分組（`.ft-links` + `.ft-group`）**
- 舊：`.fl` 一排散列 4 個連結（官方網站、財務報告、榮譽紀錄、永續報告）
- 新：三組分欄，各有小標題：
  - **認識議題**：臉部平權倡議說明、職場外貌歧視研究、影音教育資源
  - **延伸資源**：陽光基金會官網、榮譽與信任紀錄、永續發展報告
  - **聯絡我們**：捐款支持陽光基金會、sun@sunshine.org.tw、服務專線
- 符合 change-brief 建議：「連結分組成『認識議題／延伸資源／聯絡我們』，比一排散列更清楚」

**加入｜聯絡窗口與捐款入口**
- 新增「捐款支持陽光基金會」連結（→ sunshine.org.tw/donate）
- 保留 Email 與電話於「聯絡我們」欄位中
- 符合 change-brief 建議：「加入聯絡窗口、倡議頁面等實際有用的去處」

**加入｜資料來源引用區（`.ft-credits`）**
- 新增細字引用區，標明：
  - 資料來源：陽光基金會官網及公開倡議資料、外貌歧視民調（2025，n＝1,123）
  - 圖片來源：Unsplash 免費圖庫
  - 影片來源：陽光基金會 YouTube 頻道
- 符合 change-brief 建議：「若有資料引用、圖片來源、影片來源，建議在 footer 補充，增加專業度」

**加入｜CSS 新增（sections.css）**
- `.ft-lead`：總結導引句，1rem 粗體白字
- `.ft-links`：2 欄 grid 分組容器
- `.ft-group`：flex 欄排列連結群組
- `.ft-group-title`：黃色小寫群組標題
- `.ft-group a` / `.ft-tel`：連結與電話文字樣式
- `.ft-org`：機構地址小字
- `.ft-credits`：引用來源區塊，細字低透明度
- 移除舊有 `footer .fl`、`footer p` 通用樣式（改為各自具名類別）

---

## 2026-04-17 — 影片區塊改版

### 更動範圍
`index.html`、`css/sections.css`

### 更改內容

**刪除｜移除橫向滑動影片圖庫**
- 舊：5 支影片並排於橫向 scroll gallery（`.vg` + `.vi`），像影音平台瀏覽頁
- 新：1 支代表影片完整呈現，其餘 4 支收進折疊區
- 符合 change-brief 建議：「刪除過多影片並排的呈現，首頁不需要像影音平台」

**更正｜只保留 1 支代表影片（`.vf`）**
- 選定：「臉部平權 — 從心認識篇」（最具議題普遍性）
- 配合 section 副標題改為「用 2 分鐘，認識臉部平權」
- 縮圖全寬呈現（16:9），hover 時播放按鈕放大，點擊開啟 YouTube
- 符合 change-brief 建議：「只保留 1 支代表影片，搭配清楚說明，讓入口清楚」

**加入｜代表影片旁補明確標示（`.vf-badges`）**
- 新增「短片」與「字幕可開啟」兩枚 badge
- 符合 change-brief 建議：「影片縮圖旁要加明確長度、字幕提示」

**加入｜影片說明文（`.vf-desc`）**
- 一段 2–3 句的影片摘要，說明影片核心主題
- 符合 change-brief 建議：「搭配一句說明，讓入口清楚」

**加入｜文字摘要區（`.vs-summary`）**
- 針對不方便播放聲音或不想看片的使用者，提供影片核心文字摘要
- 以黃色左邊框樣式區隔，標示「不方便播放聲音？」
- 符合 change-brief 建議：「若影片是關鍵內容，應提供文字摘要」

**更正｜其他影片收進折疊區（`.vs-more`，`<details>`）**
- 其餘 4 支影片改為文字清單，以 `<details>` 折疊，預設收起
- 每則含片名連結 + 一行說明文字
- 符合 change-brief 建議：「其他影片收進『更多影片』按鈕，不要全部攤在首頁」

**加入｜CSS 新增（sections.css）**
- `.vf`：代表影片容器，圓角卡片
- `.vf-img`：16:9 縮圖容器，含 `<img>` 與播放按鈕覆蓋層
- `.vf-play`：絕對定位播放符號，hover 放大
- `.vf-badges` / `.vf-badge`：短片 / 字幕標示
- `.vf-title` / `.vf-desc`：影片標題與說明文
- `.vs-summary` / `.vs-summary-label`：文字摘要區塊
- `.vs-more`：`<details>` 折疊區，含 open 狀態箭頭旋轉
- `.vs-more-list`：影片清單樣式
- `.vs-channel`：YouTube 頻道連結置中樣式
- 移除舊有 `.vg`、`.vi`、`.vi .vth`、`.vi .vt` 樣式

---

## 2026-04-17 — 相關連結圖示區改版

### 更動範圍
`index.html`、`css/sections.css`

### 更改內容

**刪除｜移除與主學習路徑無關的外連捷徑**
- 刪除「影片專區」連結（頁面上方已有完整影音區塊，重複）
- 刪除「追蹤 Instagram」與「追蹤 Facebook」連結（社群入口不屬於知識學習路徑）
- 從 6 個連結精簡為 3 個，僅保留：認識臉部平權、職場平權行動指引、陽光基金會的故事

**更正｜區塊重新命名**
- 舊 label：`▍快速連結`（像主導航）
- 新 label：`▍延伸了解` + 副標題「更多資源，深入認識臉部平權」
- 符合 change-brief 建議：「不要讓它看起來像主導航」

**更正｜圖示從 emoji 改為 SVG icon 系統**
- 舊：📖 🏢 🎬 📙 📱 💬（表情化 emoji，視覺不一致）
- 新：統一使用 stroke-based 線性 SVG icon，語意明確（書本、職場、太陽）
- 符合 change-brief 建議：「改成一致、簡潔、語意明確的 icon 系統」

**加入｜每個入口下方補 1 行說明文（`.ik-desc`）**
- 「看完整倡議說明與核心概念」
- 「了解求職與職場的平權行動」
- 「認識陽光基金會的起源與使命」
- 符合 change-brief 建議：「每個入口下面加 1 行 10 到 16 字的說明，提高可預期性」

**加入｜CSS 新增（sections.css）**
- `.ik-desc`：小字（.68rem）、低透明度（.5），顯示說明文於標題下方
- `.ic svg`：固定 22×22px，繼承父層 `color` 實現 `currentColor` 描邊
- `.ic` 補 `color: #1a1a1a`，讓深色描邊在黃底上清晰顯示

---

## 2026-04-17 — 數字區塊改版

### 更動範圍
`index.html`、`css/sections.css`

### 更改內容

**刪除｜精簡數字數量，移除次要服務指標**
- 舊：4 個數字（45年服務經驗、9000+ 倖存者、1700 每年服務人次、16 全國服務據點）
- 新：保留 3 個，刪除「1700 每年服務人次」與「16 全國服務據點」（服務行政指標，對倡議說服力較低）
- 符合 change-brief 建議：「只留 2 到 3 個最有代表性的數據」

**更正｜以社會調查數字取代年份作為第一個數字**
- 新增：`1/5`（每 5 人中就有 1 人曾因外貌遭不友善對待）
- 來源：陽光基金會外貌歧視民調，2025，n＝1,123（引自 change-brief 引用資料）
- 此數字更直接回應臉部平權議題，比機構成立年份更有倡議說服力

**更正｜每個數字標籤改為完整敘述句**
- 舊：「年服務經驗」「燒傷倖存者陪伴」（抽象名詞）
- 新：「每 5 人中，就有 1 人曾因外貌遭不友善對待」「陽光基金會已陪伴逾 9,000 名燒傷倖存者」「年深耕顏損倡議，是台灣最資深的顏損支持機構」
- 符合 change-brief 建議：「改成完整敘述」

**加入｜每個數字後補「所以這代表什麼」小句（`.sb-note`）**
- 三個數字各加一行解釋句，例如：「外貌歧視不是個案，而是普遍存在的日常困境。」
- 符合 change-brief 建議：「數字後面要有『所以這代表什麼』的小句子」

**加入｜每個數字下方標註資料來源（`.sb-src`）**
- 三個數字各附一行來源小字（陽光基金會調查 2025 / 年度報告 / 創立年份）
- 符合 change-brief 建議：「在每個數字下方清楚標出是什麼、出自哪裡」

**更正｜區塊標題與說明文改版**
- 舊標題：「45年深耕，持續前進」（機構自述型）
- 新標題：「數字背後，是真實的處境與行動」
- 舊 `.sl`：「▍影響力」→ 新：「▍數據與影響力」
- 舊說明：複述服務數字 → 新：「以下數據來自陽光基金會倡議研究與年度服務報告。」

**加入｜CSS 新增（sections.css）**
- `.sb--full`：第三張數字卡橫跨兩欄（`grid-column: 1 / -1`）
- `.sb .lb`：改為白色（`var(--w)`）、加粗、行高 1.5，適合多行完整句
- `.sb .sb-note`：斜體小字（.78rem），顯示「代表什麼」的解釋
- `.sb .sb-src`：極小字（.68rem），低透明度，標示資料來源
- `.sb` 補 `display:flex; flex-direction:column; align-items:center`，適應多行內容

---

## 2026-04-17 — 黃底大引言區改版

### 更動範圍
`index.html`、`css/sections.css`

### 更改內容

**更正｜引言文字改為明確定義句**
- 舊：「有陽光的地方，就有愛！有需要的地方，就有陽光！」（機構口號，情緒性強但無知識傳達功能）
- 新：「臉部平權，是不因外貌而差別對待任何人。」
- 符合 change-brief 建議：「引用文字盡量控制在一句短而明確的定義，會比抽象句更有教育力」

**更正｜來源標注改為概念定義型**
- 舊 cite：「— 陽光社會福利基金會」（僅標機構名，語義模糊）
- 新 cite：「— 臉部平權核心定義」（明確標示引言性質）

**加入｜小字資料來源說明（`.qs-source`）**
- 新增一行小字：「資料來源：陽光社會福利基金會 臉部平權倡議計畫」
- 符合 change-brief 建議：「旁邊可搭配小字說明資料來源或倡議單位，提高可信度」

**加入｜CSS 新增（sections.css）**
- `.qs-source`：小字（.75rem）、低透明度（.55），顯示於 cite 下方

---

## 2026-04-17 — 橫向語錄／故事滑動區改版

### 更動範圍
`index.html`、`css/sections.css`

### 更改內容

**更正｜區塊標題改為教育型語句**
- 舊：「他們的故事，讓改變發生」（情緒感言型）
- 新：「這些情境，真的會發生」
- 符合 change-brief 建議：讓此區具備教育功能，而非一般 testimonial 感

**更正｜每張滑動卡頂部加入情境標題（`.sc-stag`）**
- 舊：卡片只有引言（`.sq`）＋人名（`.sn`）＋連結（`.sdd`），缺乏情境識別
- 新：各卡頂部新增情境標籤，如「在求職時被外貌篩選」「在求職時被拒於門外」「面對日常的異樣目光」等
- 符合 change-brief 建議：「每張卡片加入一個明確情境標題」

**加入｜每張卡底部對應行動連結**
- 確保五張卡都有意義明確的行動連結，依情境分別指向：
  - 職場平權報導
  - 職場行動指引
  - 陽光基金會起源故事
  - 互動原則頁面
  - 三不三要互動原則
- 符合 change-brief 建議：「每張故事卡底部附一個對應行動」

**更正｜部分卡片文案細修**
- 沈曉亞那張卡刪去「民國69年起」背景語，改寫成更直接的情境敘述，讓陌生讀者也能理解

**加入｜CSS 新增（sections.css）**
- `.sc-stag`：黃底深字情境標籤，inline-block，圓角 4px，顯示於卡片引言上方
- `.sc .sdd` margin-top 微調（2px → 6px），讓行動連結與人名間距更清楚

---

## 2026-04-17 — 八張議題卡片重構 + 詳細內容 Overlay 全面改版

### 更動範圍
`index.html`、`css/components.css`、`js/main.js`

### 更改內容

**更正｜區塊標題改為導覽型語句**
- 舊：「當外貌偏見發生，我們挺身而出，勇敢發聲」（情緒口號）
- 新：「用八個重點，快速理解臉部平權」＋副文案「第一次認識臉部平權？先從以下八個問題開始」
- 將 `.sl` 從「我們關注的議題」改為「認識臉部平權」

**更正｜八張卡片全面換新，對應明確知識路徑**
- 舊：6 張卡片，主題為陽光基金會服務項目（職場歧視、燒傷重建、壓力衣等）
- 新：8 張知識卡片，按新手閱讀順序排列：
  1. 認識｜什麼是臉部平權？
  2. 迷思｜外貌歧視有哪些常見誤解？
  3. 處境｜顏損者日常會遇到什麼挑戰？
  4. 背景｜為什麼台灣需要臉部平權運動？
  5. 行動｜如何實踐「三不三要」支持平權？
  6. 行動｜你能從日常生活做什麼改變？
  7. 故事｜顏損者的正面故事有哪些啟發？
  8. 資源｜5月17日臉部平權日怎麼參與？
- 卡片改為 CSS 漸層背景（移除 base64 及 Unsplash 圖片依賴）

**加入｜每張卡片加小標籤（card-tag）**
- 新增 `.card-tag` pill 樣式，顯示在卡片標題上方
- 讓八張卡之間的主題差異一眼可辨

**加入｜每張卡片底部加「點擊展開 →」CTA 提示**
- 新增 `.card-cta` 樣式，以黃色小字提示互動結果
- 解決原本「不知道卡片可以點」的問題

**加入｜每個 Overlay 麵包屑導覽**
- 格式：「首頁 / 八大重點 / [標籤]」
- 新增 `.dp-breadcrumb` 樣式

**加入｜每個 Overlay 底部導航（下一張 + 回到八大重點）**
- 「下一張」按鈕直接呼叫下一張 overlay（ic1→ic2→...→ic8）
- 「回到八大重點」關閉 overlay 並回到卡片區
- 新增 `.dp-nav-footer`、`.dp-nav-next`、`.dp-nav-back` 樣式

**更正｜Overlay 內文全面換新，使用 change-brief 提供之完整文案**
- 舊：以服務介紹、數據報告為主的機構型文案
- 新：以敘事段落呈現的知識文案，每張卡包含 5–6 段文字，以加粗金句作結

**更正｜JS：開啟 Overlay 時記錄捲動位置，關閉時還原**
- `openDetail()`：儲存 `window.scrollY` 至 `_scrollPos`；若有其他 overlay 開啟則先關閉
- `closeDetail()`：關閉後執行 `window.scrollTo(0, _scrollPos)` 回到原位
- 符合 change-brief「關閉時回到原本卡片位置，大幅提升專業感」建議

**加入｜CSS 新增（components.css）**
- `.card-bg`：卡片漸層背景用途（position absolute inset:0）
- `.card-tag`：半透明毛玻璃小標籤
- `.card-cta`：黃色展開提示
- `.dp-breadcrumb` / `.dp-breadcrumb span`：overlay 麵包屑
- `.dp-nav-footer`：底部導航容器
- `.dp-nav-next`：黃底主要按鈕
- `.dp-nav-back`：透明邊框次要按鈕

---

## 2026-04-17 — 三要三不互動原則重構

### 更動範圍
`index.html`、`css/sections.css`

### 更改內容

**更正｜標題改為使用情境語言**
- 舊標題：「三要三不互動原則」（功能性標籤感）
- 新標題：「第一次接觸顏損朋友，可以怎麼互動？」
- 標籤 label 改為「▍看完議題，立刻可以做的第一步」，強化與卡片區的閱讀邏輯連結

**更正｜移位至八大卡片之後**
- 原位置：緊接 Hero 之後，與卡片區形成「雙主角」競爭
- 新位置：卡片區（`#cards`）之後，作為「看完議題的第一步行動」
- section 加上 `id="interaction-guide"` 以便未來錨點導航

**加入｜每條原則補短注解**
- 三要各增一句情境說明（如「正常眼神接觸、正常對話，就是最好的尊重」）
- 三不各增一句說明理由（如「避免讓對方感到被放大審視」）
- 使用 `.pi-wrap` + `.pi-note` 結構，維持格狀排版並在每格下方顯示說明

**加入｜底部延伸連結**
- 新增「更多互動建議，請見陽光基金會完整指南 →」（`.pr-more`）
- 連結外開陽光基金會官網

**加入｜CSS 新增（sections.css）**
- `.pi-wrap`：flex 欄排列，包住 pill 與注解
- `.pi-wrap--full`：跨兩欄（對應第三項目）
- `.pi-note`：小字灰色注解
- `.pr-more`、`.pr-more a`：底部連結樣式

---

## 2026-04-17 — Hero 首屏改版

### 更動範圍
`index.html`、`css/sections.css`

### 更改內容

**更正｜主標題雙層化**
- 舊標題：「每張臉都與眾不同／卻一樣獨一無二」（純口號式）
- 新標題：第一行「什麼是臉部平權？」＋第二行「每張臉都該被公平對待」
- 符合 change-brief 建議：「定義 + 價值」雙層寫法，讓初次進站者 5 秒內理解頁面主題。

**更正｜段落文案精簡化**
- 舊文案：強調「獨一無二的貢獻」（偏價值宣言）
- 新文案：直接定義臉部平權概念，點出「不因外表遭受歧視或限制機會」
- 讓 hero 段落同時完成「定義議題」功能。

**加入｜雙按鈕 CTA**
- 主要按鈕「認識八大重點」→ 頁內錨點捲動到 `#cards`
- 次要按鈕「了解陽光基金會在做什麼」→ 外連 sunshine.org.tw（新分頁開啟）
- 符合 change-brief 建議，分別對應主線（頁內理解）與延伸（外站）。

**刪除｜「向下探索」裝飾元素**
- 移除原本純氣氛用途的箭頭動畫，因其資訊價值低，且已由主按鈕承擔導引功能。

**加入｜CSS 樣式（sections.css）**
- 新增 `.hero-actions`（flex 排列，支援換行）
- 新增 `.btn-primary`（黃底深字，主行動）
- 新增 `.btn-secondary`（透明底白框，次要行動）
- 原 `.sh` 樣式保留（未刪，但 HTML 已不再使用）

**技術細節**
- 八大卡片區 `<section>` 補上 `id="cards"`，供主按鈕錨點捲動使用。
