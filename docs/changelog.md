# Changelog — 臉部平權網站

> 記錄每次 AI 實際修改的內容。  
> 格式：`## [日期] 版本描述`，條列修改項目。

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
