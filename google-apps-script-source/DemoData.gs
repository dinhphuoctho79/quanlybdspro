/**
 * BĐS PRO - HỆ THỐNG QUẢN LÝ ĐẤT NỀN PHÂN LÔ
 * Tác giả: Nguyễn Công Dinh
 * Zalo / Hotline: 0393990638
 * Địa chỉ: Mỹ Phước - Cần Thơ
 * 
 * KHỞI TẠO TOÀN BỘ 9 SHEET CHUẨN 100% THEO TÁC GIẢ (60 LÔ, 12 DỰ ÁN, 15 NHÂN VIÊN, 55 GIAO DỊCH)
 */

function setupInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    Logger.log("Không tìm thấy Spreadsheet đang hoạt động!");
    return;
  }

  const schemas = [
    // 1. DỰ ÁN (12 Dự án bất động sản trọng điểm Cần Thơ)
    {
      name: 'DuAn',
      headers: ['MaDA', 'TenDA', 'DiaChi', 'DT', 'SoLo', 'ChuDauTu', 'TongVon', 'TrangThai'],
      demo: [
        ['DA001', 'KDC Hồng Phát', 'Đường Nguyễn Văn Cừ Nối Dài, P. An Bình, Q. Ninh Kiều, Cần Thơ', '18.000', 45, 'Công ty CP BĐS Hồng Phát Cần Thơ', '320.0 tỷ', 'ĐÃ HOÀN THÀNH'],
        ['DA002', 'KDC Nam Long', 'Đường 1B, P. Hưng Thạnh, Q. Cái Răng, Cần Thơ', '88.000', 250, 'Tập đoàn Nam Long Cần Thơ', '1350.0 tỷ', 'ĐANG BÁN'],
        ['DA003', 'KDC Stella Mega City', 'Đường Đặng Văn Dầy, P. Bình Thủy, Q. Bình Thủy, Cần Thơ', '75.000', 200, 'Tập đoàn KITA Group', '1200.0 tỷ', 'ĐANG BÁN'],
        ['DA004', 'KDC Hưng Phú 1', 'Đường Lý Thái Tổ, P. Hưng Phú, Q. Cái Răng, Cần Thơ', '28.000', 68, 'Công ty CP Phát Triển Nhà Cần Thơ', '450.0 tỷ', 'ĐÃ HOÀN THÀNH'],
        ['DA005', 'KDC Đại Ngân', 'Đường Nguyễn Văn Cừ, P. An Khánh, Q. Ninh Kiều, Cần Thơ', '95.000', 260, 'Công ty CP BĐS Đại Ngân', '1500.0 tỷ', 'ĐANG TRIỂN KHAI'],
        ['DA006', 'KDC Cồn Khương', 'Đường Nguyễn Văn Cừ, P. Cái Khế, Q. Ninh Kiều, Cần Thơ', '42.000', 105, 'Công ty BĐS Vạn Phát Cần Thơ', '780.0 tỷ', 'ĐANG BÁN'],
        ['DA007', 'KDC Ngân Thuận', 'P. Bình Thủy, Q. Bình Thủy, Cần Thơ', '38.000', 96, 'Công ty TNHH Ngân Thuận', '620.0 tỷ', 'ĐANG TRIỂN KHAI'],
        ['DA008', 'KDC Sun Garden', 'Khu vực Mỹ Phước, TP. Cần Thơ (Hotline: 0393990638)', '65.000', 180, 'Địa Ốc Sun Land Cần Thơ', '980.0 tỷ', 'ĐANG TRIỂN KHAI'],
        ['DA009', 'KDC Phú An (586)', 'Đường Võ Nguyên Giáp, P. Phú Thứ, Q. Cái Răng, Cần Thơ', '32.000', 82, 'Công ty CP Xây Dựng 586 Cần Thơ', '520.0 tỷ', 'CHUẨN BỊ'],
        ['DA010', 'KDC Thới Nhựt', 'P. An Khánh, Q. Ninh Kiều, Cần Thơ', '35.000', 90, 'Công ty CP Đầu Tư Xây Dựng Cần Thơ', '550.0 tỷ', 'ĐANG TRIỂN KHAI'],
        ['DA011', 'KDC Long Thịnh', 'P. Phú Thứ, Q. Cái Răng, Cần Thơ', '48.000', 130, 'Công ty CP Long Thịnh Cần Thơ', '700.0 tỷ', 'CHUẨN BỊ'],
        ['DA012', 'KDC Metro Cần Thơ', 'Đường Nguyễn Văn Linh, P. Hưng Lợi, Q. Ninh Kiều, Cần Thơ', '52.000', 120, 'Công ty BĐS Mekong Cần Thơ', '850.0 tỷ', 'ĐANG TRIỂN KHAI']
      ]
    },

    // 2. LÔ ĐẤT (Tọa độ GPS thực địa chuẩn tại TP. Cần Thơ)
    {
            name: 'LoDat',
      headers: ['MaLo', 'MaDuAn', 'TenLo', 'DienTich', 'GiaM2', 'TongGia', 'LoaiLo', 'Huong', 'MatTien', 'Lat', 'Lng', 'TrangThai'],
      demo: [
        ['L0001', 'DA01', 'Lô B3 (Cần Thơ)', 95, 19500000, '1.9 tỷ', 'Lô góc 2 mặt tiền', 'Đông Nam', 7, 10.031471, 105.74907, 'Có sẵn'],
        ['L0002', 'DA01', 'Lô C4 (Cần Thơ)', 110, 21000000, '2.3 tỷ', 'Mặt tiền đường lớn', 'Tây Nam', 9, 10.027106, 105.744572, 'Đã cọc'],
        ['L0003', 'DA01', 'Lô D5 (Cần Thơ)', 125, 22500000, '2.8 tỷ', 'Liền kề nội khu', 'Chính Đông', 5, 10.02476, 105.745096, 'Đã bán'],
        ['L0004', 'DA01', 'Lô E6 (Cần Thơ)', 140, 24000000, '3.4 tỷ', 'Liền kề nội khu', 'Chính Nam', 7, 10.029729, 105.749874, 'Đang TL'],
        ['L0005', 'DA01', 'Lô F7 (Cần Thơ)', 155, 25500000, '4 tỷ', 'Liền kề nội khu', 'Đông Bắc', 9, 10.030795, 105.751906, 'Có sẵn'],
        ['L0006', 'DA02', 'Lô B3 (Long An)', 170, 27000000, '4.6 tỷ', 'Lô góc 2 mặt tiền', 'Đông Nam', 7, 10.63855, 106.496216, 'Đã cọc'],
        ['L0007', 'DA02', 'Lô C4 (Long An)', 80, 28500000, '2.3 tỷ', 'Mặt tiền đường lớn', 'Tây Nam', 9, 10.638837, 106.492209, 'Đã bán'],
        ['L0008', 'DA02', 'Lô D5 (Long An)', 95, 30000000, '2.9 tỷ', 'Liền kề nội khu', 'Chính Đông', 5, 10.644007, 106.493756, 'Đang TL'],
        ['L0009', 'DA02', 'Lô E6 (Long An)', 110, 31500000, '3.5 tỷ', 'Liền kề nội khu', 'Chính Nam', 7, 10.642389, 106.49859, 'Có sẵn'],
        ['L0010', 'DA02', 'Lô F7 (Long An)', 125, 18000000, '2.3 tỷ', 'Liền kề nội khu', 'Đông Bắc', 9, 10.637635, 106.49963, 'Đã cọc'],
        ['L0011', 'DA03', 'Lô B3 (Cần Thơ)', 140, 19500000, '2.7 tỷ', 'Lô góc 2 mặt tiền', 'Đông Nam', 7, 10.081479, 105.745352, 'Đã bán'],
        ['L0012', 'DA03', 'Lô C4 (Cần Thơ)', 155, 21000000, '3.3 tỷ', 'Mặt tiền đường lớn', 'Tây Nam', 9, 10.085499, 105.742023, 'Đang TL'],
        ['L0013', 'DA03', 'Lô D5 (Cần Thơ)', 170, 22500000, '3.8 tỷ', 'Liền kề nội khu', 'Chính Đông', 5, 10.08162, 105.744521, 'Có sẵn'],
        ['L0014', 'DA03', 'Lô E6 (Cần Thơ)', 80, 24000000, '1.9 tỷ', 'Liền kề nội khu', 'Chính Nam', 7, 10.078599, 105.749185, 'Đã cọc'],
        ['L0015', 'DA03', 'Lô F7 (Cần Thơ)', 95, 25500000, '2.4 tỷ', 'Liền kề nội khu', 'Đông Bắc', 9, 10.083257, 105.749183, 'Đã bán'],
        ['L0016', 'DA04', 'Lô B3 (Tiền Giang)', 110, 27000000, '3 tỷ', 'Lô góc 2 mặt tiền', 'Đông Nam', 7, 10.365077, 106.360518, 'Đang TL'],
        ['L0017', 'DA04', 'Lô C4 (Tiền Giang)', 125, 28500000, '3.6 tỷ', 'Mặt tiền đường lớn', 'Tây Nam', 9, 10.35995, 106.358024, 'Có sẵn'],
        ['L0018', 'DA04', 'Lô D5 (Tiền Giang)', 140, 30000000, '4.2 tỷ', 'Liền kề nội khu', 'Chính Đông', 5, 10.359451, 106.361355, 'Đã cọc'],
        ['L0019', 'DA04', 'Lô E6 (Tiền Giang)', 155, 31500000, '4.9 tỷ', 'Liền kề nội khu', 'Chính Nam', 7, 10.364707, 106.365631, 'Đã bán'],
        ['L0020', 'DA04', 'Lô F7 (Tiền Giang)', 170, 18000000, '3.1 tỷ', 'Liền kề nội khu', 'Đông Bắc', 9, 10.363852, 106.364588, 'Đang TL'],
        ['L0021', 'DA05', 'Lô B3 (Đồng Tháp)', 80, 19500000, '1.6 tỷ', 'Lô góc 2 mặt tiền', 'Đông Nam', 7, 10.300816, 105.755753, 'Có sẵn'],
        ['L0022', 'DA05', 'Lô C4 (Đồng Tháp)', 95, 21000000, '2 tỷ', 'Mặt tiền đường lớn', 'Tây Nam', 9, 10.302969, 105.75421, 'Đã cọc'],
        ['L0023', 'DA05', 'Lô D5 (Đồng Tháp)', 110, 22500000, '2.5 tỷ', 'Liền kề nội khu', 'Chính Đông', 5, 10.30745, 105.758219, 'Đã bán'],
        ['L0024', 'DA05', 'Lô E6 (Đồng Tháp)', 125, 24000000, '3 tỷ', 'Liền kề nội khu', 'Chính Nam', 7, 10.304142, 105.761907, 'Đang TL'],
        ['L0025', 'DA05', 'Lô F7 (Đồng Tháp)', 140, 25500000, '3.6 tỷ', 'Liền kề nội khu', 'Đông Bắc', 9, 10.300514, 105.759871, 'Có sẵn'],
        ['L0026', 'DA06', 'Lô B3 (An Giang)', 155, 27000000, '4.2 tỷ', 'Lô góc 2 mặt tiền', 'Đông Nam', 7, 10.385756, 105.412094, 'Đã cọc'],
        ['L0027', 'DA06', 'Lô C4 (An Giang)', 170, 28500000, '4.8 tỷ', 'Mặt tiền đường lớn', 'Tây Nam', 9, 10.388292, 105.411574, 'Đã bán'],
        ['L0028', 'DA06', 'Lô D5 (An Giang)', 80, 30000000, '2.4 tỷ', 'Liền kề nội khu', 'Chính Đông', 5, 10.383396, 105.416073, 'Đang TL'],
        ['L0029', 'DA06', 'Lô E6 (An Giang)', 95, 31500000, '3 tỷ', 'Liền kề nội khu', 'Chính Nam', 7, 10.382122, 105.419, 'Có sẵn'],
        ['L0030', 'DA06', 'Lô F7 (An Giang)', 110, 18000000, '2 tỷ', 'Liền kề nội khu', 'Đông Bắc', 9, 10.387346, 105.416067, 'Đã cọc'],
        ['L0031', 'DA07', 'Lô B3 (Cần Thơ)', 125, 19500000, '2.4 tỷ', 'Lô góc 2 mặt tiền', 'Đông Nam', 7, 10.037274, 105.782571, 'Đã bán'],
        ['L0032', 'DA07', 'Lô C4 (Cần Thơ)', 140, 21000000, '2.9 tỷ', 'Mặt tiền đường lớn', 'Tây Nam', 9, 10.032068, 105.783099, 'Đang TL'],
        ['L0033', 'DA07', 'Lô D5 (Cần Thơ)', 155, 22500000, '3.5 tỷ', 'Liền kề nội khu', 'Chính Đông', 5, 10.033482, 105.787877, 'Có sẵn'],
        ['L0034', 'DA07', 'Lô E6 (Cần Thơ)', 170, 24000000, '4.1 tỷ', 'Liền kề nội khu', 'Chính Nam', 7, 10.038323, 105.789906, 'Đã cọc'],
        ['L0035', 'DA07', 'Lô F7 (Cần Thơ)', 80, 25500000, '2 tỷ', 'Liền kề nội khu', 'Đông Bắc', 9, 10.035662, 105.786212, 'Đã bán'],
        ['L0036', 'DA08', 'Lô B3 (Cái Răng)', 95, 27000000, '2.6 tỷ', 'Lô góc 2 mặt tiền', 'Đông Nam', 7, 10.008507, 105.771208, 'Đang TL'],
        ['L0037', 'DA08', 'Lô C4 (Cái Răng)', 110, 28500000, '3.1 tỷ', 'Mặt tiền đường lớn', 'Tây Nam', 9, 10.012238, 105.772759, 'Có sẵn'],
        ['L0038', 'DA08', 'Lô D5 (Cái Răng)', 125, 30000000, '3.8 tỷ', 'Liền kề nội khu', 'Chính Đông', 5, 10.015432, 105.777593, 'Đã cọc'],
        ['L0039', 'DA08', 'Lô E6 (Cái Răng)', 140, 31500000, '4.4 tỷ', 'Liền kề nội khu', 'Chính Nam', 7, 10.010877, 105.778628, 'Đã bán'],
        ['L0040', 'DA08', 'Lô F7 (Cái Răng)', 155, 18000000, '2.8 tỷ', 'Liền kề nội khu', 'Đông Bắc', 9, 10.008857, 105.774348, 'Đang TL'],
        ['L0041', 'DA09', 'Lô B3 (Kiên Giang)', 170, 19500000, '3.3 tỷ', 'Lô góc 2 mặt tiền', 'Đông Nam', 7, 10.016933, 105.078023, 'Có sẵn'],
        ['L0042', 'DA09', 'Lô C4 (Kiên Giang)', 80, 21000000, '1.7 tỷ', 'Mặt tiền đường lớn', 'Tây Nam', 9, 10.017645, 105.080524, 'Đã cọc'],
        ['L0043', 'DA09', 'Lô D5 (Kiên Giang)', 95, 22500000, '2.1 tỷ', 'Liền kề nội khu', 'Chính Đông', 5, 10.012386, 105.085188, 'Đã bán'],
        ['L0044', 'DA09', 'Lô E6 (Kiên Giang)', 110, 24000000, '2.6 tỷ', 'Liền kề nội khu', 'Chính Nam', 7, 10.013029, 105.085181, 'Đang TL'],
        ['L0045', 'DA09', 'Lô F7 (Kiên Giang)', 125, 25500000, '3.2 tỷ', 'Liền kề nội khu', 'Đông Bắc', 9, 10.018122, 105.080514, 'Có sẵn'],
        ['L0046', 'DA10', 'Lô B3 (Hậu Giang)', 140, 27000000, '3.8 tỷ', 'Lô góc 2 mặt tiền', 'Đông Nam', 7, 9.786167, 105.468024, 'Đã cọc'],
        ['L0047', 'DA10', 'Lô C4 (Hậu Giang)', 155, 28500000, '4.4 tỷ', 'Mặt tiền đường lớn', 'Tây Nam', 9, 9.781577, 105.471359, 'Đã bán'],
        ['L0048', 'DA10', 'Lô D5 (Hậu Giang)', 170, 30000000, '5.1 tỷ', 'Liền kề nội khu', 'Chính Đông', 5, 9.784715, 105.475633, 'Đang TL'],
        ['L0049', 'DA10', 'Lô E6 (Hậu Giang)', 80, 31500000, '2.5 tỷ', 'Liền kề nội khu', 'Chính Nam', 7, 9.788496, 105.474585, 'Có sẵn'],
        ['L0050', 'DA10', 'Lô F7 (Hậu Giang)', 95, 18000000, '1.7 tỷ', 'Liền kề nội khu', 'Đông Bắc', 9, 9.784384, 105.46975, 'Đã cọc'],
        ['L0051', 'DA11', 'Lô B3 (Bến Tre)', 110, 19500000, '2.1 tỷ', 'Lô góc 2 mặt tiền', 'Đông Nam', 7, 10.240663, 106.372211, 'Đã bán'],
        ['L0052', 'DA11', 'Lô C4 (Bến Tre)', 125, 21000000, '2.6 tỷ', 'Mặt tiền đường lớn', 'Tây Nam', 9, 10.245476, 106.376223, 'Đang TL'],
        ['L0053', 'DA11', 'Lô D5 (Bến Tre)', 140, 22500000, '3.2 tỷ', 'Liền kề nội khu', 'Chính Đông', 5, 10.246957, 106.379908, 'Có sẵn'],
        ['L0054', 'DA11', 'Lô E6 (Bến Tre)', 155, 24000000, '3.7 tỷ', 'Liền kề nội khu', 'Chính Nam', 7, 10.241762, 106.377868, 'Đã cọc'],
        ['L0055', 'DA11', 'Lô F7 (Bến Tre)', 170, 25500000, '4.3 tỷ', 'Liền kề nội khu', 'Đông Bắc', 9, 10.24162, 106.373091, 'Đã bán'],
        ['L0056', 'DA12', 'Lô B3 (Cà Mau)', 80, 27000000, '2.2 tỷ', 'Lô góc 2 mặt tiền', 'Đông Nam', 7, 9.180851, 105.150576, 'Đang TL'],
        ['L0057', 'DA12', 'Lô C4 (Cà Mau)', 95, 28500000, '2.7 tỷ', 'Mặt tiền đường lớn', 'Tây Nam', 9, 9.179645, 105.155077, 'Có sẵn'],
        ['L0058', 'DA12', 'Lô D5 (Cà Mau)', 110, 30000000, '3.3 tỷ', 'Liền kề nội khu', 'Chính Đông', 5, 9.174725, 105.158, 'Đã cọc'],
        ['L0059', 'DA12', 'Lô E6 (Cà Mau)', 125, 31500000, '3.9 tỷ', 'Liền kề nội khu', 'Chính Nam', 7, 9.177199, 105.155063, 'Đã bán'],
        ['L0060', 'DA12', 'Lô F7 (Cà Mau)', 140, 18000000, '2.5 tỷ', 'Liền kề nội khu', 'Đông Bắc', 9, 9.181482, 105.150569, 'Đang TL']
      ]
    },

    // 3. NHÂN VIÊN (Chuẩn theo ảnh Quản Lý Nhân Viên - Giữ nguyên số 0 đầu điện thoại)
    {
      name: 'NhanVien',
      headers: ['MaNV', 'HoTen', 'SDT', 'Email', 'ChucVu', 'PhongBan', 'LuongCB', 'TrangThai'],
      demo: [
        ['NV006', 'Võ Thị Lan', "'0956789012", 'lan.vt@company.vn', 'Nhân viên KD', 'KINH DOANH', '15.000.000 đ', 'ĐANG LÀM'],
        ['NV014', 'Phan Thị Kim Ngân', "'0714567890", 'ngan.ptk@company.vn', 'Nhân viên pháp lý', 'PHÁP LÝ', '18.000.000 đ', 'ĐANG LÀM'],
        ['NV002', 'Lê Thị Hương', "'0912345678", 'huong.lt@company.vn', 'Phó Giám đốc', 'BAN GIÁM ĐỐC', '40.000.000 đ', 'ĐANG LÀM'],
        ['NV004', 'Phạm Thị Mai', "'0934567890", 'mai.pt@company.vn', 'Nhân viên KD', 'KINH DOANH', '15.000.000 đ', 'ĐANG LÀM'],
        ['NV008', 'Bùi Thị Ngọc', "'0978901234", 'ngoc.bt@company.vn', 'Nhân viên KT', 'KẾ TOÁN', '12.000.000 đ', 'ĐANG LÀM'],
        ['NV012', 'Lý Thị Mỹ Duyên', "'0392345678", 'duyen.ltm@company.vn', 'Nhân viên Marketing', 'MARKETING', '14.000.000 đ', 'ĐANG LÀM'],
        ['NV005', 'Huỳnh Văn Đạt', "'0945678901", 'dat.hv@company.vn', 'Nhân viên KD', 'KINH DOANH', '15.000.000 đ', 'ĐANG LÀM'],
        ['NV013', 'Trương Quốc Huy', "'0703456789", 'huy.tq@company.vn', 'Nhân viên KT', 'KẾ TOÁN', '12.000.000 đ', 'ĐANG LÀM'],
        ['NV010', 'Hồ Thị Thanh', "'0990123456", 'thanh.ht@company.vn', 'Nhân viên hành chính', 'HÀNH CHÍNH', '10.000.000 đ', 'ĐANG LÀM'],
        ['NV003', 'Nguyễn Hoàng Phúc', "'0923456789", 'phuc.nh@company.vn', 'Trưởng phòng KD', 'KINH DOANH', '30.000.000 đ', 'ĐANG LÀM'],
        ['NV011', 'Dương Văn Lực', "'0381234567", 'luc.dv@company.vn', 'Nhân viên KD', 'KINH DOANH', '15.000.000 đ', 'ĐANG LÀM'],
        ['NV007', 'Đặng Minh Khôi', "'0967890123", 'khoi.dm@company.vn', 'Kế toán trưởng', 'KẾ TOÁN', '25.000.000 đ', 'ĐANG LÀM'],
        ['NV015', 'Diệp Văn Hoàng', "'0325678901", 'hoang.dv@company.vn', 'Nhân viên KD', 'KINH DOANH', '15.000.000 đ', 'NGHỈ VIỆC'],
        ['NV001', 'Trần Minh Tuấn', "'0901234567", 'tuan.tm@company.vn', 'Giám đốc', 'BAN GIÁM ĐỐC', '50.000.000 đ', 'ĐANG LÀM'],
        ['NV009', 'Ngô Quốc Bảo', "'0989012345", 'bao.nq@company.vn', 'Quản lý dự án', 'KỸ THUẬT', '28.000.000 đ', 'ĐANG LÀM']
      ]
    },

    // 4. KHÁCH HÀNG (Chuẩn theo ảnh Quản Lý Khách Hàng)
    {
      name: 'KhachHang',
      headers: ['MaKH', 'HoTen', 'SDT', 'Email', 'Nguon', 'NVPhuTrach', 'NgayTao'],
      demo: [
        ['KH013', 'Trương Văn Nam', "'0860315335", 'truongvannam13@gmail.com', 'TRỰC TIẾP', 'NV003', '28/05/2024'],
        ['KH043', 'Nguyễn Thị Xuyến', "'0730120425", 'nguyenthixuyen43@gmail.com', 'NGƯỜI QUEN', 'NV006', '28/04/2024'],
        ['KH014', 'Phan Thị Oanh', "'0681567573", 'phanthioanh14@gmail.com', 'WEBSITE', 'NV005', '27/01/2024'],
        ['KH022', 'Nguyễn Hoàng Xa', "'0956865012", 'nguyenhoangxa22@gmail.com', 'ZALO', 'NV002', '27/06/2024'],
        ['KH003', 'Lê Hoàng Cường', "'0676146095", 'lehoangcuong3@gmail.com', 'GIỚI THIỆU', 'NV003', '26/10/2024'],
        ['KH028', 'Đặng Quốc Duy', "'0446342839", 'dangquocduy28@gmail.com', 'TRỰC TIẾP', 'NV008', '26/07/2024'],
        ['KH041', 'Vũ Thị Vi', "'0895989078", 'vuthivi41@gmail.com', 'FACEBOOK', 'NV001', '26/03/2024'],
        ['KH045', 'Lê Bảo Bình', "'0826317715", 'lebaobinh45@gmail.com', 'NGƯỜI QUEN', 'NV005', '26/10/2024'],
        ['KH007', 'Đặng Thị Giang', "'0920976134", 'dangthigiang7@gmail.com', 'QUẢNG CÁO GOOGLE', 'NV003', '25/10/2024'],
        ['KH042', 'Đỗ Hoàng Vương', "'0367674342", 'dohoangvuong42@gmail.com', 'WEBSITE', 'NV009', '25/06/2024'],
        ['KH009', 'Ngô Thị Lan', "'0840993016", 'ngothilan9@gmail.com', 'HỘI CHỢ BĐS', 'NV002', '24/01/2024'],
        ['KH047', 'Huỳnh Văn Đạt', "'0841301269", 'huynhvandat47@gmail.com', 'HỘI CHỢ BĐS', 'NV006', '24/11/2024'],
        ['KH010', 'Hồ Thanh Khải', "'0966854932", 'hothanhkhai10@gmail.com', 'HỘI CHỢ BĐS', 'NV002', '23/07/2024'],
        ['KH050', 'Bùi Thị Linh', "'0438016053", 'buithilinh50@gmail.com', 'FACEBOOK', 'NV002', '23/04/2024'],
        ['KH055', 'Huỳnh Thị Em', "'0821925424", 'huynhthiem55@gmail.com', 'FACEBOOK', 'NV010', '22/03/2024']
      ]
    },

    // 5. GIAO DỊCH (Chuẩn theo ảnh Quản Lý Giao Dịch)
    {
      name: 'GiaoDich',
      headers: ['MaGD', 'MaLo', 'MaKH', 'LoaiGD', 'GiaTri', 'NgayGD', 'PTThanhToan', 'TrangThai'],
      demo: [
        ['GD006', 'L0031', 'KH045', 'ĐẶT CỌC', '4.1 tỷ', '28/11/2024', 'Trả góp', 'ĐÃ THANH TOÁN'],
        ['GD010', 'L0012', 'KH024', 'ĐẶT CỌC', '3.4 tỷ', '28/09/2024', 'Chuyển khoản', 'ĐANG XỬ LÝ'],
        ['GD017', 'L0043', 'KH042', 'CHUYỂN NHƯỢNG', '4.6 tỷ', '27/09/2024', 'Tiền mặt', 'CHỜ THANH TOÁN'],
        ['GD023', 'L0035', 'KH050', 'MUA BÁN', '556 triệu', '27/04/2024', 'Trả góp', 'CHỜ THANH TOÁN'],
        ['GD014', 'L0056', 'KH06', 'ĐẶT CỌC', '2.6 tỷ', '26/07/2024', 'Trả góp', 'ĐÃ THANH TOÁN'],
        ['GD031', 'L0059', 'KH043', 'ĐẶT CỌC', '717 triệu', '26/03/2024', 'Kết hợp', 'CHỜ THANH TOÁN'],
        ['GD002', 'L0056', 'KH043', 'ĐẶT CỌC', '1.9 tỷ', '25/06/2024', 'Trả góp', 'ĐÃ HỦY'],
        ['GD038', 'L0013', 'KH031', 'ĐẶT CỌC', '2.8 tỷ', '25/03/2024', 'Tiền mặt', 'ĐÃ HỦY'],
        ['GD051', 'L0010', 'KH07', 'MUA BÁN', '4.8 tỷ', '25/09/2024', 'Chuyển khoản', 'CHỜ THANH TOÁN'],
        ['GD008', 'L0045', 'KH0018', 'ĐẶT CỌC', '4.3 tỷ', '24/03/2024', 'Trả góp', 'CHỜ THANH TOÁN'],
        ['GD022', 'L005', 'KH016', 'CHUYỂN NHƯỢNG', '4.3 tỷ', '24/04/2024', 'Chuyển khoản', 'ĐÃ THANH TOÁN'],
        ['GD055', 'L0023', 'KH048', 'CHUYỂN NHƯỢNG', '1.3 tỷ', '24/11/2024', 'Kết hợp', 'ĐÃ HỦY'],
        ['GD046', 'L0050', 'KH055', 'ĐẶT CỌC', '3.9 tỷ', '23/12/2024', 'Kết hợp', 'ĐÃ HỦY'],
        ['GD029', 'L0059', 'KH05', 'CHUYỂN NHƯỢNG', '4.6 tỷ', '22/03/2024', 'Chuyển khoản', 'CHỜ THANH TOÁN'],
        ['GD034', 'L0016', 'KH024', 'CHUYỂN NHƯỢNG', '4.6 tỷ', '22/05/2024', 'Trả góp', 'CHỜ THANH TOÁN']
      ]
    },

    // 6. DOANH THU (Chuẩn theo ảnh Quản Lý Doanh Thu)
    {
      name: 'DoanhThu',
      headers: ['MaDT', 'MaDA', 'LoaiThu', 'SoTien', 'NgayThu', 'HinhThuc', 'NguoiThu'],
      demo: [
        ['DT011', 'DA05', 'TIỀN ĐẶT CỌC', '536.145.618 đ', '28/05/2024', 'Tiền mặt', 'NV003'],
        ['DT015', 'DA02', 'THANH TOÁN ĐỢT 1', '454.360.538 đ', '28/10/2024', 'Séc', 'NV005'],
        ['DT037', 'DA001', 'THANH TOÁN ĐỢT 2', '329.239.039 đ', '28/07/2024', 'Chuyển khoản', 'NV0010'],
        ['DT008', 'DA004', 'THANH TOÁN ĐỢT 3', '821.052.855 đ', '27/01/2024', 'Chuyển khoản', 'NV007'],
        ['DT016', 'DA0010', 'PHÍ DỊCH VỤ', '690.291.551 đ', '27/11/2024', 'Chuyển khoản', 'NV0010'],
        ['DT028', 'DA008', 'THANH TOÁN ĐỢT 3', '115.593.698 đ', '26/05/2024', 'Tiền mặt', 'NV002'],
        ['DT035', 'DA004', 'THANH TOÁN ĐỢT 3', '468.887.100 đ', '26/06/2024', 'Séc', 'NV002'],
        ['DT014', 'DA007', 'TIỀN ĐẶT CỌC', '386.927.154 đ', '25/08/2024', 'Séc', 'NV001'],
        ['DT020', 'DA009', 'PHÍ QUẢN LÝ', '634.979.600 đ', '25/05/2024', 'Tiền mặt', 'NV002'],
        ['DT030', 'DA05', 'THANH TOÁN CUỐI', '838.489.926 đ', '24/10/2024', 'Tiền mặt', 'NV003'],
        ['DT044', 'DA04', 'TIỀN ĐẶT CỌC', '495.442.769 đ', '23/09/2024', 'Chuyển khoản', 'NV007'],
        ['DT060', 'DA009', 'THANH TOÁN ĐỢT 1', '697.848.887 đ', '23/12/2024', 'Chuyển khoản', 'NV001']
      ]
    },

    // 7. CHI PHÍ (Chuẩn theo ảnh Quản Lý Chi Phí)
    {
      name: 'ChiPhi',
      headers: ['MaCP', 'MaDA', 'Loai', 'MoTa', 'SoTien', 'NgayChi', 'TrangThai'],
      demo: [
        ['CP026', 'DA001', 'CÂY XANH CẢNH QUAN', 'Cây xanh cảnh quan cho dự án DA001', '239.665.406 đ', '28/02/2024', 'ĐÃ THANH TOÁN'],
        ['CP032', 'DA09', 'CÂY XANH CẢNH QUAN', 'Cây xanh cảnh quan cho dự án DA09', '20.491.534 đ', '27/07/2024', 'ĐÃ DUYỆT'],
        ['CP046', 'DA03', 'THUẾ PHÍ', 'Thuế phí cho dự án DA03', '217.381.088 đ', '26/11/2024', 'ĐÃ DUYỆT'],
        ['CP049', 'DA006', 'QUẢNG CÁO MARKETING', 'Quảng cáo marketing cho dự án DA006', '284.558.929 đ', '26/08/2024', 'ĐÃ THANH TOÁN'],
        ['CP002', 'DA001', 'PHÁP LÝ', 'Pháp lý cho dự án DA001', '138.145.021 đ', '25/12/2024', 'ĐÃ THANH TOÁN'],
        ['CP047', 'DA005', 'CHI PHÍ KHÁC', 'Chi phí khác cho dự án DA005', '44.162.258 đ', '25/10/2024', 'CHỜ DUYỆT'],
        ['CP008', 'DA0011', 'SAN LẤP MẶT BẰNG', 'San lấp mặt bằng cho dự án DA0011', '368.090.027 đ', '24/01/2024', 'ĐÃ DUYỆT'],
        ['CP031', 'DA0012', 'LƯƠNG NHÂN VIÊN', 'Lương nhân viên cho dự án DA0012', '274.065.940 đ', '24/07/2024', 'TẠM ỨNG'],
        ['CP045', 'DA001', 'VẬT LIỆU XÂY DỰNG', 'Vật liệu xây dựng cho dự án DA001', '184.207.196 đ', '24/05/2024', 'CHỜ DUYỆT'],
        ['CP003', 'DA006', 'PHÁP LÝ', 'Pháp lý cho dự án DA006', '470.872.629 đ', '23/10/2024', 'ĐÃ DUYỆT']
      ]
    },

    // 8. HOA HỒNG (Chuẩn theo ảnh Quản Lý Hoa Hồng)
    {
      name: 'HoaHong',
      headers: ['MaHH', 'MaNV', 'MaGD', 'GiaTriGD', 'TyLe', 'TienHH', 'NgayTinh', 'TrangThai'],
      demo: [
        ['HH027', 'NV009', 'GD027', '2.7 tỷ', '4%', '107.075.836 đ', '28/06/2024', 'ĐÃ THANH TOÁN'],
        ['HH046', 'NV001', 'GD046', '3.0 tỷ', '4%', '118.155.958 đ', '28/11/2024', 'ĐÃ THANH TOÁN'],
        ['HH053', 'NV009', 'GD053', '3.7 tỷ', '3%', '111.736.840 đ', '28/05/2024', 'ĐÃ THANH TOÁN'],
        ['HH043', 'NV004', 'GD043', '4.6 tỷ', '4%', '183.686.207 đ', '27/12/2024', 'ĐÃ THANH TOÁN'],
        ['HH017', 'NV09', 'GD017', '896 triệu', '1%', '8.962.973 đ', '26/01/2024', 'CHỜ THANH TOÁN'],
        ['HH019', 'NV003', 'GD019', '2.3 tỷ', '3%', '68.011.431 đ', '26/10/2024', 'ĐÃ THANH TOÁN'],
        ['HH022', 'NV002', 'GD022', '2.9 tỷ', '3%', '88.493.662 đ', '26/09/2024', 'CHỜ THANH TOÁN'],
        ['HH045', 'NV007', 'GD045', '4.2 tỷ', '4%', '169.280.294 đ', '26/05/2024', 'CHỜ THANH TOÁN'],
        ['HH010', 'NV004', 'GD010', '2.7 tỷ', '1%', '26.582.973 đ', '22/06/2024', 'CHỜ THANH TOÁN'],
        ['HH021', 'NV008', 'GD021', '4.3 tỷ', '1%', '42.511.698 đ', '22/08/2024', 'CHỜ THANH TOÁN']
      ]
    },

    // 9. CÀI ĐẶT
    {
      name: 'CaiDat',
      headers: ['Key', 'Value'],
      demo: [
        ['APP_NAME', 'BĐS PRO'],
        ['SUBTITLE', 'QUẢN LÝ ĐẤT NỀN PHÂN LÔ'],
        ['AUTHOR', 'Nguyễn Công Dinh'],
        ['HOTLINE', "'0393990638"],
        ['ADDRESS', 'Mỹ Phước - TP. Cần Thơ'],
        ['MAP_DEFAULT_REGION', 'mientay_all'],
        ['MAP_DEFAULT_LAT', '10.000000'],
        ['MAP_DEFAULT_LNG', '105.700000'],
        ['MAP_DEFAULT_ZOOM', '9'],
        ['HH_DEFAULT_RATE', '3%']
      ]
    }
  ];

  schemas.forEach(s => {
    let sheet = ss.getSheetByName(s.name);
    if (!sheet) {
      sheet = ss.insertSheet(s.name);
    }
    
    // Nếu sheet mới tạo hoặc trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(s.headers);
      if (s.demo && s.demo.length > 0) {
        s.demo.forEach(row => sheet.appendRow(row));
      }
    }

    // Định dạng header màu xanh đậm đặc trưng tác giả (#14532D)
    sheet.getRange(1, 1, 1, s.headers.length)
      .setFontWeight("bold")
      .setBackground("#14532d")
      .setFontColor("#FFFFFF")
      .setHorizontalAlignment("center");
      
    sheet.setFrozenRows(1);
    
    // Định dạng text cho cột SĐT / CCCD để không mất số 0
    if (s.name === 'NhanVien' || s.name === 'KhachHang') {
      sheet.getRange("C:C").setNumberFormat("@");
    }
    if (s.name === 'KhachHang') {
      sheet.getRange("D:D").setNumberFormat("@");
    }
  });

  SpreadsheetApp.flush();
  Logger.log("✅ Đã thiết lập hoàn tất 9 Sheet chuẩn 100% theo bản quyền Nguyễn Công Dinh (0393990638)!");
}
