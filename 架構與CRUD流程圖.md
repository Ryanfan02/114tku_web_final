# WEB_FINAL（114tku_web_final）前後端架構圖與 CRUD 流程圖

> 本文件依照你目前的專案結構（Frontend: React/Vite；Backend: FastAPI；DB: MongoDB / Docker Compose）整理。  
> 圖表使用 **Mermaid**，在 GitHub / VS Code（裝 Mermaid 外掛）即可直接顯示。

---

## 1) 系統架構圖（Frontend + Backend + Database）

```mermaid
flowchart LR
  %% ======= Frontend =======
  subgraph FE[Frontend（Vite + React）]
    FE_pages[pages/\n- AuthPage.jsx\n- AppPage.jsx]
    FE_auth[components/auth/\n- AuthCard.jsx\n- LoginForm.jsx\n- RegisterForm.jsx\n- ForgotPasswordModal.jsx]
    FE_cal[components/calendar/\n- WeekView.jsx\n- MiniMonth.jsx\n- EventModal.jsx\n- EventDetail.jsx]
    FE_lib[lib/\n- api/*\n- eventsStore.js\n- storage.js\n- validators.js\n- dateUtils.js]

    FE_pages --> FE_auth
    FE_pages --> FE_cal
    FE_auth --> FE_lib
    FE_cal --> FE_lib
  end

  %% ======= Backend =======
  subgraph BE[Backend（FastAPI）]
    BE_main[main.py\nFastAPI app / include_router]
    BE_routers[routers/\n- auth.py\n- events.py]
    BE_models[models/\n- user.py\n- event.py]
    BE_deps[deps.py\nAuth deps / roles]
    BE_sec[security.py\nJWT / password hash / token verify]
    BE_db[db.py\nDB client / collections]
    BE_cfg[config.py\n讀取 .env / settings]

    BE_main --> BE_routers
    BE_routers --> BE_models
    BE_routers --> BE_deps
    BE_deps --> BE_sec
    BE_routers --> BE_db
    BE_db --> BE_cfg
  end

  %% ======= Database =======
  subgraph DB[Database]
    MDB[(MongoDB)]
  end

  %% ======= External =======
  User((使用者))
  Browser[Browser]

  User --> Browser --> FE
  FE_lib -- HTTP/JSON --> BE_main
  BE_db -- CRUD --> MDB

  %% ======= Guest Mode =======
  FE_lib -. 訪客模式：只用 localStorage（storage.js / eventsStore.js） .-> Local[(Browser localStorage)]
```

---

## 2) CRUD 流程圖（事件 Event：Create / Read / Update / Delete）

### 2.1 登入狀態與訪客模式總流程（分流）

```mermaid
flowchart TD
  A[使用者操作：新增/查詢/修改/刪除事件] --> B{是否為訪客登入？}
  B -- 是（Guest） --> G1[前端 eventsStore.js 更新狀態]
  G1 --> G2[storage.js 寫入 localStorage]
  G2 --> G3[前端 UI 更新（不呼叫後端）]
  B -- 否（已註冊登入） --> C[前端 lib/api 呼叫後端 API（帶 JWT）]
  C --> D[後端 routers/events.py 接收 Request]
  D --> E[deps.py / security.py 驗證 JWT、權限]
  E --> F[db.py 對 MongoDB 執行 CRUD]
  F --> H[後端回傳 JSON Response]
  H --> I[前端更新 eventsStore.js + UI]
```

---

### 2.2 CRUD 詳細（已登入：前端 → 後端 → DB → 前端）

> 你可以把下列 API 路徑視為範例（實際以 `routers/events.py` 定義為準）。  
> - Create: `POST /events`  
> - Read: `GET /events`、`GET /events/{id}`  
> - Update: `PUT /events/{id}` 或 `PATCH /events/{id}`  
> - Delete: `DELETE /events/{id}`  

