/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Layers, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Settings as SettingsIcon,
  Search,
  Plus,
  Filter,
  ChevronRight,
  MoreVertical,
  Home,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Menu,
  X,
  Phone,
  MapPin,
  Landmark,
  FileText
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
});

// --- TYPES ---
interface Lot {
  id: string;
  projectId: string;
  block: string;
  name: string;
  area: number;
  pricePerM2: number;
  totalPrice: number;
  direction: string;
  type: string;
  frontage: number;
  roadWidth: number;
  lat: number;
  lng: number;
  status: 'Có sẵn' | 'Đang giữ chỗ' | 'Đã cọc' | 'Đã bán';
}

interface Project {
  id: string;
  name: string;
  location: string;
  status: string;
}

interface Staff {
  id: string;
  name: string;
  phone: string;
  role: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  idCard: string;
  address: string;
}

interface Transaction {
  id: string;
  lotId: string;
  customerId: string;
  staffId: string;
  date: string;
  type: string;
  amount: number;
  status: string;
}

// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: Lot['status'] }) => {
  const configs = {
    'Có sẵn': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Đang giữ chỗ': 'bg-blue-100 text-blue-700 border-blue-200',
    'Đã cọc': 'bg-amber-100 text-amber-700 border-amber-200',
    'Đã bán': 'bg-rose-100 text-rose-700 border-rose-200',
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", configs[status])}>
      {status}
    </span>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [showTxModal, setShowTxModal] = useState(false);

  useEffect(() => {
    fetch('/api/bundle')
      .then(res => res.json())
      .then(data => {
        setStore(data);
        setLoading(false);
      });
  }, []);

  const filteredLots = useMemo(() => {
    if (!store) return [];
    return store.lots.filter((lot: Lot) => {
      const matchesSearch = lot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            lot.block.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || lot.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [store, searchQuery, filterStatus]);

  const handleTransaction = async (formData: any) => {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    if (result.success) {
      // Delta update
      setStore((prev: any) => ({
        ...prev,
        lots: prev.lots.map((l: Lot) => l.id === result.lot.id ? result.lot : l),
        transactions: [...prev.transactions, result.transaction],
        revenue: [...prev.revenue, result.revenue]
      }));
      setShowTxModal(false);
      setSelectedLot(null);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-slate-600 font-medium italic">Đang tải dữ liệu BĐS PRO...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={cn(
        "bg-slate-900 text-slate-300 w-64 transition-all duration-300 flex-shrink-0 flex flex-col",
        !isSidebarOpen && "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl bg-blue-600">
            B
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-white">BĐS PRO</span>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'map', label: 'Bản đồ thực địa', icon: MapIcon },
            { id: 'lots', label: 'Quản lý lô đất', icon: Layers },
            { id: 'transactions', label: 'Giao dịch', icon: CreditCard },
            { id: 'customers', label: 'Khách hàng', icon: Users },
            { id: 'staff', label: 'Nhân viên', icon: TrendingUp },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                activeTab === item.id ? "bg-blue-600 text-white" : "hover:bg-slate-800"
              )}
            >
              <item.icon size={20} className={activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-white"} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
          {isSidebarOpen ? (
            <>
              Tác giả: Nguyễn Công Dinh<br />
              Zalo: 0393990638<br />
              Mỹ Phước - Cần Thơ
            </>
          ) : 'PRO'}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg lg:hidden">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
              {activeTab === 'dashboard' && 'Tổng quan hệ thống'}
              {activeTab === 'map' && 'Bản đồ dự án'}
              {activeTab === 'lots' && 'Danh sách sản phẩm'}
              {activeTab === 'transactions' && 'Lịch sử giao dịch'}
              {activeTab === 'customers' && 'Quản lý khách hàng'}
              {activeTab === 'staff' && 'Đội ngũ nhân sự'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-64 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              AD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === 'dashboard' && <Dashboard store={store} setActiveTab={setActiveTab} />}
          {activeTab === 'map' && <MapView lots={store.lots} onSelectLot={setSelectedLot} />}
          {activeTab === 'lots' && <LotsView 
            lots={filteredLots} 
            onSelectLot={setSelectedLot} 
            filterStatus={filterStatus} 
            setFilterStatus={setFilterStatus} 
          />}
          {activeTab === 'transactions' && <TransactionsView transactions={store.transactions} store={store} />}
          {activeTab === 'customers' && <CustomersView customers={store.customers} />}
        </div>

        {/* Floating Detail Drawer */}
        {selectedLot && (
          <div className="absolute inset-y-0 right-0 w-96 bg-white shadow-2xl z-40 transform transition-transform border-l border-slate-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-slate-900">Chi tiết lô {selectedLot.name}</h3>
                <button onClick={() => setSelectedLot(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative group">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 italic">
                    Ảnh thực địa dự kiến
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={selectedLot.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Diện tích</p>
                    <p className="font-bold">{selectedLot.area} m²</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Hướng</p>
                    <p className="font-bold">{selectedLot.direction}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Đơn giá</p>
                    <p className="font-bold text-blue-600">{selectedLot.pricePerM2.toLocaleString()} đ/m²</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Mặt tiền</p>
                    <p className="font-bold">{selectedLot.frontage} m</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm text-blue-600 font-medium mb-1 uppercase tracking-wider">Tổng giá trị</p>
                  <p className="text-2xl font-black text-blue-800">{selectedLot.totalPrice.toLocaleString()} VNĐ</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 border-b pb-2">Thông tin kỹ thuật</h4>
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-slate-500">Block / Khu</span>
                    <span className="font-medium">{selectedLot.block}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-slate-500">Lộ giới</span>
                    <span className="font-medium">{selectedLot.roadWidth} m</span>
                  </div>
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-slate-500">Loại lô</span>
                    <span className="font-medium">{selectedLot.type}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  {selectedLot.status === 'Có sẵn' && (
                    <>
                      <button 
                        onClick={() => setShowTxModal(true)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Clock size={18} /> Khóa căn / Giữ chỗ
                      </button>
                      <button 
                         onClick={() => setShowTxModal(true)}
                         className="w-full py-3 border-2 border-amber-500 text-amber-600 rounded-xl font-bold hover:bg-amber-50 transition-all"
                      >
                        Vào cọc ngay
                      </button>
                    </>
                  )}
                  {selectedLot.status === 'Đang giữ chỗ' && (
                    <button 
                      onClick={() => setShowTxModal(true)}
                      className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all"
                    >
                      Xác nhận Đặt cọc
                    </button>
                  )}
                  {selectedLot.status === 'Đã cọc' && (
                    <button 
                      onClick={() => setShowTxModal(true)}
                      className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all"
                    >
                      Ký hợp đồng Chuyển nhượng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Modal */}
        {showTxModal && selectedLot && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-bold">Xử lý giao dịch: {selectedLot.name}</h3>
                <button onClick={() => setShowTxModal(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20}/></button>
              </div>
              <form className="p-6 space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleTransaction({
                  lotId: selectedLot.id,
                  customerId: formData.get('customerId'),
                  staffId: formData.get('staffId'),
                  type: formData.get('type'),
                  amount: formData.get('amount'),
                  commissionRate: formData.get('commissionRate')
                });
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Loại giao dịch</label>
                    <select name="type" className="w-full p-2.5 bg-slate-100 border-none rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Giữ chỗ">Giữ chỗ / Lock căn</option>
                      <option value="Đặt cọc">Đặt cọc</option>
                      <option value="Công chứng">Ký HĐ Chuyển nhượng</option>
                      <option value="Hủy cọc">Hủy cọc / Giải phóng lô</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Khách hàng</label>
                    <select name="customerId" className="w-full p-2.5 bg-slate-100 border-none rounded-lg">
                      {store.customers.map((c: any) => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nhân viên phụ trách</label>
                    <select name="staffId" className="w-full p-2.5 bg-slate-100 border-none rounded-lg">
                      {store.staff.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Số tiền thực thu (VNĐ)</label>
                    <input name="amount" type="number" required defaultValue="50000000" className="w-full p-2.5 bg-slate-100 border-none rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tỷ lệ hoa hồng (%)</label>
                    <input name="commissionRate" type="number" step="0.1" defaultValue="1.5" className="w-full p-2.5 bg-slate-100 border-none rounded-lg" />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all">
                    Xác nhận & Cập nhật hệ thống
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-3 italic">* Hệ thống sẽ tự động cập nhật trạng thái lô đất và tính toán hoa hồng.</p>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- SUB-VIEWS ---

function Dashboard({ store, setActiveTab }: { store: any, setActiveTab: (t: string) => void }) {
  const lotStats = {
    total: store.lots.length,
    available: store.lots.filter((l: any) => l.status === 'Có sẵn').length,
    holding: store.lots.filter((l: any) => l.status === 'Đang giữ chỗ').length,
    deposited: store.lots.filter((l: any) => l.status === 'Đã cọc').length,
    sold: store.lots.filter((l: any) => l.status === 'Đã bán').length,
  };

  const totalRevenue = store.revenue.reduce((acc: number, curr: any) => acc + curr.amount, 0);

  const doughnutData = {
    labels: ['Có sẵn', 'Giữ chỗ', 'Đã cọc', 'Đã bán'],
    datasets: [{
      data: [lotStats.available, lotStats.holding, lotStats.deposited, lotStats.sold],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng số lô', value: lotStats.total, icon: Layers, color: 'bg-blue-500' },
          { label: 'Đang mở bán', value: lotStats.available, icon: CheckCircle2, color: 'bg-emerald-500' },
          { label: 'Đã giao dịch', value: lotStats.sold + lotStats.deposited, icon: TrendingUp, color: 'bg-rose-500' },
          { label: 'Doanh thu thực thu', value: totalRevenue.toLocaleString() + ' đ', icon: CreditCard, color: 'bg-amber-500' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
              </div>
              <div className={cn("p-3 rounded-xl text-white", kpi.color)}>
                <kpi.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Trạng thái giỏ hàng</h3>
          <div className="h-64 flex items-center justify-center">
             <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {store.transactions.slice(-5).reverse().map((tx: any, idx: number) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                   {tx.type === 'Công chứng' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Clock size={16} className="text-blue-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{tx.type} lô {store.lots.find((l:any)=>l.id===tx.lotId)?.name}</p>
                  <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()} - {tx.amount.toLocaleString()} đ</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setActiveTab('transactions')}
            className="w-full mt-6 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Xem tất cả
          </button>
        </div>
      </div>
    </div>
  );
}

function MapView({ lots, onSelectLot }: { lots: Lot[], onSelectLot: (l: Lot) => void }) {
  const center: [number, number] = [10.034, 105.786];

  const getMarkerIcon = (status: Lot['status']) => {
    const colors = {
      'Có sẵn': '#10B981',
      'Đang giữ chỗ': '#3B82F6',
      'Đã cọc': '#F59E0B',
      'Đã bán': '#EF4444',
    };
    return new L.DivIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${colors[status]}; width: 24px; height: 24px; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <div className="h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
      <MapContainer center={center} zoom={16} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {lots.map(lot => (
          <Marker 
            key={lot.id} 
            position={[lot.lat, lot.lng]} 
            icon={getMarkerIcon(lot.status)}
            eventHandlers={{ click: () => onSelectLot(lot) }}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold text-sm mb-1">Lô {lot.name}</p>
                <p className="text-xs text-slate-500 mb-2">{lot.block} - {lot.area}m²</p>
                <StatusBadge status={lot.status} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 space-y-2">
        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Chú giải trạng thái</p>
        <div className="flex items-center gap-3 text-xs">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div> <span>Có sẵn</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div> <span>Đang giữ chỗ</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div> <span>Đã cọc</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div> <span>Đã bán</span>
        </div>
      </div>
    </div>
  );
}

function LotsView({ lots, onSelectLot, filterStatus, setFilterStatus }: { lots: Lot[], onSelectLot: (l: Lot) => void, filterStatus: string, setFilterStatus: (s: string) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {['All', 'Có sẵn', 'Đang giữ chỗ', 'Đã cọc', 'Đã bán'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border",
                filterStatus === s ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
              )}
            >
              {s === 'All' ? 'Tất cả' : s}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all">
          <Plus size={18} /> Thêm lô đất mới
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b">
            <tr>
              <th className="px-6 py-4">Mã Lô</th>
              <th className="px-6 py-4">Khu vực</th>
              <th className="px-6 py-4 text-right">Diện tích</th>
              <th className="px-6 py-4 text-right">Đơn giá</th>
              <th className="px-6 py-4 text-right">Tổng giá</th>
              <th className="px-6 py-4">Hướng</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lots.map(lot => (
              <tr 
                key={lot.id} 
                className="hover:bg-slate-50 cursor-pointer group transition-colors"
                onClick={() => onSelectLot(lot)}
              >
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-900">{lot.name}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{lot.block}</td>
                <td className="px-6 py-4 text-right font-medium">{lot.area} m²</td>
                <td className="px-6 py-4 text-right text-slate-500">{lot.pricePerM2.toLocaleString()} đ</td>
                <td className="px-6 py-4 text-right font-bold text-blue-600">{lot.totalPrice.toLocaleString()} đ</td>
                <td className="px-6 py-4">{lot.direction}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={lot.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded-lg transition-all">
                    <ChevronRight size={18} className="text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionsView({ transactions, store }: { transactions: any[], store: any }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="font-bold text-lg">Lịch sử giao dịch hệ thống</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Ngày</th>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Loại GD</th>
              <th className="px-6 py-4 text-right">Số tiền</th>
              <th className="px-6 py-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map(tx => {
              const lot = store.lots.find((l: any) => l.id === tx.lotId);
              const customer = store.customers.find((c: any) => c.id === tx.customerId);
              return (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{tx.id}</td>
                  <td className="px-6 py-4 text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold">{lot?.name}</span>
                    <p className="text-[10px] text-slate-500">{lot?.block}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{customer?.name}</p>
                    <p className="text-[10px] text-slate-500">{customer?.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-xs font-bold px-2 py-1 rounded",
                      tx.type === 'Công chứng' ? "text-emerald-600 bg-emerald-50" : "text-blue-600 bg-blue-50"
                    )}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">{tx.amount.toLocaleString()} đ</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                       <CheckCircle2 size={14} /> Hoàn tất
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomersView({ customers }: { customers: Customer[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map(c => (
        <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              {c.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900">{c.name}</h4>
              <p className="text-sm text-slate-500">Mã KH: {c.id}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone size={16} className="text-slate-400" /> {c.phone}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Landmark size={16} className="text-slate-400" /> {c.idCard}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin size={16} className="text-slate-400" /> {c.address}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex gap-2">
            <button className="flex-1 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              Hồ sơ
            </button>
            <button className="flex-1 py-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              Liên hệ
            </button>
          </div>
        </div>
      ))}
      <button className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
          <Plus size={24} />
        </div>
        <span className="font-bold">Thêm khách hàng</span>
      </button>
    </div>
  );
}
