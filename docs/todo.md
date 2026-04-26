# Todo — 臉部平權網站

> 使用方式：完成後在 `[ ]` 改為 `[x]`，並在 changelog.md 補上紀錄。

---

## 待辦（優先）

- [x] 將 base64 圖片移出 index.html（已在 2026-04-17 重構時完成；index.html 現為 ~43KB）
- [x] 建立 `assets/images/` 目錄，放入 og-cover.jpg（2026-04-18）
- [x] 加入 Open Graph meta tags（2026-04-18，部署後需將 `your-domain.netlify.app` 替換為正式網域）

- [ ] **【必做】部署後更新 og:url 與 og:image 為正式完整 URL**
      → 在 `index.html` 第 9–18 行，將 `https://your-domain.netlify.app` 替換為 Netlify 給的實際網域

- [x] Step 2 — Hero 首屏 + #what-we-do 整合（2026-04-18）
- [x] Step 3 — Utility Bar + Nav 頂部框架（2026-04-18）
- [x] Step 4 — #interaction-guide 左右對稱欄重構（2026-04-18）
- [x] Step 5 — 八張卡片：標題、標籤、分組、摘要更新（2026-04-18）

- [ ] 整理 Unsplash 圖片：確認授權並下載至 `assets/images/` 本地備份
- [ ] Hero 背景圖換成更貼近議題的真實倡議情境圖（目前用通用人群圖）；需確認圖片授權後替換

## 待辦（一般）

- [ ] 確認所有外部連結是否仍然有效（每季檢查一次）
- [ ] 補充第 6 個議題卡片（dp6 目前連到「生理復健支持」，可考慮加更多內容）

## 未來考慮

- [ ] 加入 Google Analytics 或其他流量追蹤（需先評估隱私政策）
- [ ] 製作英文版（Face Equality 國際推廣）

---

## 後續建議（Step 3 完成後）

- [ ] Utility bar 文字在極小螢幕（< 360px）可考慮縮短為「5/17 臉部平權日・非官方整理頁」
- [ ] 若 Netlify 部署後想讓 utility bar 顯示距離臉部平權日的倒數天數，可加 JS 動態計算

## 後續建議（Step 4 完成後）

- [ ] 互動原則核心訊息框可考慮加入短說明副文字（如「陽光基金會 2025 倡議核心訊息」）以增加可信度
- [ ] 若未來要加第 4 條互動原則，`ig-columns` 欄寬可維持不變，僅需新增 `ig-item`
- [ ] 手機版（≤ 600px）兩欄堆疊後，欄之間可考慮加分隔線以強化視覺區隔

## 後續建議（Step 5 完成後）

- [ ] ic7「當事人的真實遭遇」overlay 正文可替換為更具體的真實案例（如采瑀、小芳、阿蕎的遭遇摘錄），目前正文仍為原「正面故事」框架
- [ ] ic3「外觀歧視在日常生活中有哪些感受？」overlay 第一行用語可統一從「顏損者」改為「外觀差異者」以對齊新標題語氣
- [ ] 卡片分組標示目前使用 inline 色點（`.card-group-dot`），後續可考慮加入 emoji 🔵🟡🟠🔴 以強化視覺辨識度（尤其在手機小螢幕）
- [x] Step 6 — Overlay 閱讀體驗（背景鎖捲、回位置、麵包屑、底部導航、單一關閉邏輯）（2026-04-18）
- [x] Step 7 — 數據區塊 + 黃底引言區（3 張數據卡、sb-what 標示、來源補強）（2026-04-18）
- [x] Step 8 — 影音片長標示、延伸資源 4 類分組、Footer 非官方聲明與結尾語（2026-04-18）

## 後續建議（Step 6 完成後）

