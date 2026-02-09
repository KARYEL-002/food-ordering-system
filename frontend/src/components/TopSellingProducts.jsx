import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

const TopSellingProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSellingProducts();
  }, []);

  const fetchTopSellingProducts = async () => {
    try {
      // Fetch orders to count sales
      const ordersRes = await api.get('/orders').catch(() => ({ data: { data: [] } }));

      const orders = ordersRes.data.data || [];

      // Filter only paid and completed orders
      const paidCompletedOrders = orders.filter(
        order => order.status === 'completed' && order.payment_status === 'paid'
      );

      // Count how many items sold
      const salesCount = {};
      
      paidCompletedOrders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const itemName = item.menu_item?.name || 'Unknown';
            salesCount[itemName] = (salesCount[itemName] || 0) + (item.quantity || 1);
          });
        }
      });

      // Convert to array and sort by sales
      const chartData = Object.entries(salesCount)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 6); // Top 6 products

      setData(chartData.length > 0 ? chartData : [
        { name: 'No data', sales: 0 }
      ]);
    } catch (error) {
      console.error('Failed to fetch top selling products:', error);
      setData([{ name: 'No data', sales: 0 }]);
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
      <h2 className="text-lg font-bold mb-4" style={{ color: '#704214' }}>TOP SELLING PRODUCTS</h2>
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <p style={{ color: '#704214' }}>Loading products...</p>
        </div>
      ) : data.length > 0 && data[0].name !== 'No data' ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFD9B3" />
            <XAxis dataKey="name" stroke="#704214" />
            <YAxis stroke="#704214" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#FFF5E6', border: '2px solid #704214', borderRadius: '8px' }}
            />
            <Bar 
              dataKey="sales" 
              fill="#C5A572"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p style={{ color: '#704214' }}>No sales data available</p>
        </div>
      )}
    </div>
  );
};

export default TopSellingProducts;
