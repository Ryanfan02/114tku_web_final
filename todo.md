# 行程清單系統規格書  


---

## 1. 專案主題與目標

### 1.1 專案主題
本專案為一個「行程清單檢視系統」，使用者可透過日曆選擇日期，查看指定日期的清單介面。  
系統提供三種使用方式：

- 訪客登入（試用模式，不存取後端資料）
- Gmail 帳號註冊
- 已註冊帳號登入

### 1.2 專案目標
- 建立前後端分離的 Web 系統
- 使用 MongoDB 設計資料庫並實作 CRUD API
- 前端採用現代化框架進行元件化開發
- 提供良好的使用者介面與主題切換功能

---

## 2. 功能需求（Functional Requirements）

> 本期專案先完成「帳號系統與介面骨架」，提醒事項 CRUD 列為延伸功能（Phase 2）。

### 2.1 登入與身分模式

#### FR-01 訪客登入
- 使用者可不需註冊直接進入系統。
- 訪客模式下的操作不會存入後端資料庫。
- 資料僅存在前端（localStorage 或記憶體）。

#### FR-02 註冊（僅 Gmail）
- 註冊需輸入：
  - Email（必須為 Gmail 格式）
  - Password
  - Confirm Password
- 兩次密碼需一致才可註冊成功。

#### FR-03 登入
- 使用 Gmail 帳號與密碼登入。
- 登入成功後回傳 JWT Token 作為身分驗證依據。

---

### 2.2 使用者介面

#### FR-04 登入 / 註冊畫面
- 畫面置中卡片式設計。
- 上方以 Tab 切換：
  - 左：登入
  - 右：註冊

#### FR-05 主頁清單檢視
- 顯示清單區塊（本期先顯示空狀態或範例）。
- 右上角提供：
  - 日曆 icon（選擇日期）
  - 主題切換 icon（深 / 淺）

#### FR-06 日期選擇
- 點擊日曆 icon 可選擇年 / 月 / 日。
- 選擇後更新畫面顯示對應日期內容。

---

### 2.3 主題切換

#### FR-07 深 / 淺主題
- 提供 Dark / Light 兩種主題。
- 切換時背景、文字與卡片顏色同步調整。
- 主題設定儲存於 localStorage。

---

## 3. 非功能需求（Non-Functional Requirements）

- **安全性**
  - 密碼需使用 bcrypt 雜湊
  - 統一錯誤訊息，避免洩漏帳號資訊
- **可用性**
  - 介面清楚、操作直覺
- **可維護性**
  - 前後端分離、模組化設計
- **一致性**
  - API 統一回應格式

---

## 4. 技術選型

### 4.1 資料庫
- MongoDB
- 使用 Mongoose 定義資料模型

### 4.2 後端
- Node.js + Express
- JWT（身分驗證）
- bcrypt（密碼雜湊）

### 4.3 前端
- React + TypeScript
- CSS Framework：Tailwind CSS 或 Bootstrap
- 日曆元件：React Date Picker / MUI DatePicker

---

## 5. 資料庫設計（MongoDB）

### 5.1 users 集合（Phase 1）

| 欄位名稱 | 型別 | 說明 |
|--------|------|------|
| _id | ObjectId | 主鍵 |
| email | String | Gmail 帳號（唯一） |
| passwordHash | String | bcrypt 雜湊密碼 |
| createdAt | Date | 建立時間 |
| updatedAt | Date | 更新時間 |

---

## 6. 後端 API 設計

### 6.1 統一回應格式

**成功**
```json
{
  "success": true,
  "data": {},
  "message": "OK"
}

```
**失敗**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "details": "Error message"
  },
  "message": "Failed"
}


```

### 6.2 HTTP狀態碼

| 狀態碼 | 說明 |
|--------|------|
| 200 | 成功 |
| 201 | 建立成功 |
| 400 | 請求錯誤 |
| 401 | 未授權 |
| 404 | 資源不存在|
| 409 | 資料衝突 |
| 500 | 伺服器錯誤 |

----

## 7. API 規格（Users CRUD）
### 7.1 新增使用者 (Create)
**POST /api/users**

```json

{
  "email": "example@gmail.com",
  "password": "12345678",
  "confirmPassword": "12345678"
}
```
### 7.2 取得所有使用者 (Read All)
**GET /api/users**


### 7.3 取得單一使用者 (Read Single)
**GET /api/users/:id**


### 7.4 更新使用者 (Update)
**PUT /api/users/:id**

### 7.5 刪除使用者 (Delete)
**DELETE /api/users/:id**

---

## 8. 前端架構設計
### 8.1 頁面路由

- /auth：登入 / 註冊 / 訪客登入

- /app：主頁（清單 + 日曆 + 主題切切換

### 8.2 主要元件

- AuthCard

- LoginForm

- RegisterForm

- GuestLoginButton

- TopBar

- ThemeToggleButton

- CalendarButton

- ListView

---

## 9. CRUD 流程說明（以註冊為例）

1. 使用者輸入註冊資料

2. 前端送出 POST /api/users

3. 後端驗證 Gmail 格式與密碼一致性

4. 密碼進行 bcrypt 雜湊

5. 資料寫入 MongoDB

6. 回傳成功結果給前端

---

## 10. 專案目錄結構
project-name/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
├── docs/
│   ├── api-spec.md
│   ├── architecture.png
│   └── flowchart.png
├── README.md
└── .gitignore
