# 美食分享與聊天應用

## 專案概述

這是一個基於 Next.js 14 和 Firebase 開發的美食分享與聊天應用，旨在提供用戶一個分享食譜、交流烹飪心得的平台。本專案採用現代化的技術棧，實現了基礎的用戶認證和界面框架，並計劃添加更多社交和內容分享功能。

## 技術棧

### 前端框架與工具

- **Next.js 14**: 使用 App Router 架構
- **TypeScript**: 強類型程式語言
- **Tailwind CSS**: 用於快速開發響應式界面
- **Google Fonts**:
  - Noto Sans TC: 主要文字字體
  - Playfair Display: 標題字體
  - Geist Mono: 等寬字體

### 後端服務

- **Firebase**:
  - Authentication: 處理用戶認證
  - Firestore: 數據存儲

## 功能概覽

### 已實現功能

#### 1. 身份驗證系統

- [x] 電子郵件註冊/登入
- [x] Google 帳號登入
- [x] 響應式登入/註冊頁面
- [x] 全局身份驗證狀態管理

#### 2. 用戶界面

- [x] 響應式導航欄
- [x] 主頁面設計
- [x] Logo 組件
- [x] 漸變色彩主題

### 開發中功能

#### 1. 食譜管理

- [x] 食譜發布與編輯
- [x] 食譜搜尋與排序
- [x] 難度分類與篩選
- [x] 評分系統

#### 2. 社交功能

- [ ] 用戶個人主頁
- [ ] 追蹤其他用戶
- [ ] 收藏喜愛的食譜
- [x] 評論與評分系統

#### 3. 即時聊天

- [ ] 群組聊天室
- [ ] 私人訊息

#### 4. AI 功能

- [ ] AI 食譜推薦
- [ ] 智能搜尋建議
- [ ] 內容自動標籤

## 專案結構

app/
├── components/ # 存放可重用的 UI 組件
├── contexts/ # 存放 React Context
├── lib/ # 存放庫文件
├── login/ # 登入頁面
├── register/ # 註冊頁面
├── globals.css # 全局樣式
├── layout.tsx # 應用的佈局
└── page.tsx # 主頁面
public/
├── google.svg # Google 登入按鈕圖標
└── favicon.ico # 網站圖標

## 開發指南

### 環境設置

1. 克隆專案：
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. 安裝依賴：
   ```bash
   npm install
   ```
3. 環境變數配置：
   創建 `.env.local` 文件並添加以下配置：
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

4. 起動開發服務器：
   ```bash
   npm run dev
   ```
5. 在瀏覽器中訪問 `http://localhost:3000` 查看應用。

### 開發規範

#### 代碼風格

- 使用 TypeScript 強類型
- 遵循 ESLint 規則
- 使用 Prettier 格式化代碼

#### 組件開發

- 遵循 React 函數組件範式
- 使用 Hooks 管理狀態
- 確保組件的可重用性

#### Git 工作流

- 使用 feature branches 開發新功能
- 提交訊息需清晰描述更改內容
- 合併前進行代碼審查

## 待辦事項

### 近期目標

1. 完成食譜 CRUD 功能
2. 實現基礎社交功能
3. 建立即時聊天系統

### 長期規劃

1. 優化性能和用戶體驗
2. 擴展 AI 功能
3. 支持多語言
4. 添加更多社交功能

## 貢獻指南

1. Fork 專案
2. 創建功能分支
3. 提交更改
4. 發起 Pull Request

## 授權

本專案採用 MIT 授權條款 - 詳見 LICENSE 文件

## 聯繫方式

如有問題或建議，請通過以下方式聯繫：

- 提交 Issue
- 發送郵件至 [email]
