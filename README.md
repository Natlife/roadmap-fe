# Học Mẹo Admin Console (`roadmap-fe`)

Trang Web Quản Trị Hệ Thống **Học Mẹo Admin Console**, được xây dựng trên nền tảng **React 18 + Vite 6 + TypeScript 5.8 + MUI 6 (Material UI)**. Giao diện được thiết kế tối giản, hiện đại với tone màu thương hiệu Emerald Green `#4EB748` và hệ màu tối/sáng linh hoạt.

---

## 1. Tính Năng Chính

- **Quản Lý Plan Request Tickets (`/admin/plan-requests`)**:
  - Giao diện Datagrid hiển thị danh sách các yêu cầu nâng cấp gói từ học viên.
  - Phân trang, tìm kiếm thời gian thực theo tên, SĐT, email, nội dung.
  - Bộ lọc trạng thái: `ALL`, `PENDING`, `APPROVED`, `REJECTED`.
  - Hộp thoại duyệt ticket kèm ghi chú. Khi bấm **APPROVED**, hệ thống tự động nâng cấp tài khoản học viên lên gói `PREMIUM`.
- **Quản Lý Nội Dung Đa Tầng (Multi-Stage Content Pipeline)**:
  - Quản lý Topics, Blogs (Lessons), Steps, Content Blocks (Lý thuyết, Mã minh họa, Ghi chú, Video, Audio) và Quiz Questions.
- **Quản Lý Người Dùng & Nhóm Học Tập (Users & Groups)**:
  - Quản lý tài khoản, phân quyền Admin/User, xếp nhóm học tập.
- **Nhận Diện Thương Hiệu Học Mẹo**:
  - Trang Login & Register tối giản với Logo 100x100 căn giữa và câu Quote truyền cảm hứng tiếng Anh.

---

## 2. Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Thư viện / Công nghệ |
|---|---|
| Core Framework | React 18, Vite 6, TypeScript 5.8 (Strict Mode) |
| UI Kit | Material UI (MUI 6), `@mui/material`, `@mui/x-charts` |
| Icons | `iconsax-reactjs` |
| State & HTTP | TanStack Query 5, Axios (Response Envelope Interceptor) |
| Routing | React Router 7 (`createBrowserRouter`, Lazy loading) |
| Form & Validation | Formik + Yup |
| Notifications | Notistack |

---

## 3. Hướng Dẫn Khởi Chạy Cục Bộ (Getting Started)

1. **Cài đặt các gói phụ thuộc**:
   ```bash
   cd roadmap-fe
   npm install
   ```

2. **Cấu hình môi trường**:
   Tạo tệp `.env` từ `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. **Chạy server phát triển (Dev Mode)**:
   ```bash
   npm run dev
   ```
   *Web App sẽ mở tại `http://localhost:5173`*

4. **Đóng gói Production**:
   ```bash
   npm run build
   ```
   *Tệp đóng gói tĩnh tối ưu sẽ được sinh ra tại thư mục `dist/`*

---

## 4. Cấu Trúc Thư Mục (Directory Structure)

```
roadmap-fe/
├── src/
│   ├── api/            # Axios setup, interceptors & endpoints
│   ├── components/     # Reusable UI components (Logo, Cards, Modals)
│   ├── layout/         # Admin Dashboard Shell & Auth Layout
│   ├── pages/admin/    # Content, Plan Requests, Users, Groups Management Pages
│   ├── routes/         # React Router 7 Trees & Role Guards
│   ├── services/       # PlanRequestService, ContentService, UserService
│   └── types/          # Shared TypeScript Definitions
├── dist/               # Production Build Assets
└── .env.example        # Environment Variable Blueprint
```
