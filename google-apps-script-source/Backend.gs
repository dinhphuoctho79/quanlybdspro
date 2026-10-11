/**
 * BĐS PRO - BACKEND API ENGINE (SIÊU TỐC - ĐẦY ĐỦ CRUD - CHỐNG LAG)
 * Tác giả: Nguyễn Công Dinh (0393990638 - Cần Thơ)
 */

var DB_SHEETS = (typeof DB_SHEETS !== "undefined") ? DB_SHEETS : {
  DU_AN: 'DuAn',
  LO_DAT: 'LoDat',
  NHAN_VIEN: 'NhanVien',
  KHACH_HANG: 'KhachHang',
  GIAO_DICH: 'GiaoDich',
  DOANH_THU: 'DoanhThu',
  CHI_PHI: 'ChiPhi',
  HOA_HONG: 'HoaHong',
  CAI_DAT: 'CaiDat'
};

function getDb_() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {
    return null;
  }
}

/**
 * Nạp toàn bộ dữ liệu siêu tốc (<0.5 giây)
 */
function getFullDataBundle() {
  try {
    const ss = getDb_();
    if (!ss) {
      return { success: true, data: {}, isStandalone: true };
    }
    const bundle = {};

    Object.values(DB_SHEETS).forEach(sheetName => {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        bundle[sheetName] = [];
        return;
      }

      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();

      if (lastRow <= 1 || lastCol === 0) {
        bundle[sheetName] = [];
        return;
      }

      const values = sheet.getRange(1, 1, lastRow, lastCol).getDisplayValues();
      const headers = values[0].map(h => String(h).trim());

      bundle[sheetName] = values.slice(1).map((row, idx) => {
        const item = { _rowIndex: idx + 2 };
        headers.forEach((h, colIdx) => {
          let val = row[colIdx];
          if ((h === 'SDT' || h === 'CCCD') && val) {
            val = String(val).trim();
            if (!val.startsWith('0') && (val.length === 9 || val.length === 11)) {
              val = '0' + val;
            }
          }
          item[h] = val;
        });
        return item;
      });
    });

    return { success: true, data: bundle };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Cập nhật vị trí tọa độ & trạng thái lô đất từ bản đồ
 */
function apiUpdateLotPosition(maLo, lat, lng, trangThai) {
  try {
    const ss = getDb_();
    if (!ss) return { success: false, error: "Vui lòng mở script từ Google Sheet" };
    const sheet = ss.getSheetByName(DB_SHEETS.LO_DAT);
    if (!sheet) return { success: false, error: "Không tìm thấy sheet LoDat" };

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow <= 1) return { success: false, error: "Sheet trống" };

    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h).trim());
    const maLoIdx = headers.indexOf('MaLo');
    const latIdx = headers.indexOf('Lat');
    const lngIdx = headers.indexOf('Lng');
    const sttIdx = headers.indexOf('TrangThai');

    if (maLoIdx === -1) return { success: false, error: "Không tìm thấy cột MaLo" };

    const idList = sheet.getRange(2, maLoIdx + 1, lastRow - 1, 1).getValues().flat().map(String);
    const rowIdx = idList.indexOf(String(maLo));

    if (rowIdx === -1) return { success: false, error: "Không tìm thấy mã lô: " + maLo };

    const targetRow = rowIdx + 2;
    if (latIdx !== -1 && lat !== undefined && lat !== null) {
      sheet.getRange(targetRow, latIdx + 1).setValue(lat);
    }
    if (lngIdx !== -1 && lng !== undefined && lng !== null) {
      sheet.getRange(targetRow, lngIdx + 1).setValue(lng);
    }
    if (sttIdx !== -1 && trangThai) {
      sheet.getRange(targetRow, sttIdx + 1).setValue(trangThai);
    }

    SpreadsheetApp.flush();
    return { success: true, maLo: maLo, lat: lat, lng: lng, trangThai: trangThai };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Cập nhật trạng thái lô đất
 */
function apiUpdateLotStatus(maLo, newStatus) {
  return apiUpdateLotPosition(maLo, null, null, newStatus);
}

/**
 * Thêm mới hoặc Chỉnh sửa một bản ghi trong bất kỳ Sheet nào
 */
function apiSaveRecord(sheetName, recordData, idCol) {
  try {
    const ss = getDb_();
    if (!ss) return { success: false, error: "Chưa kết nối Google Sheet" };
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return { success: false, error: "Không tìm thấy sheet: " + sheetName };

    const lastCol = sheet.getLastColumn();
    if (lastCol === 0) return { success: false, error: "Sheet chưa có dòng tiêu đề" };

    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h).trim());
    const idIdx = headers.indexOf(idCol);
    const idVal = recordData[idCol];

    const lastRow = sheet.getLastRow();
    let targetRow = -1;

    if (lastRow > 1 && idIdx !== -1 && idVal) {
      const ids = sheet.getRange(2, idIdx + 1, lastRow - 1, 1).getValues().flat().map(String);
      const fIdx = ids.indexOf(String(idVal));
      if (fIdx !== -1) {
        targetRow = fIdx + 2;
      }
    }

    const rowValues = headers.map(h => {
      let val = recordData[h];
      if (val === undefined || val === null) return '';
      if ((h === 'SDT' || h === 'CCCD') && val) {
        val = String(val).trim();
        if (!val.startsWith("'")) val = "'" + val;
      }
      return val;
    });

    if (targetRow !== -1) {
      // Cập nhật dòng hiện có
      sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      // Thêm dòng mới
      sheet.appendRow(rowValues);
    }

    SpreadsheetApp.flush();
    return { success: true, isNew: targetRow === -1, data: recordData };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Xóa một bản ghi theo ID
 */
function apiDeleteRecord(sheetName, idCol, idVal) {
  try {
    const ss = getDb_();
    if (!ss) return { success: false, error: "Chưa kết nối Google Sheet" };
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return { success: false, error: "Không tìm thấy sheet: " + sheetName };

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow <= 1) return { success: false, error: "Sheet không có dữ liệu để xóa" };

    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h).trim());
    const idIdx = headers.indexOf(idCol);
    if (idIdx === -1) return { success: false, error: "Không tìm thấy cột: " + idCol };

    const ids = sheet.getRange(2, idIdx + 1, lastRow - 1, 1).getValues().flat().map(String);
    const fIdx = ids.indexOf(String(idVal));

    if (fIdx === -1) return { success: false, error: "Không tìm thấy bản ghi có " + idCol + " = " + idVal };

    sheet.deleteRow(fIdx + 2);
    SpreadsheetApp.flush();

    return { success: true, deletedId: idVal };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Lưu thông số cài đặt hệ thống
 */
function apiSaveConfig(key, value) {
  try {
    const ss = getDb_();
    if (!ss) return { success: false, error: "Chưa kết nối Google Sheet" };
    const sheet = ss.getSheetByName(DB_SHEETS.CAI_DAT);
    if (!sheet) return { success: false, error: "Không tìm thấy sheet CaiDat" };

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const keys = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat().map(String);
      const fIdx = keys.indexOf(String(key));
      if (fIdx !== -1) {
        sheet.getRange(fIdx + 2, 2).setValue(String(value));
        return { success: true, key: key, value: value };
      }
    }

    sheet.appendRow([String(key), String(value)]);
    return { success: true, key: key, value: value };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
