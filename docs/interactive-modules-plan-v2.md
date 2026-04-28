# 臉部平權網站：互動機制執行計畫書（校正版 v2）

> **給 Claude Code 的使用說明**
> 每次只執行「本次目標」指定的那一個模組，其餘不得動。
> 執行前確認你已讀完「全局規範」與「設計系統」兩個區塊。

---

## 全局規範（每次執行前必讀）

- 不動現有任何 section 的內容與文字
- 不動 CSS 變數、字體、主色系
- 不動導覽列、Hero、卡片題目卡片區、頁尾的原文文字
- 每次只執行「本次目標」指定的模組，其餘不動
- 無法判斷插入位置時，舉例示意，不要猜測後直接插入

---

## 網站資訊

| 項目 | 值 |
|------|----|
| 網址 | https://jovial-sprite-41d8ad.netlify.app |
| 部署平台 | Netlify（可使用 Netlify Forms） |
| 主要 HTML | `三版/第三版-乙/index.html` |
| 元件樣式 | `三版/第三版-乙/css/components.css` |
| JavaScript | `三版/第三版-乙/js/main.js` |

---

## 設計系統（已確認，直接使用變數名）

```css
/* 主色 */
--primary:       #C97B1E;   /* 琥珀橙，主按鈕、選中狀態 */
--primary-hover: #AF6612;   /* 深一階狀態 */
--primary-soft:  #F3DEC2;   /* 淡色，選中卡片背景 */

/* 次色 */
--secondary:      #42685A;  /* 墨綠，輔助元素 */
--secondary-soft: #DCE7E1;  /* 淡綠 */

/* 背景與卡片 */
--bg:    #F7F2EA;   /* 主背景 */
--card:  #FCF8F3;   /* 卡片背景 */
--border: #DDD3C6;  /* 邊框 */

/* 文字 */
--text:       #26211D;  /* 主文字 */
--text-muted: #6E655B;  /* 次文字 */
--text-soft:  #8A8075;  /* 註記 */
--warning:    #A95C3B;  /* 警示 */

/* 圓角 */
--r-md:   14px;  /* 卡片 */
--r-pill: 24px;  /* 按鈕 */

/* 間距 */
--card-py: 22px;
--card-px: 18px;
```

**所有新卡片的基準樣式（直接套用）：**
```css
background: var(--card);
border: 1px solid var(--border);
border-radius: var(--r-md);
padding: var(--card-py) var(--card-px);
box-shadow: 0 2px 12px rgba(0,0,0,0.06);
```

---

## 頁面插入位置總覽

```
[既有] <section id="cards">  卡片題目卡片區
         </section>  → 在這裡之後插入模組一
[新增] <section id="poll-section">      模組一：單題投票
[新增] <section id="scenario-section">  模組二：情境選擇
[既有] <section id="stories">  情境故事區
         </section>  → 在這裡之後插入模組三
[新增] <section id="share-section">     模組三：匿名分享
[既有] <section id="interaction-guide"> 互動行動區
[既有] <section id="do-section">        行動呼籲區
                     → 在 footer 之前插入模組四
[新增] <section id="feedback-section">  模組四：回饋表單
[既有] <footer id="footer">
```

---

## 建議執行順序

| 優先 | 模組 | 後端 | 複雜度 |
|------|------|------|--------|
| 1 | 模組一：單題投票 | 純前端 | 低 |
| 2 | 模組二：情境選擇 | 純前端 | 中 |
| 3 | 模組三：匿名分享 | Netlify Forms | 中 |
| 4 | 模組四：回饋表單 | Netlify Forms | 高 |

---

## 模組一：單題投票

**標題：** 你本來認識臉部平權嗎？
**副說明：** 每台裝置限投一次

### 選項（5 字以內）

| 按鈕文字 | data-value |
|---------|------------|
| 早就知道 | know |
| 知道但沒深入 | heard |
| 首次了解 | new |

### 插入位置
`#cards` 的 `</section>` 結尾標籤之後

