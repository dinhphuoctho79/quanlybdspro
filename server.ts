import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- DATA SCHEMA (The 9 "Sheets") ---
let STORE = {
  projects: [
    { id: 'DA001', name: 'Mỹ Phước Riverside', location: 'Cần Thơ', status: 'Đang mở bán' }
  ],
  lots: [
    { id: 'L01', projectId: 'DA001', block: 'Khu A', name: 'A01', area: 100, pricePerM2: 15000000, totalPrice: 1500000000, direction: 'Đông', type: 'Lô thường', frontage: 5, roadWidth: 7.5, lat: 10.033, lng: 105.785, status: 'Có sẵn' },
    { id: 'L02', projectId: 'DA001', block: 'Khu A', name: 'A02', area: 120, pricePerM2: 16000000, totalPrice: 1920000000, direction: 'Nam', type: 'Lô góc', frontage: 6, roadWidth: 10.5, lat: 10.034, lng: 105.786, status: 'Có sẵn' },
    { id: 'L03', projectId: 'DA001', block: 'Khu B', name: 'B01', area: 100, pricePerM2: 14500000, totalPrice: 1450000000, direction: 'Tây', type: 'Lô thường', frontage: 5, roadWidth: 7.5, lat: 10.035, lng: 105.787, status: 'Đã cọc' },
    { id: 'L04', projectId: 'DA001', block: 'Khu B', name: 'B02', area: 100, pricePerM2: 14500000, totalPrice: 1450000000, direction: 'Bắc', type: 'Lô thường', frontage: 5, roadWidth: 7.5, lat: 10.036, lng: 105.788, status: 'Đã bán' },
  ],
  staff: [
    { id: 'NV001', name: 'Nguyễn Công Dinh', phone: '0393990638', role: 'Quản lý' },
    { id: 'NV002', name: 'Trần Văn A', phone: '0901234567', role: 'Nhân viên sales' }
  ],
  customers: [
    { id: 'KH001', name: 'Lê Thị B', phone: '0912345678', idCard: '012345678901', address: 'Cần Thơ' }
  ],
  transactions: [],
  commissions: [],
  revenue: [],
  expenses: [],
  settings: [
    { key: 'default_commission_rate', value: '1.5' }
  ]
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API ENDPOINTS ---

  // Initial Data Bundle
  app.get('/api/bundle', (req, res) => {
    res.json(STORE);
  });

  // Transaction Logic (The "Backend.gs" equivalent)
  app.post('/api/transactions', (req, res) => {
    const { lotId, customerId, staffId, type, amount, commissionRate } = req.body;
    
    // 1. Find the lot
    const lotIndex = STORE.lots.findIndex(l => l.id === lotId);
    if (lotIndex === -1) return res.status(404).json({ error: 'Lot not found' });
    const lot = STORE.lots[lotIndex];

    // 2. Create Transaction Record
    const newTx = {
      id: `GD${Date.now()}`,
      lotId,
      customerId,
      staffId,
      date: new Date().toISOString(),
      type, // 'Giữ chỗ', 'Đặt cọc', 'Công chứng', 'Hủy cọc'
      amount: Number(amount),
      status: 'Hoàn thành'
    };
    STORE.transactions.push(newTx);

    // 3. Update Lot Status
    if (type === 'Giữ chỗ') lot.status = 'Đang giữ chỗ';
    else if (type === 'Đặt cọc') lot.status = 'Đã cọc';
    else if (type === 'Công chứng') lot.status = 'Đã bán';
    else if (type === 'Hủy cọc') lot.status = 'Có sẵn';

    // 4. Handle Commission (HoaHong)
    if (type === 'Đặt cọc' || type === 'Công chứng') {
      const commAmount = lot.totalPrice * (Number(commissionRate) / 100);
      STORE.commissions.push({
        id: `HH${Date.now()}`,
        transactionId: newTx.id,
        staffId,
        amount: commAmount,
        rate: Number(commissionRate),
        status: 'Chờ duyệt'
      });
    }

    // 5. Handle Revenue (DoanhThu)
    STORE.revenue.push({
      id: `DT${Date.now()}`,
      transactionId: newTx.id,
      date: new Date().toISOString(),
      amount: Number(amount),
      description: `${type} cho lô ${lot.name}`
    });

    res.json({
      success: true,
      transaction: newTx,
      lot: lot,
      revenue: STORE.revenue[STORE.revenue.length - 1]
    });
  });

  // Simple CRUD for other entities
  app.post('/api/lots/update', (req, res) => {
    const updatedLot = req.body;
    const index = STORE.lots.findIndex(l => l.id === updatedLot.id);
    if (index !== -1) {
      STORE.lots[index] = { ...STORE.lots[index], ...updatedLot };
      res.json(STORE.lots[index]);
    } else {
      res.status(404).json({ error: 'Lot not found' });
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(url, (await import('fs')).readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8'));
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
