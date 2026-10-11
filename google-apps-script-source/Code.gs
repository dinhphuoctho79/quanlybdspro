/**
 * BĐS PRO - HỆ THỐNG QUẢN LÝ ĐẤT NỀN PHÂN LÔ CHUYÊN NGHIỆP
 * Tác giả: Nguyễn Công Dinh
 * Hotline / Zalo: 0393990638
 * Địa chỉ: Mỹ Phước - Cần Thơ
 * 
 * BẢN QUYỀN © 2026 NGUYỄN CÔNG DINH
 */

function doGet(e) {
  // 1. Phục vụ API dữ liệu JSON cho Web App chạy trên Vercel / GitHub
  if (e && e.parameter && e.parameter.action === 'getFullDataBundle') {
    const data = (typeof getFullDataBundle === 'function') ? getFullDataBundle() : { success: true, data: {} };
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Phục vụ giao diện HTML nếu chạy trực tiếp trên Google Apps Script
  try {
    return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('BĐS PRO - Quản Lý Đất Nền | Nguyễn Công Dinh (0393990638)')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('BĐS PRO - Quản Lý Đất Nền | Nguyễn Công Dinh (0393990638)')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    var result = { success: false, error: 'Không tìm thấy hành động' };

    if (action === 'updateLotPosition' && typeof apiUpdateLotPosition === 'function') {
      result = apiUpdateLotPosition(postData.maLo, postData.lat, postData.lng, postData.trangThai);
    } else if (action === 'updateLotStatus' && typeof apiUpdateLotStatus === 'function') {
      result = apiUpdateLotStatus(postData.maLo, postData.trangThai);
    } else if (action === 'saveRecord' && typeof apiSaveRecord === 'function') {
      result = apiSaveRecord(postData.sheetName, postData.data);
    } else if (action === 'deleteRecord' && typeof apiDeleteRecord === 'function') {
      result = apiDeleteRecord(postData.sheetName, postData.keyField, postData.keyValue);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function include(filename) {
  var namesToTry = [
    filename,
    filename + '.html',
    filename.replace(/\.html$/, '')
  ];
  for (var i = 0; i < namesToTry.length; i++) {
    try {
      return HtmlService.createHtmlOutputFromFile(namesToTry[i]).getContent();
    } catch (e) {}
  }
  return '<script>console.info("Hệ thống sử dụng mã nhúng trực tiếp trong Index.html");</script>';
}
