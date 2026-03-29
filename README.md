# Lawyer Platform - Frontend

Frontend React.js với Vite cho hệ thống kết nối luật sư và khách hàng.

## 🚀 Tính năng

- ✅ Đăng ký tài khoản (Signup)
- ✅ Đăng nhập (Login)
- ✅ Đăng xuất (Logout)
- ✅ Quên mật khẩu (Forgot Password)
- ✅ Đặt lại mật khẩu (Reset Password)
- ✅ Dashboard theo role (Admin, Lawyer, Client)
- ✅ Protected Routes
- ✅ JWT Authentication với Auto Refresh
- ✅ Responsive Design với Tailwind CSS

## 📋 Yêu cầu

- Node.js >= 16.x
- npm hoặc yarn

## 🔧 Cài đặt

### 1. Cài đặt dependencies

```bash
cd frontend
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 3. Build production

```bash
npm run build
```

Files sẽ được build vào thư mục `dist/`

## 🏗️ Cấu trúc Project

```
frontend/
├── src/
│   ├── components/          # Components tái sử dụng
│   │   └── ProtectedRoute.jsx
│   ├── contexts/             # React Context
│   │   └── AuthContext.jsx
│   ├── pages/               # Các trang
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   └── Dashboard.jsx
│   ├── services/            # API services
│   │   └── api.js
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔌 Kết nối Backend

Frontend được cấu hình để proxy API requests đến backend:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001` (proxy trong `vite.config.js`)

Tất cả requests đến `/api/*` sẽ được proxy đến backend.

## 📱 Các Trang

### Public Routes

- `/` - Trang chủ
- `/login` - Đăng nhập
- `/signup` - Đăng ký
- `/forgot-password` - Quên mật khẩu
- `/reset-password?token=xxx` - Đặt lại mật khẩu

### Protected Routes

- `/dashboard` - Dashboard (yêu cầu đăng nhập)

## 🎨 Styling

Project sử dụng **Tailwind CSS** cho styling. Các màu brand:

- `brand-50`, `brand-100`, `brand-500`, `brand-600`

## 🔐 Authentication Flow

1. User đăng nhập → Nhận JWT token và refresh token
2. Token được lưu trong `localStorage`
3. Mỗi API request tự động thêm `Authorization: Bearer <token>`
4. Nếu token hết hạn → Tự động refresh token
5. Nếu refresh thất bại → Redirect về `/login`

## 📦 Dependencies chính

- **react** - React library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **react-hot-toast** - Toast notifications
- **tailwindcss** - CSS framework
- **vite** - Build tool

## 🐛 Troubleshooting

**Lỗi kết nối API:**
- Kiểm tra backend đã chạy chưa (port 3001)
- Kiểm tra proxy config trong `vite.config.js`

**Lỗi CORS:**
- Đảm bảo backend CORS đã cấu hình đúng (cho phép `http://localhost:3000`)

**Token không hợp lệ:**
- Xóa `localStorage` và đăng nhập lại
- Kiểm tra JWT_SECRET trong backend `.env`

## 📄 License

ISC
