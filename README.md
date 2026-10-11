# BĐS PRO - HỆ THỐNG QUẢN LÝ ĐẤT NỀN PHÂN LÔ THƯƠNG MẠI

- **Tác giả:** Nguyễn Công Dinh
- **Hotline / Zalo:** 0393990638
- **Địa chỉ:** Mỹ Phước - TP. Cần Thơ
- **Bản quyền:** © 2026 Nguyễn Công Dinh. Toàn quyền sở hữu.

---

## 🌟 TÍNH NĂNG NỔI BẬT

1. **Bản đồ số & Tọa độ thực địa**:
   - Tích hợp Leaflet với bản đồ **Google Maps Đường Phố** và **Google Vệ Tinh (GIS)** sắc nét.
   - Định vị trực tiếp vị trí GPS điện thoại của môi giới khi đang đứng tại thực địa lô đất.
   - Bộ chọn nhanh **Định vị lô** (60 lô đất) tự động `flyTo` cận cảnh với độ zoom 18.
   - Mở dẫn đường Google Maps và sao chép link tọa độ gửi khách hàng qua Zalo/Facebook.
2. **Đăng nhập & Phân quyền chuẩn mực**:
   - Màn hình khóa đăng nhập bắt buộc khi vừa vào hệ thống.
   - 4 cấp bậc phân quyền: **Giám Đốc (Admin)**, **Trưởng Phòng**, **Chuyên Viên Sale**, **Kế Toán**.
   - Cơ chế Đăng xuất an toàn tuyệt đối (`True Logout Lock`), làm mờ và khóa tương tác hệ thống.
3. **Quản lý dữ liệu toàn diện (Full ERP)**:
   - 12 Dự án bất động sản trọng điểm.
   - 60 Lô đất với trạng thái Có sẵn, Đã cọc, Đã bán, Đang thương lượng.
   - 55 Khách hàng & 55 Giao dịch mua bán/đặt cọc.
   - Bảng tính Hoa Hồng kinh doanh tự động theo tỷ lệ phân cấp.
   - Quản lý Doanh thu & Chi phí minh bạch.
4. **Giao diện đa nền tảng**:
   - Chế độ Sáng / Tối (Light & Dark Mode) linh hoạt.
   - Tối ưu 100% cho màn hình điện thoại (Mobile Responsive Bottom Navigation).
   - Sao lưu dữ liệu JSON dự phòng và Nạp lại dữ liệu demo chuẩn bất cứ lúc nào.

---

## 🚀 HƯỚNG DẪN TRIỂN KHAI LÊN GITHUB & VERCEL

### Bước 1: Đẩy mã nguồn lên GitHub của bạn
Mở terminal / PowerShell tại thư mục này và chạy các lệnh:

```bash
git add .
git commit -m "Khoi tao he thong BDS PRO - Nguyen Cong Dinh"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bds-pro.git
git push -u origin main
```
*(Thay `YOUR_USERNAME/bds-pro.git` bằng địa chỉ kho lưu trữ GitHub của bạn)*

### Bước 2: Triển khai lên Vercel (Miễn phí 100% - Siêu tốc)
1. Đăng nhập vào tài khoản [Vercel.com](https://vercel.com).
2. Bấm nút **"Add New..."** ➔ Chọn **"Project"**.
3. Chọn kho lưu trữ **`bds-pro`** trên GitHub mà bạn vừa tải lên.
4. Tại mục **Framework Preset**: Chọn **Other** (hoặc để mặc định).
5. Bấm nút **"Deploy"**.
6. Chỉ sau 10 giây, Vercel sẽ cấp cho bạn một đường link chính thức dạng:
   👉 **`https://bds-pro-[ten-ban].vercel.app`**

Web App chạy trực tiếp trên Vercel không bị giới hạn iframe của Google, tải trang cực nhanh và chạy mượt mà trên mọi điện thoại & máy tính!
