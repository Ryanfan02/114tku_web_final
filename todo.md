#  專案規格書  
## 類 Dcard 留言版系統（Forum System）

---

## 一、專案簡介

本專案旨在開發一套**類似 Dcard 的留言版系統**，提供使用者發文、留言、瀏覽熱門文章等功能。  
系統採用**前後端分離架構**，後端使用 **MongoDB** 作為資料庫，提供完整的 **CRUD API**，前端負責資料呈現與互動。

系統支援帳號註冊與登入機制，並規定：
- Email 註冊僅允許使用 **Google 帳號**
- 可使用 **手機號碼註冊 / 登入**
- 註冊時需設定密碼，並以加密方式儲存

---

## 二、系統目標

1. 提供使用者可自由發文與留言的討論平台  
2. 實作文章與留言的 CRUD 功能  
3. 建立安全的使用者註冊與登入系統  
4. 提供推薦 / 熱門文章瀏覽功能  
5. API 設計清楚，符合 RESTful 規範  

---

## 三、使用者角

| 角色 | 說明 |
|----|----|
| 訪客（Guest） | 可瀏覽文章與留言 |
| 使用者（User） | 可註冊、登入、發文、留言、編輯與刪除自己內容 |

---

## 四、功能需求

### 4.1 帳號系統

#### 4.1.1 註冊功能
- 支援註冊方式：
  - Google Email
  - 手機號碼
- 註冊時需設定密碼
- 密碼需經過雜湊後儲存
- 註冊完成後建立使用者資料

#### 4.1.2 登入功能
- 登入方式：
  - Google Email + 密碼
  - 手機號碼 + 密碼
- 登入成功後回傳登入驗證資訊（如 JWT）

---

### 4.2 文章系統

#### 4.2.1 發表文章
- 登入使用者可發表文章
- 文章包含：
  - 標題
  - 內文
  - 作者
  - 發文時間

#### 4.2.2 瀏覽文章
- 所有人可瀏覽文章列表
- 顯示：
  - 標題
  - 文章摘要
  - 發文時間
  - 留言數
- 點擊可查看完整內容與留言

#### 4.2.3 編輯文章
- 僅作者本人可編輯
- 可修改標題與內文

#### 4.2.4 刪除文章
- 僅作者本人可刪除
- 刪除文章後，相關留言一併刪除或失效

---

### 4.3 留言系統

#### 4.3.1 發表留言
- 登入使用者可於文章下留言
- 留言內容：
  - 留言文字
  - 留言者
  - 留言時間

#### 4.3.2 修改 / 刪除留言
- 僅留言者本人可修改或刪除

---

### 4.4 推薦 / 熱門文章

- 提供推薦文章區塊
- 排序方式可包含：
  - 發文時間
  - 留言數
  - 點擊數（選用）

---

## 五、非功能需求

| 項目 | 說明 |
|----|----|
| 架構 | 前後端分離 |
| 資料庫 | MongoDB |
| API | RESTful |
| 安全性 | 密碼雜湊、驗證機制 |
| 回應格式 | JSON |
| 錯誤處理 | 正確 HTTP Status Code |

---
## 六、API 規格（API Specification）

### 使用者（Auth）

| Method | Route | 說明 |
|------|------|------|
| POST | /api/auth/register | 使用者註冊 |
| POST | /api/auth/login | 使用者登入 |
| GET | /api/auth/me | 取得目前登入者資訊 |

---

### 文章（Posts）

| Method | Route | 說明 |
|------|------|------|
| POST | /api/posts | 新增文章 |
| GET | /api/posts | 取得所有文章 |
| GET | /api/posts/:id | 取得單一文章 |
| PUT | /api/posts/:id | 更新文章 |
| DELETE | /api/posts/:id | 刪除文章 |

---

### 留言（Comments）

| Method | Route | 說明 |
|------|------|------|
| POST | /api/posts/:id/comments | 新增留言 |
| GET | /api/posts/:id/comments | 取得指定文章的留言 |
| PUT | /api/comments/:id | 更新留言 |
| DELETE | /api/comments/:id | 刪除留言 |

---

## 七、專案結構建議（Project Structure）

```text
project-name/
├─ frontend/
│  ├─ src/
│  ├─ public/
│  └─ package.json
│
├─ backend/
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ middleware/
│  └─ package.json
│
├─ docs/
│  ├─ api-spec.md
│  ├─ architecture.png
│  └─ flowchart.png
│
├─ README.md
└─ .gitignore