### HTML 骨架

```html
<section id="poll-section" aria-label="投票區">
  <div class="poll-card reveal">
    <p class="poll-label">閱讀前</p>
    <h2 class="poll-title">你本來認識臉部平權嗎？</h2>
    <p class="poll-sub">每台裝置限投一次</p>

    <div id="poll-options" class="poll-options" role="group" aria-label="投票選項">
      <button class="poll-btn" data-value="know">早就知道</button>
      <button class="poll-btn" data-value="heard">知道但沒深入</button>
      <button class="poll-btn" data-value="new">首次了解</button>
    </div>

    <div id="poll-result" class="poll-result" hidden>
      <div class="poll-rings" aria-hidden="true"><!-- SVG 環形圖由 JS 動態產生 --></div>
      <p class="poll-thanks">謝謝你願意加入來認識這個議題。</p>
    </div>
  </div>
</section>
```

### 視覺互動規格

**投票前：**
- 三個按鈕橫排（手機縱排）
- hover：`background: var(--primary-soft)`，邊框變琥珀橙
- 點擊瞬間：`scale(0.95)` 微縮 100ms 回彈

**投票後（localStorage 記錄 `sunshine_poll_voted`）：**
- 選中按鈕：左側出現 ✓，背景變 `var(--primary-soft)`，邊框用 `var(--primary)`
- 其他選項：`opacity: 0.35`，transition 300ms
- 下方顯示環形結果圖 + 感謝文字

**環形結果圖（新增視覺核心）：**
- 三條 SVG 環圈，疊放三層，每圈對應一個選項
- 環圈用 `stroke-dasharray` 動畫，從 0 增長到對應比例，duration 800ms ease-out
- 環圈顏色：選中者用 `#C97B1E`，其餘用 `#DDD3C6`
- 環圈旁顯示標籤文字 + 百分比數字，數字從 0 計數到目標值，duration 600ms

**初始模擬票數（防止在 0 的尷尬）：**
```javascript
const BASE_COUNTS = { know: 18, heard: 47, new: 35 };
```

### JavaScript 邏輯

```javascript
// localStorage key: 'sunshine_poll_voted'
(function () {
  const voted = localStorage.getItem('sunshine_poll_voted');
  if (voted) {
    showPollResult(JSON.parse(localStorage.getItem('sunshine_poll_counts') || '{}'));
  }
  document.querySelectorAll('.poll-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = btn.getAttribute('data-value');
      var counts = JSON.parse(localStorage.getItem('sunshine_poll_counts') || JSON.stringify(BASE_COUNTS));
      counts[val] = (counts[val] || 0) + 1;
      localStorage.setItem('sunshine_poll_voted', val);
      localStorage.setItem('sunshine_poll_counts', JSON.stringify(counts));
      markSelected(val);
      showPollResult(counts);
    });
  });
})();
```

---

## 模組二：情境選擇

**卡片標題：** 遇到這些情境，你會怎麼做？
**說明文字：** 沒有標準答案，選一個最接近你的反應就好。

### 插入位置
模組一（`#poll-section`）之後，`#stories` 之前

### 選項文字（5 字以內，已校正）

**第一題**：捷運上，你注意到對方臉上有明顯的痕跡。

| 選項  | 文字 |
|------|------|
| A | 移開視線 |
| B | 忍不住多看 |
| C | 視線不自然 |

**第二題**：孩子大聲問「那個人臉怎麼了？」

| 選項  | 文字 |
|------|------|
| A | 輕聲帶離 |
| B | 假裝沒聽 |
| C | 大聲阻止 |

**第三題**：朋友對別人的外貌缺陷笑，大家都在笑。

| 選項  | 文字 |
|------|------|
| A | 沉默不笑 |
| B | 跟著附和 |
| C | 輕聲發言 |

### 回饋文字（每題在選項後共用一段）

第一題：
> 這點不是完全不對，而是讓視線不要固定。
> 自然地移開視線，就已經是一種尊重。

