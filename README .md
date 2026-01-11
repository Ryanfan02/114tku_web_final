# List Planner（行事曆 + 事項清單）

## 1. 專案主題與目標

**List Planner** 是一個結合「月曆檢視」與「待辦事項清單」的 Web App。  
使用者可以在指定日期建立事項，並進行 **新增 / 修改 / 刪除 / 完成狀態切換**。

本專案同時提供兩種使用模式：

- **訪客模式（Guest）**  
  不需註冊登入即可使用。所有新增/修改/刪除的事項 **只儲存在前端 localStorage**，不寫入後端資料庫。

- **會員模式（Register/Login）**  
  需註冊並登入。登入後的事項 CRUD 會透過 API 同步到 **後端 MongoDB**，重整或換裝置仍能保留資料。

另外提供「**忘記密碼（重設密碼）**」功能：使用者輸入帳號與新密碼即可更新資料庫密碼（作業版本流程已簡化，正式系統會加入 Email/OTP 驗證）。

---

## 2. 技術選擇與原因

### 前端（Frontend）
- **React + Vite**
  - Vite 啟動快、開發體驗佳，適合快速迭代 UI
  - React 元件化方便拆分月曆、週檢視、事項 modal、登入註冊等功能

- **localStorage**
  - 支援訪客模式資料保存（不需後端）
  - 可儲存 token / mode / theme 等狀態

### 後端（Backend）
- **FastAPI（Python）**
  - 支援 Pydantic 驗證，API 欄位錯誤可直接回傳 422，便於測試與除錯
  - 自動產生 `/docs` Swagger 文件，方便驗收與 Postman 測試

- **MongoDB + Motor (Async)**
  - 文件型資料庫適合存放 events、users 等結構
  - Motor 支援 async，搭配 FastAPI 效率佳

### 部署 / 環境
- **Docker Compose**
  - 一次啟動 MongoDB + FastAPI
  - 避免各台電腦環境不同造成「跑不起來」的問題
  - 方便助教/同學 clone 後快速驗證

### 安全性（作業需求導向）
- 密碼使用雜湊（hash）儲存，不存明碼
- 登入後使用 JWT（Bearer Token）保護 events API
- 訪客模式不寫入後端，避免無帳號資料污染資料庫

---

## 3. 系統架構說明

### 3.1 架構圖（簡述）
- 前端（React）
  - 顯示月曆/週檢視/事項清單
  - 呼叫後端 API（登入、註冊、事件 CRUD）
  - 訪客模式：資料存 localStorage，不打後端
  - 會員模式：帶 JWT 呼叫後端 events API

- 後端（FastAPI）
  - `/auth/*`：註冊、登入、訪客、重設密碼
  - `/events/*`：events CRUD（需 Bearer Token）
  - MongoDB：保存 users、events

### 3.2 資料流
1. 註冊：前端 → `POST /auth/register` → MongoDB.users
2. 登入：前端 → `POST /auth/login` → 回傳 JWT token → 前端存 token
3. 會員 CRUD：前端帶 `Authorization: Bearer <token>` → `POST/GET/PATCH/DELETE /events`
4. 訪客 CRUD：前端只操作 localStorage，不呼叫後端

---

## 4. 目錄結構（重要檔案）

### frontend/
- `src/pages/AuthPage.jsx`：登入/註冊/忘記密碼 UI 與流程
- `src/pages/AppPage.jsx`：主畫面（月曆/週檢視/事項 CRUD）
- `src/components/auth/*`：登入、註冊、忘記密碼 Modal
- `src/components/calendar/*`：月曆、週檢視、事項 Modal、事項明細
- `src/lib/api/*`：呼叫後端 API（auth/events）
- `src/lib/eventsStore.js`：訪客/會員模式資料存取策略（localStorage vs API）
- `src/lib/storage.js`：token/mode/theme/localStorage 管理

### backend/
- `app/main.py`：FastAPI 啟動點，註冊 routers、CORS
- `app/routers/auth.py`：註冊/登入/訪客/重設密碼 API
- `app/routers/events.py`：events CRUD API（JWT 保護）
- `app/models/user.py` / `app/models/event.py`：Pydantic models
- `app/security.py`：密碼雜湊、JWT encode/decode
- `docker-compose.yml`：啟動 MongoDB + API
- `Dockerfile`：建立 API container
- `requirements.txt`：Python 套件

---

## 5. 安裝與執行指引

> 建議先啟動後端，再啟動前端。

### 5.1 後端啟動（Docker）

#### Step 1：進入 backend 資料夾
```bash
cd backend
```

#### Step 2：建立 .env
請建立 `backend/.env`（不要 commit），可由 `.env.example` 複製：

**macOS/Linux**
```bash
cp .env.example .env
```

**Windows PowerShell**
```powershell
copy .env.example .env
```

`.env` 範例（依專案調整）：
```env
MONGO_URL=mongodb://mongo:27017
MONGO_DB=list_planner
JWT_SECRET=CHANGE_ME_TO_A_LONG_RANDOM_STRING
JWT_EXPIRE_MINUTES=10080
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

#### Step 3：啟動 MongoDB + API
```bash
docker compose up -d --build
```

#### Step 4：確認 API 是否正常
- Swagger 文件：`http://localhost:8000/docs`
- 健康檢查：`http://localhost:8000/`

### 5.2 前端啟動（Vite + React）

#### Step 1：進入 frontend 資料夾
```bash
cd frontend
```

#### Step 2：安裝套件
```bash
npm install
```

#### Step 3：設定前端 API base
建立 `frontend/.env`：
```env
VITE_API_BASE=http://localhost:8000
```

#### Step 4：啟動前端
```bash
npm run dev
```

開啟：
- `http://localhost:5173`

---

## 6. API（摘要）

### Auth
- `POST /auth/register`：註冊（username/password/confirmPassword）
- `POST /auth/login`：登入（username/password）→ 回傳 token
- `POST /auth/guest`：訪客 token（作業可選，前端也可純 localStorage）
- `POST /auth/reset-password`：忘記密碼（username/newPassword/confirmNewPassword）

### Events（需 Bearer Token）
- `GET /events/`：查詢（可用 `?dateISO=YYYY-MM-DD` 篩選）
- `POST /events/`：新增
- `PATCH /events/{event_id}`：更新（title/note/done/dateISO 可部分更新）
- `DELETE /events/{event_id}`：刪除

---

## 7. 測試方式（建議）

### 7.1 Postman（後端 API 測試）
建議順序：
1. `POST /auth/register`（第一次 200，重複帳號會 409）
2. `POST /auth/login`（取得 token）
3. `POST /events/`（Headers 加 Authorization Bearer token）
4. `GET /events/?dateISO=...`
5. `PATCH /events/{id}`
6. `DELETE /events/{id}`

### 7.2 MongoDB Compass（查看資料）
連線字串（本機）：
```
mongodb://localhost:27017
```
資料庫：
- `list_planner`
collections：
- `users`
- `events`

---

## 8. 備註（安全性說明）
本作業版本的「忘記密碼」流程已簡化為：
> 輸入帳號 + 新密碼即可重設

實務上應加入 Email 驗證碼/OTP、登入後才能改密碼等機制，以避免未授權重設風險。

---

## 9. License
本專案為課程作業用途，僅供學習與展示。
