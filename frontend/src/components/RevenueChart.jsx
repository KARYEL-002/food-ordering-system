import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const response = await api.get('/orders');
      const orders = response.data.data || [];

      // Filter only paid and completed orders
      const paidCompletedOrders = orders.filter(
        order => order.status === 'completed' && order.payment_status === 'paid'
      );

      // Calculate revenue for each day of the week
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const now = new Date();
      const weekData = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayName = days[date.getDay()];
        const dateStr = date.toDateString();

        // Sum revenue for this day (only paid and completed orders)
        const dayRevenue = paidCompletedOrders
          .filter(order => new Date(order.created_at).toDateString() === dateStr)
          .reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);

        weekData.push({
          day: dayName,
          revenue: Math.round(dayRevenue)
        });
      }

      setData(weekData);
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
      // Use fallback data
      setData([
        { day: 'Mon', revenue: 0 },
        { day: 'Tue', revenue: 0 },
        { day: 'Wed', revenue: 0 },
        { day: 'Thu', revenue: 0 },
        { day: 'Fri', revenue: 0 },
        { day: 'Sat', revenue: 0 },
        { day: 'Sun', revenue: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl p-6 border-2" style={{ 
      backgroundColor: '#FFEFD5', 
      borderColor: '#704214',
      boxShadow: '0 10px 25px rgba(112, 66, 20, 0.15)'
    }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: '#704214' }}>DAILY REVENUE TREND</h2>
      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <p style={{ color: '#704214' }}>Loading chart...</p>
        </div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFD9B3" />
            <XAxis dataKey="day" stroke="#704214" />
            <YAxis stroke="#704214" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#FFF5E6', border: '2px solid #704214', borderRadius: '8px' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#704214" 
              strokeWidth={3}
              dot={{ fill: '#704214', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-80 flex items-center justify-center">
          <p style={{ color: '#704214' }}>No data available</p>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