第二題：
> 孩子的好奇心是自然的，需要的是大人怎麼回應。
> 不需要讓場面難堪，輕聲帶離、事後說明，就已經很好了。

第三題：
> 不跟著笑，已經是一種立場。
> 如果可以，一句「這樣說好嗎」不需要大聲，但會讓人知道有人在意。

### 完成卡文案
> 你已經想過三個情境了。
> 真實的場景可能更複雜，但能停下來想一秒，就已經有意義。

### 視覺互動規格

**題目切換動畫（已確認做好，左右滑動淡出）：**
- 當前題目向左滑出：`transform: translateX(-40px); opacity: 0`，transition 250ms
- 新題目從右滑入：預設 `translateX(40px); opacity: 0`，transition 結束後立即就位

**選項互動：**
- hover：邊框變 `var(--primary)`，背景變 `var(--primary-soft)`
- 點選後：選中者邊框加粗 `2px solid var(--primary)` + `box-shadow: 0 0 0 3px var(--primary-soft)`
- 其他選項：`opacity: 0.4`，transition 300ms
- 300ms 後，回饋文字卡片 slideDown 展開，`max-height: 0 → auto`

**進度條：**
```html
<div class="scenario-progress" aria-label="第 1 題 / 共 3 題">
  <span class="scenario-counter">第 1 題 / 共 3 題</span>
  <div class="scenario-bar"><div class="scenario-bar-fill" style="width: 33%"></div></div>
</div>
```
- 細線條，高度 3px，顏色 `var(--primary)`
- 進度隨題目切換平滑更新

**完成卡：**
- 三個 ✓ 依序 stagger 出現（延遲遞 150ms）
- 最後顯示完成文案
- 提供「繼續閱讀」按鈕，點擊連結至 `#stories`

### JavaScript 骨架

```javascript
const scenarios = [
  { situation: "捷運上，你注意到對方臉上有明顯的痕跡。",
    options: ["移開視線", "忍不住多看", "視線不自然"],
    feedback: "這點不是完全不對，而是讓視線不要固定。\n自然地移開視線，就已經是一種尊重。" },
  { situation: "孩子大聲問「那個人臉怎麼了？」",
    options: ["輕聲帶離", "假裝沒聽", "大聲阻止"],
    feedback: "孩子的好奇心是自然的，需要的是大人怎麼回應。\n不需要讓場面難堪，輕聲帶離、事後說明，就已經很好了。" },
  { situation: "朋友對別人的外貌缺陷笑，大家都在笑。",
    options: ["沉默不笑", "跟著附和", "輕聲發言"],
    feedback: "不跟著笑，已經是一種立場。\n如果可以，一句「這樣說好嗎」不需要大聲，但會讓人知道有人在意。" }
];
let currentIndex = 0;
```

---

## 模組三：匿名情境分享

**卡片標題：** 你有遇過類似情境嗎？
**引導文字：** 如果你願意，可以匿名留下一句話。不一定要完整故事，一個場景、一種感受，都很需要。
**Placeholder：** 例如：我旁邊的那個人一直瞪著對方的，當下其實覺得很不舒服。
**底部小字：** 不留名字，這段內容只會以匿名方式整理，不會公開個人資訊。

### 插入位置
`#stories` 的 `</section>` 結尾標籤之後

### Netlify Forms HTML

