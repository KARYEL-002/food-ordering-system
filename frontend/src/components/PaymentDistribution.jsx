import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

const PaymentDistribution = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#704214', '#C5A572', '#D4C5B0', '#FFD9B3', '#FFFDF1'];

  useEffect(() => {
    fetchPaymentDistribution();
  }, []);

  const fetchPaymentDistribution = async () => {
    try {
      const response = await api.get('/orders');
      const orders = response.data.data || [];

      // Filter only paid and completed orders
      const paidCompletedOrders = orders.filter(
        order => order.status === 'completed' && order.payment_status === 'paid'
      );

      // Count payment methods
      const paymentCount = {};
      
      paidCompletedOrders.forEach(order => {
        const method = order.payment_method || 'Unknown';
        paymentCount[method] = (paymentCount[method] || 0) + 1;
      });

      // Convert to array for pie chart
      const chartData = Object.entries(paymentCount)
        .map(([name, value]) => ({ 
          name: name.charAt(0).toUpperCase() + name.slice(1), 
          value 
        }));

      setData(chartData.length > 0 ? chartData : [
        { name: 'No data', value: 1 }
      ]);
    } catch (error) {
      console.error('Failed to fetch payment distribution:', error);
      setData([{ name: 'No data', value: 1 }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl p-6 border-2" style={{ 
      backgroundColor: '#FFEFD5', 
      borderColor: '#704214',
      boxShadow: '0 10px 25px rgba(112, 66, 20, 0.15)'
    }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: '#704214' }}>PAYMENT DISTRIBUTION</h2>
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <p style={{ color: '#704214' }}>Loading payment data...</p>
        </div>
      ) : data.length > 0 && data[0].name !== 'No data' ? (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#FFF5E6', border: '2px solid #704214', borderRadius: '8px' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p style={{ color: '#704214' }}>No payment data available</p>
        </div>
      )}
    </div>
  );
};

export default PaymentDistribution;