- [ ] `dp-back-inner` 目前佔滿頂端全寬，可考慮在右端加上「× 關閉」提示文字或 icon，讓首次使用者更快找到出口
- [ ] 目前關閉後焦點回到觸發的 `.card` 元素；若卡片不在可視區域，可加 `card.scrollIntoView({ block:'center', behavior:'smooth' })` 補強

## 後續建議（Step 7 完成後）

- [ ] 可考慮加入可選數據卡（52.7% 面試遭遇不公平），待查詢原始報告 PDF 確認後再使用（目前僅媒體載錄）
- [ ] 數據卡 `.sb-what` 標示目前為純文字，未來可改為小圖示（⚡ 或 💡）強化視覺識別
- [ ] `.sb--full`（45 年卡）目前橫跨兩欄，可考慮在桌機版加入右側補充說明欄以善用空間

## 後續建議（Step 8 完成後）

- [ ] 延伸資源「給教師與家長」目前連到一般倡議頁；若陽光基金會日後有專屬校園資源頁，可更新連結
- [ ] 延伸資源「給一般民眾」目前錨點為 `#interaction-guide`（頁內），若未來互動原則移出獨立頁，需更新 href
- [ ] 影音區主影片「約 2 分鐘」為手動估計；若影片長度調整，需同步更新 badge 文字
- [ ] Footer `.ft-slogan` 字體大小在極小螢幕（< 360px）可考慮縮小至 `var(--fs-lg)` 避免換行難看
- [x] 整頁 Step 1–8 全部完成，建議做一次全站無障礙掃描（axe / Lighthouse Accessibility）確認 WCAG 2.1 AA 對比度（2026-04-18，Step 9 完成）

## 後續建議（Debug 第十章驗收後）

- [ ] `{{VIDEO_URL}}` 點擊目前會嘗試導向字面字串 `{{VIDEO_URL}}`；建議在正式影片連結備妥前，以 `href="#"` + `onclick="return false"` 暫時停用，或加 `aria-disabled="true"` 提示螢幕閱讀器
- [ ] Hero `<section class="hero" aria-label="認識臉部平權">` 與 #cards 現已不同；若未來 Hero aria-label 需調整，注意不要又與其他 section 重複
- [ ] 手機選單（`.mo`）開啟後仍無焦點陷阱，鍵盤使用者可 Tab 穿越至背景頁面；進階無障礙補強請參考 todo 既有條目

## 後續建議（Step 9 v3.1 完成後）

- [x] Step 9（v3.1）— Footer 重構三層結構 + 刪除廢棄 section（what-we-do、qs、數據、影音、resources）（2026-04-19）
- [ ] 將 `{{SUNSHINE_DONATE_URL}}` 替換為陽光基金會實際捐款頁網址（如 `https://www.sunshine.org.tw/donate`）
- [ ] 將 `{{SUNSHINE_OFFICIAL_URL}}` 替換為 `https://www.sunshine.org.tw/`（footer 中出現 3 次）
- [ ] Footer Layer 2「我是第一次來」出口目前連至 `#cards`；若未來有獨立的「新手引導頁」可更新 href
- [ ] Footer 三層區塊目前對齊 `max-width: 720px`；若整站 section max-width 統一調整，需同步更新

## 後續建議（Step 8 v3.1 完成後）

- [x] Step 8（v3.1）— 新增「現在就能做」#do-section + Web Share API + 複製連結 fallback + toast（2026-04-19）
- [ ] 目前頁面區塊順序為：Hero → #what-we-do → #cards → #interaction-guide → #stories → … → #do-section；v3.1 理想動線為 cards → stories → interaction-guide → do-section，若下一輪要調整區塊順序，需同步移動 HTML 片段
- [ ] `#do-section` 的「看更多」型 CTA（如「支持陽光基金會」）目前未加入，可視頁尾 CTA 重構時一併補入
- [ ] 桌機版若 `window.location.href` 含 hash，`copyFallback` 複製到的 URL 會帶錨點；若需固定複製完整首頁 URL，可改為 `window.location.origin + window.location.pathname`

