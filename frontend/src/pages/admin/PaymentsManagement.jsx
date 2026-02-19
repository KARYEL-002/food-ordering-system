import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';
import { Edit2, Search, Eye } from 'lucide-react';
import api from '../../utils/api';
import EditPaymentModal from '../../components/modals/EditPaymentModal';
import PaymentPreviewModal from '../../components/modals/PaymentPreviewModal';
import Pagination from '../../components/Pagination';

const StatCard = ({ title, value, bgColor = '#FFFDF1' }) => (
  <div
    className="px-8 py-8 rounded-lg border-2 flex flex-col justify-center shadow-md transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    style={{ backgroundColor: bgColor, borderColor: '#704214' }}
  >
    <p style={{ color: '#704214' }} className="font-bold text-sm uppercase tracking-wider">
      {title}
    </p>
    <p style={{ color: '#704214' }} className="text-2xl font-bold mt-4">
      {value}
    </p>
  </div>
);

const PaymentsManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPayment, setEditingPayment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewingPayment, setPreviewingPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load payments');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
  };

  const confirmEdit = async (updatedPayment) => {
    try {
      setIsEditing(true);
      await api.put(`/orders/${updatedPayment.id}/status`, {
        payment_status: updatedPayment.payment_status
      });
      setOrders(orders.map(order => order.id === updatedPayment.id ? updatedPayment : order));
      setEditingPayment(null);
      // Hot reload - fetch fresh data
      setTimeout(() => fetchPayments(), 300);
    } catch (err) {
      alert('Failed to update payment');
    } finally {
      setIsEditing(false);
    }
  };

  const getFilteredPayments = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    let filtered = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());

      let dateMatch = true;
      switch (filterType) {
        case 'today':
          dateMatch = orderDay.getTime() === today.getTime();
          break;
        case 'week':
          dateMatch = orderDate >= weekAgo;
          break;
        case 'month':
          dateMatch = orderDate >= monthAgo;
          break;
        default:
          dateMatch = true;
      }

      const searchMatch = searchTerm === '' || 
        order.id.toString().includes(searchTerm) ||
        order.payment_method?.toLowerCase().includes(searchTerm.toLowerCase());

      return dateMatch && searchMatch;
    });

    return filtered;
  };

  const filteredPayments = getFilteredPayments();
  const totalPayments = filteredPayments.length;
  const cashPayments = filteredPayments.filter(o => (o.payment_method || '').toLowerCase() === 'cash').length;
  const onlinePayments = filteredPayments.filter(o => (o.payment_method || '').toLowerCase() === 'online').length;

  const parseAmount = (v) => {
    if (v == null) return 0;
    // strip currency symbols and thousands separators
    const cleaned = String(v).replace(/[^0-9.-]+/g, '');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const totalRevenue = filteredPayments
    .filter(o => (o.payment_status || '').toLowerCase() === 'paid')
    .reduce((sum, o) => sum + parseAmount(o.total_amount), 0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(filteredPayments.length / pageSize) || 1;
  const pagedPayments = filteredPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => setCurrentPage(1), [filterType, searchTerm, pageSize]);

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#FFFDF1' }}>
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar - Fixed on mobile, hidden on desktop */}
      <div
        className={`fixed z-40 transform transition-transform h-screen w-56 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-20">
          <AdminTopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Title */}
            <h1
              style={{ color: '#704214' }}
              className="text-4xl font-bold mb-8"
            >
              PAYMENT MANAGEMENT
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <StatCard title="TOTAL PAYMENTS" value={totalPayments} />
              <StatCard title="CASH" value={cashPayments} />
              <StatCard title="ONLINE PAYMENT" value={onlinePayments} />
              <StatCard title="REVENUE" value={`₱${parseFloat(totalRevenue).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`} />
            </div>

            {/* Filter Section */}
            <div className="mb-8 flex gap-4 items-center p-6 rounded-lg border-2 flex-wrap" style={{ borderColor: '#704214', backgroundColor: 'white' }}>
              <div className="flex gap-3">
                {['all', 'today', 'week', 'month'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className="px-6 py-2 rounded-lg font-semibold transition-all text-sm"
                    style={{
                      backgroundColor: filterType === type ? '#704214' : '#FFFDF1',
                      color: filterType === type ? 'white' : '#704214',
                      border: `2px solid #704214`
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex-1 relative border-2 rounded-lg ml-4" style={{ borderColor: '#704214' }}>
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-2 bg-white outline-none text-sm"
                  style={{ color: '#704214' }}
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  size={18}
                  style={{ color: '#704214' }}
                />
              </div>
            </div>

            {/* Table Section */}
            {loading ? (
              <div className="text-center py-12">
                <p style={{ color: '#704214' }} className="font-bold">
                  Loading payments...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p style={{ color: '#704214' }} className="font-bold">
                  {error}
                </p>
                <button
                  onClick={fetchPayments}
                  className="mt-4 px-6 py-2 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700"
                >
                  Retry
                </button>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: '#704214' }} className="font-bold">
                  No payments found
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border-2 shadow-md transform transition-all duration-200 hover:shadow-lg" style={{ borderColor: '#704214' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#FFFDF1', borderBottom: '2px solid #704214' }}>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Order ID</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Payment Method</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Amount</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Payment Status</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Payment Date</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Status</p>
                      </th>
                      <th className="px-6 py-5 text-left" style={{ color: '#704214' }}>
                        <p className="font-bold text-base">Actions</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedPayments.map((order, index) => (
                      <tr
                        key={order.id}
                        className="table-row-hover fade-transition cursor-pointer transition-colors hover:bg-blue-50"
                        style={{
                          backgroundColor: index % 2 === 0 ? '#FFFDF1' : 'white',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                        onClick={() => setPreviewingPayment(order)}
                      >
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="font-semibold text-base">#{String(order.id).padStart(4, '0')}</p>
                        </td>
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="text-base capitalize">{order.payment_method || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="text-base font-semibold">₱{parseFloat(order.total_amount).toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="text-base capitalize">{order.payment_status || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-5" style={{ color: '#704214' }}>
                          <p className="text-base">
                            {new Date(order.created_at).toLocaleString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className="px-3 py-1 rounded-full text-sm font-bold"
                            style={{
                              backgroundColor: order.payment_status === 'paid' ? '#C0F4C4' : '#FFD9B3',
                              color: order.payment_status === 'paid' ? '#065F46' : '#704214'
                            }}
                          >
                            {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(order)}
                              className="px-3 py-1.5 rounded-lg font-bold text-white transition-transform transform hover:-translate-y-0.5 hover:scale-105 hover:opacity-90 flex items-center gap-1 text-sm btn-hover scale-transition shadow-sm"
                              style={{ backgroundColor: '#00BCD4' }}
                            >
                              <Edit2 size={16} />
                              Edit
                            </button>

                            <button
                              onClick={() => setPreviewingPayment(order)}
                              className="px-3 py-1.5 rounded-lg font-bold transition-opacity hover:opacity-80 flex items-center gap-1 text-sm btn-hover scale-transition"
                              style={{ backgroundColor: '#FFD166', color: '#704214' }}
                              title="Preview"
                            >
                              <Eye size={16} />
                              Preview
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={pageSize}
                  pageSizeOptions={[10,25,50,100]}
                  onPageSizeChange={setPageSize}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <PaymentPreviewModal
        isOpen={!!previewingPayment}
        payment={previewingPayment}
        onClose={() => setPreviewingPayment(null)}
        onEdit={() => {
          setEditingPayment(previewingPayment);
          setPreviewingPayment(null);
        }}
      />

      <EditPaymentModal
        isOpen={!!editingPayment}
        payment={editingPayment}
        onConfirm={confirmEdit}
        onCancel={() => setEditingPayment(null)}
        isLoading={isEditing}
      />

    </div>
  );
};

export default PaymentsManagement;
