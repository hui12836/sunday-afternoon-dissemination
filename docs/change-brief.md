# Change Brief — 臉部平權網站

> 這份文件記錄每次改版的**目標與需求**。  
> 實際修改紀錄請見 [changelog.md](changelog.md)。

---

## 專案背景

- **製作單位**：淡江大學學生，公益宣導用途
- **主題**：陽光基金會「臉部平權」議題推廣
- **聯絡信箱**：minglunhan199@gmail.com
- **GitHub Repo**：`hui12836/sunday-afternoon-dissemination`
- **主要頁面**：`index.html`（單頁 PWA 風格，行動裝置優先）

---

## 網站架構（6 大工作區塊）

| 編號 | 區塊名稱 | 負責檔案 | 說明 |
|------|----------|----------|------|
| 01 | Hero & Nav | `index.html` L01 區 | 導覽列、漢堡選單、Hero 首屏、主按鈕 |
| 02 | Intro & Principles | `index.html` L02 區 | 三要三不互動原則 |
| 03 | Six Cards & Overlay | `index.html` L03 區 + dp1–dp6 | 六張議題卡片與詳情覆蓋層 |
| 04 | Stories, Video & Links | `index.html` L04 區 | 真實故事、影音專區、快速連結 |
| 05 | Footer | `index.html` L05 區 | 免責聲明、版權、社群連結 |
| 06 | Design System | `css/` 資料夾 | 色彩、字級、元件、動畫 |

---

## 待解決問題 / 已知限制

- 卡片 dp1（陽光 logo）和 dp5（壓力衣）使用 base64 內嵌圖片，檔案較大
  → 建議未來移至 `assets/images/` 並改用外部連結
- 所有圖片目前混用 Unsplash URL + base64，尚未整理到 `assets/`

---

## 改版優先順序

1. **高** — 任何連結失效或資訊錯誤
2. **中** — 新增真實故事、更換影片
3. **低** — 視覺微調、動畫效果

---

*最後更新：2026-04-17*