## 後續建議（Step 7 v3.1 完成後）

- [x] Step 7（v3.1）— 互動原則區重寫（場景版，加四情境卡，無障礙邊框＋圖示＋標籤）（2026-04-19）
- [ ] `#do-section` 錨點已建立（Step 8 完成）
- [ ] 情境卡 emoji（👀 👦 💼 🙄）在舊版 Android 或低版本 iOS 可能顯示為方塊；若需完全相容，可改為 `<span class="ig-scenario-icon" aria-hidden="true">` 搭配 SVG 圖示
- [ ] 四情境卡目前為 2×2 grid，在 360px 以下可確認文字不截斷（`.ig-sc-badge` 使用 `white-space: nowrap`，若標籤過長可降至 `white-space: normal`）
- [ ] 「更好的方式」行目前顏色為 `var(--secondary)`（墨綠），若視覺不夠明顯可改加底線或改用橙色 icon 前綴

## 後續建議（Step 6 v3.1 完成後）

- [x] Step 6（v3.1）— 真實故事區重構（橫滑改縱排 3 則，新文案，佔位符）（2026-04-19）
- [ ] 準備 3 張真實故事配圖並替換 `{{STORY_1_IMAGE}}`、`{{STORY_2_IMAGE}}`、`{{STORY_3_IMAGE}}`（圖片需確認授權）
- [ ] 「看更多真實故事 →」按鈕目前暫用 `href="#footer"`，確認是否有故事專頁後更新連結
- [ ] 若桌機版第 3 則橫跨全寬視覺不協調，可改為 3 欄等寬（`grid-template-columns: repeat(3,1fr)`）或維持 1 欄縱排
- [ ] 故事卡佔位圖背景目前為 `var(--primary-soft)` 米黃底；圖片就位後，可視圖片色調決定是否保留 `background`

## 後續建議（Step 5 v3.1 完成後）

- [x] Step 5（v3.1）— 卡片區重構（accordion + 新文案，overlay 全數移除）（2026-04-19）
- [ ] `{{VIDEO_URL}}` 在 #cards 區塊的影片連結也需填入（同 Hero 連結）
- [ ] accordion 卡片 2「為什麼這件事和你有關？」標題可視後續版本回饋微調用語
- [ ] 舊 `.card-group-hd` / `.card-group-dot` / `.cards-groups` CSS 規則仍留在 sections.css（未用到，可在下一輪 CSS 整理時清除）
- [ ] 考慮是否在 #cards 區塊結尾加入「更多問題？」的引導句，連至陽光基金會官方資源

## 後續建議（Step 4 v3.1 完成後）

- [x] Step 4（v3.1）— Hero 首屏重寫（可信度小字、新文案層次、三 bullet、雙 CTA 錨點、影片連結）（2026-04-19）
- [ ] 將 `{{VIDEO_URL}}` 替換為實際影片連結（影片連結備妥後操作）
- [ ] `#do-section` 錨點對應的「想要知道怎麼做」區塊尚未建立，待後續 Step 新增後核對 CTA 跳轉正確
- [ ] Hero 背景圖目前仍使用 Unsplash 通用人群圖；建議換成更貼近議題的倡議情境圖，需確認圖片授權後替換
- [ ] Hero 三 bullet 在 360px 以下極小螢幕可確認排版不截斷（目前 `flex-direction: column` 應可適應）

## 後續建議（Step 3 v3.1 完成後）

- [ ] `.nl`（品牌名連結）目前 `color: var(--primary)` = `#C97B1E`，在米白 nav 背景上對比約 3:1（大字合格，若需更高可改 `var(--primary-hover)` = `#AF6612` 對比 ≈ 4.2:1）
- [ ] 手機選單社群按鈕（`.msoc a`）`background: rgba(250,246,240,.1)` 在深底上偏淡，若需更明顯可升至 `.15` 或加 `border: 1px solid rgba(250,246,240,.2)`
- [ ] `scroll-padding-top: 94px` 目前為靜態值；若未來 nav 高度因文字縮放或 utility-bar 高度調整，需同步更新此值

