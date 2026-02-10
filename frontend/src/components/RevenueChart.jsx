import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
        <div style={{ position: 'relative', height: '300px' }}>
          <Line
            data={{
              labels: data.map(d => d.day),
              datasets: [
                {
                  label: 'Revenue',
                  data: data.map(d => d.revenue),
                  borderColor: '#704214',
                  backgroundColor: 'rgba(112, 66, 20, 0.05)',
                  borderWidth: 3,
                  fill: true,
                  pointBackgroundColor: '#704214',
                  pointBorderColor: '#704214',
                  pointRadius: 5,
                  pointHoverRadius: 7,
                  tension: 0.3,
                },
              ],
            }}
            options={{
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
                    label: (context) => `Revenue: ₱${context.parsed.y.toLocaleString()}`,
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
        <div className="h-80 flex items-center justify-center">
          <p style={{ color: '#704214' }}>No data available</p>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