```html
<section id="share-section" aria-label="匿名分享區">
  <div class="share-card reveal">
    <h2 class="share-title">你有遇過類似情境嗎？</h2>
    <p class="share-intro">如果你願意，可以匿名留下一句話。不一定要完整故事，一個場景、一種感受，都很需要。</p>

    <div id="share-form-wrap">
      <form name="anonymous-share" method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="anonymous-share" />
        <p hidden><input name="bot-field" /></p>
        <div class="share-textarea-wrap">
          <textarea id="share-text" name="experience"
            maxlength="200" minlength="10" required
            placeholder="例如：我旁邊的那個人一直瞪著對方的，當下其實覺得很不舒服。"
            aria-label="分享你的情境"></textarea>
          <span id="char-count" class="char-count" aria-live="polite">0 / 200</span>
        </div>
        <label class="share-checkbox">
          <input type="checkbox" name="allow-display" value="yes" />
          同意作為匿名統計
        </label>
        <p class="share-note">不留名字，這段內容只會以匿名方式整理，不會公開個人資訊。</p>
        <button type="submit" id="share-submit" class="btn-primary">匿名送出</button>
      </form>
    </div>

    <!-- 送出成功後顯示，預設 hidden -->
    <div id="share-thanks" class="share-thanks" hidden aria-live="polite">
      <p>謝謝你願意留下這段話。</p>
      <p>有些改變，就是從有人願意說「我也經歷過」開始。</p>
    </div>
  </div>
</section>
```

### 視覺互動規格

**文字框聚焦時：**
- 左側邊框出現琥珀橙豎線：`border-left: 3px solid var(--primary)` + `transition: border-left 200ms`
- 卡片微上浮：`transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201,123,30,0.15)`

**字數計數器：**
- 格式「X / 200」，位置右下角，`font-size: var(--fs-sm); color: var(--text-soft)`
- 剩餘 < 30 字時文字變 `var(--warning)`

**送出流程：**
1. 點擊送出 → 按鈕文字改為「送出中…」並 disabled
2. 送出成功 → `#share-form-wrap` 淡出，`opacity: 0`，transition 300ms，後隱藏
3. `#share-thanks` 淡入，`opacity: 0 → 1; translateY(10px → 0)`，transition 400ms

**注意：** 本地開發時 Netlify Forms 送出失敗，這是正常的，需部署到 Netlify 才能測試

---

## 模組四：嵌入式回饋表單

**卡片標題：** 看完有感，如果你願意，留一下回饋給我們
**說明文字：** 不需要很長，一句感想、一個建議，都很有幫助。

### 插入位置
`<footer id="footer">` 的開始標籤之前

### 選項文字（5 字以內，已校正）

**題目一：** 這個網站有幫助你更了解臉部平權嗎？

| 文字 | name/value |
|------|------------|
| 很有幫助 | helpfulness=very |
| 有一點點 | helpfulness=bit |
| 早就知道 | helpfulness=known |

**題目二：** 你最有感的是哪一部分？（單選）

| 文字 | name/value |
|------|------------|
| 數據現象 | section=data |
| 情境故事 | section=story |
| 行動建議 | section=action |
| 整體設計 | section=design |

**題目三（選填）：** 如果有建議，歡迎留一句話
Placeholder：隨便說，一句話也可以

### HTML 骨架（展開式設計）

