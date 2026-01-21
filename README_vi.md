# 🔮 COZY FOCUS | Thánh Địa Số

<div align="center">

[🇨🇳 中文文档](./README_zh.md) | [🇺🇸 English](./README.md) | **🇻🇳 Tiếng Việt**

</div>

![License](https://img.shields.io/badge/license-BSD_3--Clause-blue.svg)
![React](https://img.shields.io/badge/react-v18.3.1-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/typescript-v5.0-3178C6.svg)
![Vite](https://img.shields.io/badge/vite-v5.0-646CFF.svg)
![State](https://img.shields.io/badge/state-Zustand-orange.svg)

> **"Tìm sự tĩnh lặng trong công việc sâu."**
> Một môi trường năng suất cao cấp, pha trộn thẩm mỹ Cyberpunk với các công cụ tập trung ấm cúng, êm dịu.

---

## 📖 Tổng quan

**Cozy Focus** là một Ứng dụng Đơn trang (SPA) tinh tế được thiết kế để nâng cao trải nghiệm năng suất. Nó vượt xa việc theo dõi thời gian đơn giản bằng cách tạo ra một "Thánh địa" đắm chìm cho người dùng.

Được xây dựng với **React 18** và **TypeScript**, nó có môi trường backend mô phỏng, quản lý trạng thái phức tạp thông qua **Zustand**, và các hoạt ảnh mượt mà, tăng tốc phần cứng sử dụng **Framer Motion**.

## ⚡ Các tính năng chính

### 🕰️ Đồng hồ bấm giờ (Chronometer)
- **Hình ảnh mượt mà**: Vòng tiến độ dựa trên SVG với nội suy mượt mà theo thời gian thực.
- **Chế độ**: Chuyển đổi thông minh giữa Tập trung (Hổ phách), Nghỉ ngắn (Xanh xám), và Nghỉ dài (Chàm).
- **Tự động luân chuyển**: Các tùy chọn tự động bắt đầu có thể cấu hình để chuyển đổi phiên liền mạch.

### 📋 Kiểm soát nhiệm vụ (Mission Control)
- **Quản lý nhiệm vụ**: Tạo, chỉnh sửa và ưu tiên các nhiệm vụ (Thấp/Trung bình/Cao).
- **Ước tính**: Gán ước tính "Pomodoro" và theo dõi mức hoàn thành thực tế so với nỗ lực dự đoán.
- **Tích hợp tập trung sâu**: Ghim một nhiệm vụ cụ thể vào chế độ xem hẹn giờ để duy trì ngữ cảnh.

### 📊 Phân tích thần kinh (Analytics)
- **Trực quan hóa dữ liệu**: Biểu đồ Recharts tương tác hiển thị phân bổ sự tập trung theo thời gian.
- **Chỉ số**: Theo dõi chuỗi hàng ngày, tổng giờ tập trung và tỷ lệ hoàn thành phiên.
- **Xuất CSV**: Tải xuống dữ liệu năng suất của bạn để phân tích bên ngoài.

### 🎨 Không khí & Tùy chỉnh
- **Môi trường trực quan**: Chuyển đổi giữa các hình nền có sẵn hoặc tải lên hình ảnh cục bộ của riêng bạn (được lưu trong bộ nhớ trình duyệt).
- **Chế độ Thiền (Zen Mode)**: Một cú nhấp chuột để dọn dẹp giao diện người dùng cho sự tối giản tuyệt đối.
- **Không gian**: Bật âm thanh nền êm dịu (mô phỏng).

### 🔐 Hệ thống danh tính mô phỏng
- **Mock Auth**: Một dịch vụ giả lập backend mạnh mẽ mô phỏng mã thông báo JWT, độ trễ và tính bền vững của phiên.
- **Quản lý hồ sơ**: Cập nhật chi tiết người dùng, hình đại diện và thông tin xác thực cục bộ.

---

## 🛠️ Ngăn xếp công nghệ

| Lĩnh vực | Công nghệ | Sử dụng |
| :--- | :--- | :--- |
| **Cốt lõi** | React 18, TypeScript | Kiến trúc thành phần và an toàn kiểu. |
| **Build** | Vite | HMR và đóng gói cực nhanh. |
| **Trạng thái** | Zustand | Quản lý trạng thái toàn cục (Xác thực, Hẹn giờ, Nhiệm vụ). |
| **Styling** | Tailwind CSS | Styling ưu tiên tiện ích với cấu hình tùy chỉnh. |
| **Chuyển động** | Framer Motion | Chuyển đổi bố cục, vi tương tác và vật lý. |
| **Định tuyến** | React Router v6 | Định tuyến phía máy khách với các bảo vệ được bảo mật. |
| **Dữ liệu** | LocalStorage API | Lưu giữ trạng thái giữa các lần tải lại (mô phỏng DB). |

---

## 🚀 Bắt đầu

### Điều kiện tiên quyết
- Node.js (v16 trở lên)
- npm hoặc yarn

### Cài đặt

1. **Clone kho lưu trữ**
   ```bash
   git clone https://github.com/your-username/cozy-focus.git
   cd cozy-focus
   ```

2. **Cài đặt các phụ thuộc**
   ```bash
   npm install
   ```

3. **Khởi động máy chủ**
   ```bash
   npm run dev
   ```

4. **Truy cập Thánh địa**
   Mở `http://localhost:5173` trong trình duyệt của bạn.

---

## 🔐 Thông tin xác thực mô phỏng (Phát triển)

Ứng dụng sử dụng một lớp dịch vụ mô phỏng tinh vi (`src/services/fakeBackend.ts`) để mô phỏng các yêu cầu mạng. Mặc dù bạn có thể đăng ký tài khoản mới, bạn cũng có thể sử dụng hồ sơ nhà phát triển được tạo sẵn:

- **Email**: `nekothedev@nekoterminal.com`
- **Mật khẩu**: `password` (hoặc bất kỳ chuỗi nào)

*Lưu ý: Dữ liệu được lưu trong LocalStorage của trình duyệt. Để xóa dữ liệu, hãy đi tới Cấu hình > Vùng nguy hiểm > Khôi phục cài đặt gốc.*

---

## 📂 Cấu trúc kiến trúc

```text
src/
├── api/                # Các giao diện định nghĩa API
├── components/         # Các nguyên tử UI chia sẻ (Buttons, Cards, Inputs)
│   └── ui/             # Bộ UI kit đặc thù Cyberpunk
├── features/           # Các thành phần logic nghiệp vụ phức tạp
│   ├── Timer.tsx       # Logic hẹn giờ cốt lõi & hiển thị SVG
│   ├── TaskBoard.tsx   # Hệ thống quản lý nhiệm vụ
│   └── StatsBoard.tsx  # Trực quan hóa phân tích
├── hooks/              # Các React hooks tùy chỉnh
├── layouts/            # Các trình bao bọc ứng dụng chính
├── pages/              # Các chế độ xem tuyến đường (Dashboard, Login, Settings)
├── services/           # Backend mô phỏng & Dữ liệu mẫu
├── store/              # Định nghĩa trạng thái toàn cục Zustand
└── types/              # Các giao diện TypeScript
```

## 🎨 Triết lý thiết kế

Giao diện người dùng tuân theo bảng màu **"Đá ấm & Neon"**. Khác với các chủ đề cyberpunk gay gắt, Cozy Focus sử dụng:
- **Nền**: Xám ấm đậm (`#1c1917`) thay vì đen tuyền.
- **Điểm nhấn**:
  - *Hổ phách (Amber)* (`#fbbf24`) cho Tập trung/Chính.
  - *Xanh lơ (Cyan)* (`#06b6d4`) cho Công nghệ/Dữ liệu.
  - *Hồng (Rose)* (`#fda4af`) cho Cảnh báo.
- **Glassmorphism**: Sử dụng nhiều `backdrop-blur` và viền mờ để tạo chiều sâu.

---

## 🔮 Lộ trình tương lai

- [ ] **Âm cảnh**: Tích hợp với Howler.js cho âm thanh mưa/quán cà phê thực tế.
- [ ] **Hỗ trợ PWA**: Khả năng ngoại tuyến và cài đặt trên di động.
- [ ] **Đội nhóm**: Bảng nhiệm vụ chia sẻ cho các phiên làm việc cộng tác.
- [ ] **Phím tắt**: Phím nóng toàn cục để điều khiển hẹn giờ.

---

<div align="center">

**CRAFTED WITH INTENTION.**
*System Status: Online*

</div>
