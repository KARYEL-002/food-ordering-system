import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
        <div style={{ position: 'relative', height: '250px' }}>
          <Bar
            data={{
              labels: data.map(d => d.name),
              datasets: [
                {
                  label: 'Sales',
                  data: data.map(d => d.sales),
                  backgroundColor: '#C5A572',
                  borderColor: '#704214',
                  borderWidth: 1,
                  borderRadius: 8,
                },
              ],
            }}
            options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: '#704214',
                    font: { size: 12 },
                    padding: 15,
                  },
                },
                tooltip: {
                  backgroundColor: '#FFF5E6',
                  titleColor: '#704214',
                  bodyColor: '#704214',
                  borderColor: '#704214',
                  borderWidth: 2,
                  padding: 10,
                  callbacks: {
                    label: (context) => `Sales: ${context.parsed.x}`,
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: '#704214',
                  },
                  grid: {
                    color: '#FFD9B3',
                  },
                },
                y: {
                  ticks: {
                    color: '#704214',
                  },
                  grid: {
                    color: '#FFD9B3',
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p style={{ color: '#704214' }}>No sales data available</p>
        </div>
      )}
    </div>
  );
};

export default TopSellingProducts;