```html
<section id="feedback-section" aria-label="回饋表單">
  <div class="feedback-card reveal">

    <!-- 收起狀態 -->
    <div id="feedback-teaser">
      <p class="feedback-teaser-text">願意留一下回饋嗎？</p>
      <button id="open-feedback" class="btn-outline">我要回饋</button>
    </div>

    <!-- 展開後的表單，預設 max-height: 0, overflow: hidden -->
    <div id="feedback-form-wrap" class="feedback-form-wrap" aria-hidden="true">
      <h2 class="feedback-title">看完有感，如果你願意，留一下回饋給我們</h2>
      <p class="feedback-intro">不需要很長，一句感想、一個建議，都很有幫助。</p>

      <form name="site-feedback" method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="site-feedback" />
        <p hidden><input name="bot-field" /></p>

        <!-- 題目一 -->
        <fieldset class="feedback-q">
          <legend>這個網站有幫助你更了解臉部平權嗎？</legend>
          <div class="feedback-options" role="group">
            <label class="feedback-opt"><input type="radio" name="helpfulness" value="very" required />很有幫助</label>
            <label class="feedback-opt"><input type="radio" name="helpfulness" value="bit" />有一點點</label>
            <label class="feedback-opt"><input type="radio" name="helpfulness" value="known" />早就知道</label>
          </div>
        </fieldset>

        <!-- 題目二 -->
        <fieldset class="feedback-q">
          <legend>你最有感的是哪一部分？</legend>
          <div class="feedback-tags" role="group">
            <label class="feedback-tag"><input type="radio" name="section" value="data" />數據現象</label>
            <label class="feedback-tag"><input type="radio" name="section" value="story" />情境故事</label>
            <label class="feedback-tag"><input type="radio" name="section" value="action" />行動建議</label>
            <label class="feedback-tag"><input type="radio" name="section" value="design" />整體設計</label>
          </div>
        </fieldset>

        <!-- 題目三 -->
        <fieldset class="feedback-q">
          <legend>如果有建議，歡迎留一句話（選填）</legend>
          <textarea name="suggestion" maxlength="300"
            placeholder="隨便說，一句話也可以" aria-label="建議文字"></textarea>
        </fieldset>

        <button type="submit" id="feedback-submit" class="btn-primary">送出回饋</button>
      </form>
    </div>

    <!-- 送出成功後顯示，預設 hidden -->
    <div id="feedback-thanks" class="feedback-thanks" hidden aria-live="polite">
      <div class="thanks-icon" aria-hidden="true">✓</div>
      <p>謝謝你的回饋。</p>
      <p>你的意見有幫助這個議題被整理得更清楚，也讓更多人更容易理解這個議題。</p>
      <p>謝謝你花時間閱讀。</p>
      <a href="#main" class="btn-outline">回到上方</a>
    </div>

  </div>
</section>
```

### 視覺互動規格

**展開動畫：**
```css
.feedback-form-wrap {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 400ms ease, opacity 300ms ease;
}
.feedback-form-wrap.expanded {
  max-height: 700px;
  opacity: 1;
}
```

**題目一（radio 按鈕式）：**
- 選中時：背景 `var(--primary-soft)`，邊框 `var(--primary)`，左側 ✓ 出現
- 其他選項微淡化（opacity 0.5），hover 可恢復

**題目二（tag 按鈕式）：**
- 選中時：`scale(1.05)` 彈跳，`transition: transform 150ms`，背景填色

**送出成功：**
- 表單淡出，opacity 0，300ms
- 感謝卡從下方淡入，translateY(10px) → 0，opacity 0 → 1，400ms

**「我要回饋」按鈕：**
- 使用 outline 樣式（不填色），視覺不搶眼

---

## 共用 CSS 新增（新增至 components.css）

```css
/* 所有新 section 共用 wrapper */
.section-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: var(--section-py) var(--section-px);
}

/* 選項按鈕選中狀態 */
.opt-selected {
  background: var(--primary-soft);
  border: 2px solid var(--primary);
  box-shadow: 0 0 0 3px rgba(201,123,30,0.15);
}

/* 手機版選項縱排 */
@media (max-width: 600px) {
  .poll-options,
  .feedback-options,
  .feedback-tags,
  .scenario-options {
    flex-direction: column;
  }
}
```

---

## 驗收清單（執行完成後自檢）

- [ ] 模組一：清除 localStorage 後可投票，重整後顯示「已投票」+ 環形圖
- [ ] 模組一：手機版三個按鈕縱排
- [ ] 模組二：一題依序顯示，選擇後回饋展開，進度條更新，完成卡出現
- [ ] 模組二：題目切換有左右滑動淡出效果
- [ ] 模組三/四：本地測試 Netlify Forms 送出失敗為正常，需部署後測試
- [ ] 模組三/四：感謝卡的平滑動畫，不突然出現不跳頁
- [ ] 所有模組：Tab 鍵可操作按鈕，aria-label 設定正確
- [ ] 所有模組：不超出 860px 的最大寬度
- [ ] 所有選項文字確認 5 字以內

---

*計畫書版本：v2（校正版）。實際執行時，每次貼上「進場規範」卡片 + 指定「本次目標：模組 X」即可。*