#### (A) Create（新增事件）

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant FE as Frontend（EventModal.jsx）
  participant API as lib/api/*
  participant BE as FastAPI（routers/events.py）
  participant SEC as deps.py / security.py
  participant DB as MongoDB

  U->>FE: 填表單並送出
  FE->>API: POST /events（payload + Authorization: Bearer JWT）
  API->>BE: HTTP Request
  BE->>SEC: 驗證 JWT / 取得 user_id
  SEC-->>BE: OK
  BE->>DB: insertOne / insert（event + owner=user_id）
  DB-->>BE: 新增成功（new_id）
  BE-->>API: 201 Created（event JSON）
  API-->>FE: 回傳資料
  FE-->>U: UI 更新（顯示新增事件）
```

#### (B) Read（讀取事件清單 / 單筆）

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant FE as Frontend（WeekView.jsx / MiniMonth.jsx）
  participant API as lib/api/*
  participant BE as FastAPI（routers/events.py）
  participant SEC as deps.py / security.py
  participant DB as MongoDB

  U->>FE: 進入行事曆頁面 / 切換週或月份
  FE->>API: GET /events（含 JWT）
  API->>BE: HTTP Request
  BE->>SEC: 驗證 JWT / user_id
  SEC-->>BE: OK
  BE->>DB: find（owner=user_id, date range）
  DB-->>BE: events[]
  BE-->>API: 200 OK（events JSON）
  API-->>FE: 回傳 events[]
  FE-->>U: UI 顯示事件清單
```

#### (C) Update（修改事件）

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant FE as Frontend（EventDetail.jsx / EventModal.jsx）
  participant API as lib/api/*
  participant BE as FastAPI（routers/events.py）
  participant SEC as deps.py / security.py
  participant DB as MongoDB

  U->>FE: 修改內容並儲存
  FE->>API: PUT/PATCH /events/{id}（payload + JWT）
  API->>BE: HTTP Request
  BE->>SEC: 驗證 JWT + 檢查是否為擁有者
  SEC-->>BE: OK
  BE->>DB: updateOne（_id=id, owner=user_id）
  DB-->>BE: modifiedCount=1
  BE-->>API: 200 OK（updated event）
  API-->>FE: 回傳資料
  FE-->>U: UI 更新（顯示修改後）
```

#### (D) Delete（刪除事件）

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant FE as Frontend（EventDetail.jsx）
  participant API as lib/api/*
  participant BE as FastAPI（routers/events.py）
  participant SEC as deps.py / security.py
  participant DB as MongoDB

  U->>FE: 點刪除
  FE->>API: DELETE /events/{id}（JWT）
  API->>BE: HTTP Request
  BE->>SEC: 驗證 JWT + 檢查是否為擁有者
  SEC-->>BE: OK
  BE->>DB: deleteOne（_id=id, owner=user_id）
  DB-->>BE: deletedCount=1
  BE-->>API: 204 No Content（或 200 OK）
  API-->>FE: 回應成功
  FE-->>U: UI 移除該事件
```

---

## 3) 補充：Auth（註冊 / 登入）簡化流程（可放在報告）

```mermaid
flowchart TD
  R1[RegisterForm.jsx：輸入帳號/密碼/確認密碼] --> R2{兩次密碼是否相同？}
  R2 -- 否 --> R3[前端 validators.js 顯示錯誤]
  R2 -- 是 --> R4[呼叫後端 POST /auth/register]
  R4 --> R5[後端 validate + hash 密碼 + 寫入 DB users]
  R5 --> R6[回傳註冊成功]

  L1[LoginForm.jsx：輸入帳密] --> L2[呼叫後端 POST /auth/login]
  L2 --> L3[後端驗證帳密 / security.py 產生 JWT]
  L3 --> L4[回傳 token / user]
  L4 --> L5[前端 storage.js 保存 token（例如 localStorage/sessionStorage）]
  L5 --> L6[進入 AppPage.jsx / 行事曆功能]
```

---

### 你可以怎麼用這份檔案
- 放到專案根目錄：`114tku_web_final/ARCHITECTURE_AND_FLOW.md`
- 或直接貼到 README 的「系統架構」與「流程圖」章節