## 後續建議（Step 2 v3.1 完成後）

- [ ] 部署後將 `<link rel="canonical">` 與 `og:url` 的 `your-domain.netlify.app` 替換為正式網域
- [ ] 準備 OG 圖片（1200×630px）並替換 `{{OG_IMAGE_URL}}`；圖片需帶一句白話定義，字夠大可在行動裝置讀清楚
- [ ] 準備好正式網址後替換 `{{SUNSHINE_OFFICIAL_URL}}`（預設值可用 `https://www.sunshine.org.tw/`）
- [ ] 確認 skip link 在 DevTools 鍵盤 Tab 後可見 focus 樣式（`.skip-link:focus` 需有明確 outline）

## 後續建議（Step 1 v3.1 完成後）

- [ ] 行動導覽列（`nav`）目前仍依賴 `var(--nav-bg)` 別名（映射至 rgba 米白），若後續 HTML 重構導覽列，可直接換成 `background: rgba(247,242,234,.96); backdrop-filter: blur(12px)`
- [ ] 手機選單（`.mo`）目前 `background: var(--dark)` 透過別名解析為 `--card-strong`（深棕），內文仍為舊白字邏輯（`var(--w)` = `--text-inverse`），在深底上可正常顯示，待 HTML Step 重構選單時一併整理
- [ ] Hero 按鈕 `.btn-secondary` 在照片底仍用 `rgba(255,255,255,.55)` 邊框 + 白字，在淺底上視覺合理（hero 保留照片），後續若 hero 改為非照片底則需調整
- [ ] 八張卡片（`.card`）照片底 overlay 仍用 `rgba(0,0,0,.85)` 漸層，與新米白主背景對比鮮明，後續 v3.1 HTML Step 若卡片改為非照片型態則需同步調整

## 後續建議（Step 9 完成後）

- [ ] 使用真實 Lighthouse CI 或 axe DevTools 瀏覽器擴充在部署後進行二次驗證（本次為手動審查）
- [ ] 手機選單（`.mo`）開啟時，焦點尚未被陷阱限制在選單內；若要完整支援鍵盤使用者，可仿 `trapFocus` 邏輯補強 `toggleMenu()`
- [ ] 卡片 `<a href="javascript:void(0)">` 語意上應為 `<button>`（動作觸發，非頁面導覽）；後續若重構 CSS，可改為 `<button class="card">` 並補 `type="button"`
- [ ] 橫向滑動故事區（`.ss`）僅靠 touch 滑動，鍵盤用戶無法捲動；可補左右方向鍵事件讓鍵盤也能切換故事卡

## 後續建議（Code Review 修正後，2026-04-26）

- [ ] **【必做】部署後將 `og:image` 與 `twitter:image` 中的 `your-domain.netlify.app` 替換為正式網域**（目前已填入圖片路徑 `assets/images/og-cover.jpg`，但網域仍為佔位符）
- [ ] **問題 5 手動驗證**：以 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 逐一確認下列元素對比度 ≥ 4.5:1：
  - `.hero-credibility`（hero 頂部可信度小字）
  - `.acc-source`（卡片資料來源）
  - `.story-cta-hint`（「點擊閱讀完整故事 →」）
  - `.overlay-disclaimer`（Overlay 免責聲明，字體已改為 `max(0.75rem, 12px)`）
- [ ] 故事卡漸層遮罩（`.story-card::after`）目前覆蓋整張卡片，若視覺上底部文字區暗化效果過重，可考慮將漸層收窄至僅覆蓋圖片的底部 30%（調整 `inset` 或限制 `::after` 高度至圖片範圍內）

*最後更新：2026-04-26（Code Review 12 項問題修正）*
