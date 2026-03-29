# Cấu hình Environment Variables

## File .env (BẮT BUỘC)

**Quan trọng:** File `.env` phải được tạo và cấu hình `VITE_API_BASE_URL` trước khi chạy ứng dụng.

Tạo file `.env` trong thư mục `frontend/` với nội dung:

```env
# API Base URL - Backend server URL (BẮT BUỘC)
# Format: http://localhost:PORT/api hoặc https://your-domain.com/api
VITE_API_BASE_URL=http://localhost:3001/api
```

**Lưu ý:**
- `VITE_API_BASE_URL` là **BẮT BUỘC**, không được để trống
- Tất cả API calls từ client sẽ đi qua URL này
- Đảm bảo backend đang chạy và CORS đã được cấu hình đúng

## Cấu hình cho Production

Khi deploy lên production, cập nhật `.env` với URL backend thực tế:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

## Cách sử dụng

1. **Tạo file .env:**
   ```bash
   cd frontend
   cp .env.example .env
   # Hoặc tạo thủ công file .env với nội dung VITE_API_BASE_URL=http://localhost:3001/api
   ```

2. **Cấu hình cho Development:**
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

3. **Cấu hình cho Production:**
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com/api
   ```

4. **Sau khi thay đổi .env:**
   - **QUAN TRỌNG:** Phải restart Vite dev server để áp dụng thay đổi
   ```bash
   # Dừng server (Ctrl+C)
   npm run dev
   ```

## Kiểm tra cấu hình

Sau khi restart, mở browser console và kiểm tra:
- Console sẽ hiển thị: `✅ API Base URL: http://localhost:3001/api`
- Tất cả API requests sẽ được gửi đến URL trong `VITE_API_BASE_URL`
- Nếu thiếu cấu hình, ứng dụng sẽ báo lỗi: `VITE_API_BASE_URL is required`

## Lưu ý

- **Tất cả API calls** từ client đều đi qua `VITE_API_BASE_URL` được cấu hình trong `.env`
- Không có fallback, nếu thiếu cấu hình ứng dụng sẽ không chạy được
- File `.env` không được commit lên git (đã có trong `.gitignore`)
- File `.env.example` là template để tham khảo
